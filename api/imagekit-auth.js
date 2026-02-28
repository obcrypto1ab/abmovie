const ImageKit = require("imagekit");

const imagekit = new ImageKit({
  publicKey: "public_Wt+RjZXgdesltZmb4M/5SO8ncZk=",
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY, // Ensure this is set in Vercel Env Variables
  urlEndpoint: "https://ik.imagekit.io/4maqtfplt"
});

export default function handler(req, res) {
  // CORS Handling for browser fetch
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*'); // Or set to your Vercel domain
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const authenticationParameters = imagekit.getAuthenticationParameters();
    res.status(200).json(authenticationParameters);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Auth failed" });
  }
}
