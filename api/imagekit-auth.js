// /api/imagekit-auth.js
const ImageKit = require("imagekit");

module.exports = async (req, res) => {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Preflight
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Read env vars
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
  const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;

  const missing = [];
  if (!privateKey) missing.push("IMAGEKIT_PRIVATE_KEY");
  if (!publicKey) missing.push("IMAGEKIT_PUBLIC_KEY");
  if (!urlEndpoint) missing.push("IMAGEKIT_URL_ENDPOINT");

  if (missing.length) {
    return res.status(500).json({
      error: "Missing ImageKit environment variables",
      missing
    });
  }

  try {
    const imagekit = new ImageKit({
      publicKey,
      privateKey,
      urlEndpoint
    });

    const auth = imagekit.getAuthenticationParameters();
    // { token, expire, signature }
    return res.status(200).json(auth);
  } catch (err) {
    console.error("ImageKit auth crash:", err);
    return res.status(500).json({
      error: "ImageKit auth failed",
      message: err?.message || "unknown"
    });
  }
};
