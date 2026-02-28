import ImageKit from 'imagekit';

export default async function handler(req, res) {
  // 1. Handle CORS (Allow all origins or specific domain)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // 2. Handle Preflight Options
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 3. Ensure Environment Variables exist
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
  const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;

  if (!privateKey || !publicKey || !urlEndpoint) {
    console.error('Missing ImageKit Environment Variables');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    // 4. Initialize ImageKit Node SDK
    const imagekit = new ImageKit({
      publicKey: publicKey,
      privateKey: privateKey,
      urlEndpoint: urlEndpoint
    });

    // 5. Generate Auth Params
    const authenticationParameters = imagekit.getAuthenticationParameters();

    // 6. Return JSON
    return res.status(200).json(authenticationParameters);

  } catch (error) {
    console.error('ImageKit Auth Error:', error);
    return res.status(500).json({ error: 'Authentication failed' });
  }
}
