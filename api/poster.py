import os
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

TMDB_API_KEY = os.getenv("TMDB_API_KEY")

@app.route("/api/poster")
def get_poster():
    title = request.args.get("title")
    lang = request.args.get("lang", "hindi")

    # Search TMDB
    lang_code = "hi" if lang == "hindi" else "en"
    url = f"https://api.themoviedb.org/3/search/movie?api_key={TMDB_API_KEY}&query={title}&language={lang_code}"
    r = requests.get(url).json()
    results = r.get("results", [])
    if not results:
        return jsonify({"error": "Movie not found"}), 404

    poster_path = results[0].get("poster_path")
    if not poster_path:
        return jsonify({"error": "Poster not found"}), 404

    image_url = f"https://image.tmdb.org/t/p/w500{poster_path}"

    # Upload to envs.sh
    upload = requests.post("https://api.envs.sh/upload", files={"file": requests.get(image_url, stream=True).raw})
    if not upload.ok:
        return jsonify({"error": "Upload failed"}), 500

    return jsonify({"poster_url": upload.json()["url"]})
