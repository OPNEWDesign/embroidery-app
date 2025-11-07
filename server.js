import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Generate embroidery images
app.post('/api/generate', async (req, res) => {
  try {
    const { prompt, parameters } = req.body;

    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${process.env.REPLICATE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: 'YOUR_MODEL_VERSION_ID', // replace with your replicate model version
        input: { prompt, ...parameters }
      }),
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to generate embroidery' });
  }
});

// Upscale selected image
app.post('/api/upscale', async (req, res) => {
  try {
    const { imageUrl, scale } = req.body;

    const response = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${process.env.REPLICATE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: 'YOUR_UPSCALE_MODEL_VERSION_ID', // replace with your replicate model version
        input: { image: imageUrl, scale }
      }),
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to upscale image' });
  }
});

// Background removal (free)
app.post('/api/remove-background', async (req, res) => {
  try {
    const { imageUrl } = req.body;

    // Replace this with your chosen background removal API or service
    const removedBackgroundUrl = imageUrl; // placeholder: returns same image

    res.json({ result: removedBackgroundUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to remove background' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
