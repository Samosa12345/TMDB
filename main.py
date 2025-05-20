from fastapi import FastAPI
from api.poster import app as poster_app

app = FastAPI()
app.mount("/api", poster_app)
