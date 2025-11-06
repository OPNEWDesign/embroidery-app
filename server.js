import express from 'express';
import cors from 'cors';
import Replicate from 'replicate';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Replicate
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Generate embroidery variations
app.post('/api/generate', async (req, res) => {
  try {
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({ error: 'Image URL is required' });
    }

    console.log('Generating embroidery variations...');

    // Generate 4 variations with different embroidery styles
    const prompts = [
      "embroidery art style, detailed stitching, fabric texture, traditional embroidery",
      "cross-stitch pattern, pixel art embroidery, colorful threads, handmade craft",
      "silk embroidery, elegant stitching, fine details, luxury textile art",
      "modern embroidery, bold colors, contemporary textile art, artistic stitching"
    ];

    const promises = prompts.map(async (prompt) => {
      const output = await replicate.run(
        "black-forest-labs/flux-dev",
        {
          input: {
            prompt: `${prompt}, based on this image`,
            image: imageUrl,
            guidance: 7.5,
            num_inference_steps: 28,
            output_format: "png"
          }
        }
      );
      
      return Array.isArray(output) ? output[0] : output;
    });

    const results = await Promise.all(promises);

    console.log('Generation complete!');
    res.json({ images: results });

  } catch (error) {
    console.error('Generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate images',
      details: error.message 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});