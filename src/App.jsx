import React, { useState } from "react";
import axios from "axios";

export default function App() {
  const [title, setTitle] = useState("");
  const [lang, setLang] = useState("hindi");
  const [posterUrl, setPosterUrl] = useState("");

  const handleSearch = async () => {
    try {
      const res = await axios.get(`/api/poster?title=${encodeURIComponent(title)}&lang=${lang}`);
      setPosterUrl(res.data.poster_url);
    } catch (e) {
      alert("Poster not found!");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
      <h1 className="text-3xl font-bold mb-6">Poster Zone</h1>
      <div className="flex gap-4 mb-4">
        <input
          className="px-4 py-2 rounded bg-gray-800 border border-gray-600"
          placeholder="Enter movie title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value)}
          className="px-2 py-2 rounded bg-gray-800 border border-gray-600"
        >
          <option value="hindi">Hindi</option>
          <option value="english">English</option>
        </select>
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-500"
        >
          Fetch Poster
        </button>
      </div>
      {posterUrl && (
        <div className="mt-6 text-center">
          <img src={posterUrl} alt="Movie Poster" className="max-w-xs rounded shadow-lg mb-4" />
          <a href={posterUrl} className="text-blue-400 underline" target="_blank" rel="noreferrer">
            Download Poster
          </a>
        </div>
      )}
    </div>
  );
}
