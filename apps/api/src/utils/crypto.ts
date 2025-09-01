import {
  ecrecover,
  fromRpcSig,
  hashPersonalMessage,
  pubToAddress,
  toBuffer,
  bufferToHex,
} from 'ethereumjs-util';

export function recoverAddressFromPersonalSign(message: string, signature: string) {
  const msgHash = hashPersonalMessage(toBuffer(Buffer.from(message, 'utf8')));
  const { v, r, s } = fromRpcSig(signature);
  const pubKey = ecrecover(msgHash, v, r, s);
  const addrBuf = pubToAddress(pubKey);
  return bufferToHex(addrBuf).toLowerCase();
}