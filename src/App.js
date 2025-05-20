import React, { useState } from 'react';
import './index.css';

export default function App() {
  const [title, setTitle] = useState('');
  const [lang, setLang] = useState('en');
  const [posterUrl, setPosterUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchPoster = async () => {
    setLoading(true);
    const query = encodeURIComponent(title);
    const response = await fetch(`/api/poster?title=${query}&lang=${lang}`);
    const data = await response.json();
    if (data.url) setPosterUrl(data.url);
    else alert(data.error || "Poster not found");
    setLoading(false);
  };

  return (
    <div className="app">
      <h1>Poster Zone</h1>
      <input
        type="text"
        placeholder="Enter Movie Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <label>
        <input
          type="checkbox"
          checked={lang === 'hi'}
          onChange={() => setLang(lang === 'hi' ? 'en' : 'hi')}
        />
        Prefer Hindi Poster
      </label>
      <button onClick={fetchPoster}>Get Poster</button>

      {loading && <p>Loading...</p>}

      {posterUrl && (
        <div className="poster-section">
          <img src={posterUrl} alt="Poster" />
          <a href={posterUrl} download className="download-btn">Download</a>
        </div>
      )}
    </div>
  );
}
