const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hexacarb',
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
  corsOrigin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',').map(s => s.trim()) : ['http://localhost:5173'],
  adminSeed: {
    email: process.env.ADMIN_SEED_EMAIL || 'admin@hexacarb.com',
    password: process.env.ADMIN_SEED_PASSWORD || 'Admin@123',
  },
};
