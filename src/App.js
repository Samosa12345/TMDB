import { useState } from 'react';
import './index.css';

function App() {
  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');
  const [lang, setLang] = useState('en');
  const [poster, setPoster] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchPoster = async () => {
    setLoading(true);
    setPoster('');
    const queryLang = lang === 'hi' ? 'hi' : 'en';
    const response = await fetch(`/api/poster?title=${encodeURIComponent(title)}&lang=${queryLang}`);
    const data = await response.json();
    setLoading(false);
    if (data.url) {
      setPoster(data.url);
    } else {
      alert('Poster not found');
    }
  };

  return (
    <div className="container">
      <h1>Poster Zone</h1>
      <input type="text" placeholder="Movie Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <input type="text" placeholder="Year (optional)" value={year} onChange={(e) => setYear(e.target.value)} />
      <br />
      <label>
        <input type="checkbox" checked={lang === 'hi'} onChange={() => setLang(lang === 'hi' ? 'en' : 'hi')} />
        Get Hindi Poster
      </label>
      <br />
      <button onClick={fetchPoster}>Fetch Poster</button>
      {loading && <p>Loading...</p>}
      {poster && (
        <div>
          <img src={poster} alt="Movie Poster" />
          <br />
          <a href={poster} download target="_blank" rel="noreferrer">
            <button>Download Poster</button>
          </a>
        </div>
      )}
    </div>
  );
}

export default App;
