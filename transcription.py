import requests
import os
from time import sleep
from dotenv import load_dotenv


# Load the .env file
# Your file must contain GLADIA_API_KEY
load_dotenv()


def make_request(url, headers, method="GET", data=None, files=None):
    if method == "POST":
        response = requests.post(url, headers=headers, json=data, files=files)
    else:
        response = requests.get(url, headers=headers)
    return response.json()

def transcribe_file(file_path):
    if not os.path.exists(file_path):
        raise Exception("File not found")

    file_name, file_extension = os.path.splitext(file_path)

    with open(file_path, "rb") as f:
        file_content = f.read()

    return transcribe(audio_content=file_content)

def transcribe(audio_content):
    headers = {
        "x-gladia-key": os.getenv("GLADIA_API_KEY", os.getenv("GLADIA_API_KEY")),
        "accept": "application/json",
    }

    files = [("audio", ("conversation.wav", audio_content, "audio/" + "wav"))]

    upload_response = make_request(
        "https://api.gladia.io/v2/upload/", headers, "POST", files=files
    )
    audio_url = upload_response.get("audio_url")

    data = {
        "audio_url": audio_url,
        "diarization": True,
    }

    headers["Content-Type"] = "application/json"

    post_response = make_request(
        "https://api.gladia.io/v2/transcription/", headers, "POST", data=data
    )

    result_url = post_response.get("result_url")

    if result_url:
        while True:
            # Polling the result
            poll_response = make_request(result_url, headers)

            if poll_response.get("status") == "done":
                break
            elif poll_response.get("status") == "error":
                raise Exception(poll_response.get("message"))
            sleep(1)

    # Get transcription from result
    result = poll_response.get("result")
    transcription = result.get("transcription").get("full_transcript")
    return transcription

if __name__ == "__main__":
    # Get file name from parameter
    import sys
    file_name = sys.argv[1]
    transcription = transcribe_file(file_name)
    print(transcription)
    # Save resulting transcription to file
    with open(file_name + ".txt", "w") as f:
        f.write(transcription)
