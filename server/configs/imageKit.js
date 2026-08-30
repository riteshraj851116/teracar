import ImageKit from "imagekit";

let imagekit = null;

const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;

const isConfigured = 
  publicKey && 
  !publicKey.includes('Enter your') &&
  privateKey && 
  !privateKey.includes('Enter your') &&
  urlEndpoint && 
  !urlEndpoint.includes('Enter your');

if (isConfigured) {
  try {
    imagekit = new ImageKit({
      publicKey,
      privateKey,
      urlEndpoint
    });
  } catch (err) {
    console.warn("ImageKit initialization warning:", err.message);
  }
}

// Fallback helper proxy if ImageKit is not configured
const imagekitProxy = imagekit || {
  upload: async () => {
    throw new Error("ImageKit keys not configured in server/.env, using local fallback");
  },
  url: () => ""
};

export default imagekitProxy;