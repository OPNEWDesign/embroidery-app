import { useState } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResults([]);
      setError(null);
    }
  };

  const handleGenerate = async () => {
    if (!selectedFile) {
      setError('Please select an image first');
      return;
    }

    setLoading(true);
    setError(null);
    setResults([]);

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      
      reader.onload = async () => {
        const base64Image = reader.result;

        // Call backend API
        const response = await axios.post(`${API_URL}/api/generate`, {
          imageUrl: base64Image
        });

        setResults(response.data.images);
        setLoading(false);
      };

      reader.onerror = () => {
        setError('Failed to read file');
        setLoading(false);
      };

    } catch (err) {
      console.error('Generation error:', err);
      setError(err.response?.data?.error || 'Failed to generate images');
      setLoading(false);
    }
  };

  const handleDownload = (imageUrl, index) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `embroidery-${index + 1}.png`;
    link.click();
  };

  return (
    <div className="app">
      <header>
        <h1>🎨 Embroidery Filter Studio</h1>
        <p>Transform your images into beautiful embroidery art</p>
      </header>

      <main>
        {/* Upload Section */}
        <div className="upload-section">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            id="file-input"
            style={{ display: 'none' }}
          />
          <label htmlFor="file-input" className="upload-button">
            Choose Image
          </label>
          
          {previewUrl && (
            <div className="preview">
              <img src={previewUrl} alt="Preview" />
            </div>
          )}
        </div>

        {/* Generate Button */}
        {previewUrl && (
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="generate-button"
          >
            {loading ? 'Generating...' : 'Generate 4 Embroidery Styles'}
          </button>
        )}

        {/* Loading State */}
        {loading && (
          <div className="loading">
            <div className="spinner"></div>
            <p>Creating embroidery variations... This takes about 15-20 seconds</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="error">
            <p>❌ {error}</p>
          </div>
        )}

        {/* Results Grid */}
        {results.length > 0 && (
          <div className="results">
            <h2>Your Embroidery Variations</h2>
            <div className="results-grid">
              {results.map((imageUrl, index) => (
                <div key={index} className="result-card">
                  <img src={imageUrl} alt={`Variation ${index + 1}`} />
                  <button
                    onClick={() => handleDownload(imageUrl, index)}
                    className="download-button"
                  >
                    Download
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer>
        <p>Powered by Replicate AI • ~$0.01-0.03 per generation</p>
      </footer>
    </div>
  );
}

export default App;