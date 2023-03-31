from youtube_transcript_api import YouTubeTranscriptApi
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
'*'
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
)



@app.get("/{video_id}")
async def root(video_id):
    # test id : SW14tOda_kI
    srt = YouTubeTranscriptApi.get_transcript(video_id)
    return srt

