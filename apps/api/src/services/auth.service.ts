import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { User } from '../models/User';
import { config } from '../config';
import { HttpError } from '../utils/errors';
import { randomBytes } from 'crypto';
import { recoverAddressFromPersonalSign } from '../utils/crypto';

const RegisterSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(24),
  password: z.string().min(6),
});

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export type JwtPayload = { id: string };

export function signJWT(id: string) {
  return jwt.sign({ id }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
}

export function sanitizeUser(user: any) {
  return {
    id: user._id,
    email: user.email,
    username: user.username,
    balance: user.balance,
    walletAddress: user.walletAddress,
    bio: user.bio,
  };
}

export const AuthService = {
  async register(payload: unknown) {
    const data = RegisterSchema.parse(payload);
    const exists = await User.findOne({
      $or: [{ email: data.email }, { username: data.username }],
    });
    if (exists) throw HttpError.badRequest('Email or username already in use');

    const hash = await bcrypt.hash(data.password, 10);
    const user = await User.create({
      email: data.email,
      username: data.username,
      passwordHash: hash,
      avatarSeed: data.username,
      balance: 250,
    });
    return sanitizeUser(user);
  },

  async login(payload: unknown) {
    const data = LoginSchema.parse(payload);
    const user = await User.findOne({ email: data.email });
    if (!user) throw HttpError.badRequest('Invalid credentials');
    const ok = await bcrypt.compare(data.password, user.passwordHash);
    if (!ok) throw HttpError.badRequest('Invalid credentials');
    return sanitizeUser(user);
  },

  async me(id: string) {
    const user = await User.findById(id);
    if (!user) throw HttpError.unauthorized('Unauthorized');
    return sanitizeUser(user);
  },

  async issueNonce(addressRaw: string, domain: string, uri: string) {
    const address = String(addressRaw || '').toLowerCase();
    if (!/^0x[a-f0-9]{40}$/.test(address)) throw HttpError.badRequest('Invalid address');

    const nonce = randomBytes(16).toString('hex');
    const user =
      (await User.findOneAndUpdate(
        { walletAddress: address },
        { $set: { loginNonce: nonce, loginNonceIssuedAt: new Date() } },
        { new: true }
      )) ||
      (await User.create({
        email: `${address}@wallet.local`,
        username: `user_${address.slice(2, 8)}`,
        passwordHash: await bcrypt.hash(randomBytes(16).toString('hex'), 10),
        balance: 200,
        walletAddress: address,
        loginNonce: nonce,
        loginNonceIssuedAt: new Date(),
        avatarSeed: address,
      }));

    const statement = 'Sign in to Spectra Market';
    const issuedAt =
      user.loginNonceIssuedAt?.toISOString() || new Date().toISOString();

    const message = [
      `${domain} wants you to sign in with your Ethereum account:`,
      address,
      '',
      statement,
      '',
      `URI: ${uri}`,
      `Version: 1`,
      `Chain ID: 1`,
      `Nonce: ${nonce}`,
      `Issued At: ${issuedAt}`,
    ].join('\n');

    return { nonce, statement, domain, uri, message };
  },

  async walletLogin(addressRaw: string, signature: string, domain: string, uri: string) {
    const address = String(addressRaw || '').toLowerCase();
    if (!/^0x[a-f0-9]{40}$/.test(address)) throw HttpError.badRequest('Invalid address');
    if (!/^0x[0-9a-fA-F]+$/.test(signature)) throw HttpError.badRequest('Invalid signature');

    const user = await User.findOne({ walletAddress: address });
    if (!user || !user.loginNonce || !user.loginNonceIssuedAt)
      throw HttpError.badRequest('No nonce for address');

    if (Date.now() - user.loginNonceIssuedAt.getTime() > config.nonceTtlMs) {
      user.loginNonce = undefined;
      user.loginNonceIssuedAt = undefined;
      await user.save();
      throw HttpError.badRequest('Nonce expired. Please try again.');
    }

    const message = [
      `${domain} wants you to sign in with your Ethereum account:`,
      address,
      '',
      'Sign in to Spectra Market',
      '',
      `URI: ${uri}`,
      `Version: 1`,
      `Chain ID: 1`,
      `Nonce: ${user.loginNonce}`,
      `Issued At: ${user.loginNonceIssuedAt.toISOString()}`,
    ].join('\n');

    const recovered = recoverAddressFromPersonalSign(message, signature);
    if (recovered !== address) {
      throw HttpError.badRequest('Signature does not match address');
    }

    user.loginNonce = undefined;
    user.loginNonceIssuedAt = undefined;
    await user.save();

    return sanitizeUser(user);
  },
};