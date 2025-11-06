// api/index.js
export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json({ message: "Backend is working!" });
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}