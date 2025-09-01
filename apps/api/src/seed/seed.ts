import { connectDB } from '../db';
import { User } from '../models/User';
import { Collection } from '../models/Collection';
import { NFT } from '../models/NFT';
import { Transaction } from '../models/Transaction';
import mongoose from 'mongoose';

function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashSeed(str: string) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const SEED_STRING = process.env.SEED_STRING || 'dev';
const RNG = mulberry32(hashSeed(SEED_STRING));

const PROFILE = (process.env.SEED_PROFILE || 'small').toLowerCase() as
  | 'small'
  | 'medium'
  | 'large';

const DEFAULTS = {
  small: { users: 5, collections: 3, nfts: 48, withTxs: true },
  medium: { users: 12, collections: 8, nfts: 240, withTxs: true },
  large: { users: 30, collections: 20, nfts: 1200, withTxs: true },
}[PROFILE];

const USERS = Number(process.env.SEED_USERS || DEFAULTS.users);
const COLLECTIONS = Number(
  process.env.SEED_COLLECTIONS || DEFAULTS.collections
);
const NFTS = Number(process.env.SEED_NFTS || DEFAULTS.nfts);
const SEED_TXNS =
  String(
    process.env.SEED_TXNS || (DEFAULTS.withTxs ? 'yes' : 'no')
  ).toLowerCase() === 'yes';

const USE_LOCAL_IMAGES =
  String(process.env.SEED_LOCAL_IMAGES || 'no').toLowerCase() === 'yes';
const IMAGE_SIZE = Number(process.env.IMAGE_SIZE || 1200);

function choice<T>(arr: T[]) {
  return arr[Math.floor(RNG() * arr.length)];
}
function randInt(min: number, max: number) {
  return Math.floor(RNG() * (max - min + 1)) + min;
}
function randFloat(min: number, max: number, decimals = 2) {
  const v = RNG() * (max - min) + min;
  const p = Math.pow(10, decimals);
  return Math.round(v * p) / p;
}

function imgUrl(seed: string, size = IMAGE_SIZE) {
  if (USE_LOCAL_IMAGES) {
    return `/uploads/${encodeURIComponent(seed)}_${size}.png`;
  }
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${size}/${size}`;
}

async function main() {
  const conn = await connectDB();

  await Promise.all([
    User.deleteMany({}),
    Collection.deleteMany({}),
    NFT.deleteMany({}),
    Transaction.deleteMany({}),
  ]);

  const firstNames = [
    'Alice',
    'Bob',
    'Charlie',
    'Diana',
    'Eve',
    'Frank',
    'Grace',
    'Hank',
    'Ivy',
    'Jack',
    'Kara',
    'Leo',
    'Mona',
    'Ned',
    'Owen',
    'Pia',
    'Quinn',
    'Ray',
    'Sara',
    'Toby',
    'Uma',
    'Vik',
    'Wes',
    'Xena',
    'Yara',
    'Zack',
  ];
  const lastNames = [
    'Stone',
    'Woods',
    'Rivera',
    'Nguyen',
    'Hernandez',
    'Kim',
    'Patel',
    'Okafor',
    'Khan',
    'Schmidt',
    'Moretti',
    'Kowalski',
    'Silva',
    'Fernandez',
    'Sato',
    'Tanaka',
    'Park',
    'Ivanov',
  ];

  const users: any[] = [];
  for (let i = 0; i < USERS; i++) {
    const fn = choice(firstNames);
    const ln = choice(lastNames);
    const username = `${fn.toLowerCase()}_${ln.toLowerCase()}_${i}`;
    const email = `${username}@example.com`;
    const avatarSeed = `${fn}-${ln}-${SEED_STRING}-${i}`;
    const balance = randFloat(50, 2000, 2);
    const passwordHash =
      '$2a$10$uM7p3nRWsxZ.ZKqXUSY1qOj0e7r1PMyAo4vu1cWJrd19IP5KgiVEa';

    users.push({
      email,
      username,
      passwordHash,
      balance,
      avatarSeed,
      bio: `${fn} ${ln} is a digital creator focused on ${choice([
        'generative art',
        'photography',
        '3D art',
        'AI art',
        'illustration',
      ])}.`,
      createdAt: new Date(Date.now() - randInt(5, 60) * 24 * 3600 * 1000),
    });
  }
  const userDocs = await User.create(users, { ordered: true });

  const categories = ['Art', 'Photography', 'Generative', '3D', 'AI', 'Music'];
  const adjectives = [
    'Neon',
    'Aqua',
    'Golden',
    'Midnight',
    'Crimson',
    'Emerald',
    'Velvet',
    'Solar',
    'Lunar',
    'Prismatic',
  ];
  const nouns = [
    'Dreams',
    'Echo',
    'Horizons',
    'Fragments',
    'Pulse',
    'Mirage',
    'Spectrum',
    'Canvas',
    'Glyphs',
    'Nebula',
  ];

  const collections: any[] = [];
  for (let i = 0; i < COLLECTIONS; i++) {
    const name = `${choice(adjectives)} ${choice(nouns)}`;
    const creator = choice(userDocs);
    const category = choice(categories);
    const bannerSeed = `${name}-banner-${SEED_STRING}`;
    const desc = `A curated collection exploring ${choice([
      'light',
      'texture',
      'color fields',
      'motion blur',
      'minimal forms',
      'organic symmetry',
    ])} in ${category.toLowerCase()}.`;

    collections.push({
      name,
      description: desc,
      creator: creator._id,
      category,
      bannerSeed,
      createdAt: new Date(Date.now() - randInt(1, 40) * 24 * 3600 * 1000),
    });
  }
  const colDocs = await Collection.create(collections, { ordered: true });

  const traitBackground = [
    'Purple',
    'Teal',
    'Gold',
    'Crimson',
    'Indigo',
    'Emerald',
  ];
  const traitAura = ['Soft', 'Vivid', 'Sharp', 'Diffuse', 'Glowing'];
  const traitElement = ['Fire', 'Water', 'Air', 'Earth', 'Aether'];
  const rarityDist = [
    { name: 'Common', weight: 60 },
    { name: 'Uncommon', weight: 25 },
    { name: 'Rare', weight: 10 },
    { name: 'Epic', weight: 4 },
    { name: 'Legendary', weight: 1 },
  ];

  function weightedRarity() {
    const total = rarityDist.reduce((a, b) => a + b.weight, 0);
    let r = RNG() * total;
    for (const item of rarityDist) {
      if ((r -= item.weight) <= 0) return item.name;
    }
    return rarityDist[0].name;
  }

  const nfts: any[] = [];
  for (let i = 0; i < NFTS; i++) {
    const collection = colDocs[i % colDocs.length];
    const creator = choice(userDocs);
    const owner = choice(userDocs);

    const series = collection.name.split(' ').join('');
    const tokenName = `${series} #${i + 1}`;
    const seed = `${series}-${SEED_STRING}-${i + 1}`;
    const onSale = RNG() > 0.45;
    const cat = collection.category;
    const [minP, maxP] =
      cat === 'Photography'
        ? [0.1, 2.5]
        : cat === 'AI'
        ? [0.05, 1.5]
        : cat === '3D'
        ? [0.2, 5.0]
        : cat === 'Music'
        ? [0.05, 3.0]
        : ['Generative', 'Art'].includes(cat)
        ? [0.15, 10.0]
        : [0.1, 4.0];

    const price = onSale ? randFloat(minP, maxP, 3) : undefined;
    const createdAt = new Date(Date.now() - randInt(0, 50) * 24 * 3600 * 1000);

    const nft = {
      name: tokenName,
      description: `An edition from ${collection.name}, generated from seed ${seed}.`,
      imageSeed: seed,
      imageUrl: imgUrl(seed, IMAGE_SIZE),
      creator: creator._id,
      owner: owner._id,
      collectionId: collection._id,
      attributes: [
        {
          trait_type: 'Background',
          value: choice(traitBackground),
          rarity: weightedRarity(),
        },
        {
          trait_type: 'Aura',
          value: choice(traitAura),
          rarity: weightedRarity(),
        },
        {
          trait_type: 'Element',
          value: choice(traitElement),
          rarity: weightedRarity(),
        },
      ],
      price,
      onSale,
      createdAt,
    };
    const doc = await NFT.create(nft);
    nfts.push(doc);
  }

  if (SEED_TXNS) {
    const txs: any[] = [];
    const now = Date.now();
    function randIntLocal(min: number, max: number) {
      return Math.floor(RNG() * (max - min + 1)) + min;
    }
    function randFloatLocal(min: number, max: number, decimals = 3) {
      const v = RNG() * (max - min) + min;
      const p = Math.pow(10, decimals);
      return Math.round(v * p) / p;
    }

    for (const nft of nfts) {
      const initialOwner = nft.owner;
      const mintAt = new Date(now - randIntLocal(10, 60) * 24 * 3600 * 1000);
      txs.push({
        type: 'mint',
        nft: nft._id,
        to: initialOwner,
        createdAt: mintAt,
      });

      const hops = randIntLocal(0, 2);
      let currentOwner = initialOwner;
      for (let h = 0; h < hops; h++) {
        const newOwner = choice(userDocs)._id;
        const salePrice = randFloatLocal(0.05, 8.0, 3);
        const soldAt = new Date(
          mintAt.getTime() +
            randIntLocal(1, 20) * 24 * 3600 * 1000 +
            h * randIntLocal(1, 5) * 3600 * 1000
        );
        txs.push({
          type: 'sale',
          nft: nft._id,
          from: currentOwner,
          to: newOwner,
          price: salePrice,
          createdAt: soldAt,
        });
        currentOwner = newOwner;
      }

      if (nft.onSale && nft.price) {
        const listAt = new Date(now - randIntLocal(1, 7) * 24 * 3600 * 1000);
        txs.push({
          type: 'list',
          nft: nft._id,
          from: currentOwner,
          price: nft.price,
          createdAt: listAt,
        });
      }
    }

    if (txs.length) {
      await Transaction.insertMany(txs, { ordered: false });
    }
  }

  await mongoose.connection.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});