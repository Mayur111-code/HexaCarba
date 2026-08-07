const dotenv = require('dotenv');
dotenv.config();

const parsePort = (value, fallback) => {
  const n = parseInt(value, 10);
  return Number.isInteger(n) && n > 0 ? n : fallback;
};

const parseBool = (value, fallback = false) => {
  if (value === undefined || value === null) return fallback;
  return ['true', '1', 'yes', 'on'].includes(String(value).toLowerCase());
};

const toArray = (value) =>
  value
    ? value.split(',').map((s) => s.trim()).filter(Boolean)
    : [];

const nodeEnv = process.env.NODE_ENV || 'development';
const isProduction = nodeEnv === 'production';

module.exports = {
  port: parsePort(process.env.PORT, 5000),
  nodeEnv,
  isProduction,
  // support both MONGO_URI and MONGODB_URI so existing setups keep working
  mongoUri:
    process.env.MONGODB_URI ||
    process.env.MONGO_URI ||
    'mongodb://127.0.0.1:27017/hexacarb',
  serverUrl: (process.env.SERVER_URL || '').replace(/\/+$/, ''),
  clientUrl: (process.env.CLIENT_URL || '').replace(/\/+$/, ''),
  jwt: {
    secret: process.env.JWT_SECRET || 'default_jwt_secret',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'default_refresh_secret',
    expire: process.env.JWT_EXPIRE || '7d',
    refreshExpire: process.env.JWT_REFRESH_EXPIRE || '30d',
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
  corsOrigin: toArray(process.env.CORS_ORIGIN) || toArray(process.env.CLIENT_URL) || ['http://localhost:5173'],
  // Express 'trust proxy' setting. Behind a single proxy (e.g. Render/Vercel) use 1.
  trustProxy: process.env.TRUST_PROXY === undefined ? (isProduction ? 1 : 1) : process.env.TRUST_PROXY === 'false' || process.env.TRUST_PROXY === '0' ? false : 1,
  rateLimit: {
    windowMs: 15 * 60 * 1000,
    max: parsePort(process.env.RATE_LIMIT_MAX, 500),
    loginWindowMs: 15 * 60 * 1000,
    loginMax: parsePort(process.env.LOGIN_RATE_LIMIT_MAX, 20),
  },
  uploadDir: process.env.UPLOAD_DIR || 'uploads',
  maxFileSize: parsePort(process.env.MAX_FILE_SIZE, 5 * 1024 * 1024),
  adminSeed: {
    email: process.env.ADMIN_SEED_EMAIL || 'admin@hexacarb.com',
    password: process.env.ADMIN_SEED_PASSWORD || 'Admin@123',
  },
};