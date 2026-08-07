require('dotenv').config();
const ImageKit = require('imagekit');

let cached = null;

const getImageKit = () => {
  if (cached) return cached;

  const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;

  if (!publicKey || !privateKey || !urlEndpoint) {
    const error = new Error(
      'ImageKit is not configured. Set IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY and IMAGEKIT_URL_ENDPOINT in .env.'
    );
    error.name = 'ImageKitNotConfigured';
    throw error;
  }

  cached = new ImageKit({ publicKey, privateKey, urlEndpoint });
  return cached;
};

module.exports = { getImageKit };