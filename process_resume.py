from utils import processing

db=processing.process_chunk("Exemple_audio")
for resume in db.audio_resume:
    print(resume)