# api/poster.py

from fastapi import FastAPI, Query
from fastapi.responses import JSONResponse
import httpx
from bs4 import BeautifulSoup
import base64
import re

app = FastAPI()

TMDB_API_KEY = "de19ae80ab28129b35fc510770e30b48"
UPLOAD_API = "https://api.envs.sh/upload"

@app.get("/")
async def read_root():
    return JSONResponse({"message": "FastAPI working on Vercel!"})


# ---- Utility: Upload image to envs.sh ----
async def upload_to_envs(image_url: str):
    async with httpx.AsyncClient() as client:
        img_data = await client.get(image_url)
        if img_data.status_code == 200:
            files = {"file": ("poster.jpg", img_data.content)}
            response = await client.post(UPLOAD_API, files=files)
            if response.status_code == 200:
                return response.json().get("url")
    return None

# ---- TMDB Poster Fetch ----
async def fetch_tmdb_poster(title: str, lang: str):
    async with httpx.AsyncClient() as client:
        search_url = f"https://api.themoviedb.org/3/search/multi?api_key={TMDB_API_KEY}&query={title}&language={lang}"
        res = await client.get(search_url)
        data = res.json()
        if data.get("results"):
            poster_path = data["results"][0].get("backdrop_path") or data["results"][0].get("poster_path")
            if poster_path:
                full_url = f"https://image.tmdb.org/t/p/original{poster_path}"
                return await upload_to_envs(full_url)
    return None

# ---- OTT Scrapers ----
async def scrape_ullu(title: str):
    search_url = f"https://ullu.app/search/{title.replace(' ', '%20')}"
    async with httpx.AsyncClient() as client:
        res = await client.get(search_url)
        soup = BeautifulSoup(res.text, "html.parser")
        poster = soup.find("img", {"alt": re.compile(title, re.IGNORECASE)})
        if poster:
            return await upload_to_envs(poster["src"])
    return None

async def scrape_bookmyshow(title: str):
    url = f"https://in.bookmyshow.com/explore/movies"
    async with httpx.AsyncClient() as client:
        res = await client.get(url)
        soup = BeautifulSoup(res.text, "html.parser")
        img_tag = soup.find("img", {"alt": re.compile(title, re.IGNORECASE)})
        if img_tag:
            return await upload_to_envs(img_tag["src"])
    return None

# Extend with Chaupal, Atrangi, Ultra Jhakaas similarly...

@app.get("/api/poster")
async def get_poster(title: str = Query(...), lang: str = Query("en")):
    # 1. Try TMDB
    tmdb_result = await fetch_tmdb_poster(title, lang)
    if tmdb_result:
        return JSONResponse({"source": "TMDB", "url": tmdb_result})

    # 2. Try OTTs
    for scraper in [scrape_ullu, scrape_bookmyshow]:
        result = await scraper(title)
        if result:
            return JSONResponse({"source": scraper.__name__, "url": result})

    return JSONResponse({"error": "Poster not found"}, status_code=404)
