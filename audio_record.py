import pyaudio
import wave
import time
import threading

# Paramètres de l'enregistrement
FORMAT = pyaudio.paInt16
CHANNELS = 1
RATE = 44100
CHUNK = 1024
RECORD_SECONDS = 10

# Initialisation de PyAudio
audio = pyaudio.PyAudio()

# Fonction pour enregistrer un segment audio
def record_segment(start_time):
    stream = audio.open(format=FORMAT, channels=CHANNELS,
                        rate=RATE, input=True,
                        frames_per_buffer=CHUNK)
    frames = []

    for _ in range(0, int(RATE / CHUNK * RECORD_SECONDS)):
        data = stream.read(CHUNK)
        frames.append(data)

    end_time = time.time()
    filename = f"{start_time:.0f}_{end_time:.0f}.wav"
    wf = wave.open(filename, 'wb')
    wf.setnchannels(CHANNELS)
    wf.setsampwidth(audio.get_sample_size(FORMAT))
    wf.setframerate(RATE)
    wf.writeframes(b''.join(frames))
    wf.close()

    stream.stop_stream()
    stream.close()

# Fonction pour gérer l'enregistrement continu
def continuous_recording_thread():
    while True:
        start_time = time.time()
        threading.Thread(target=record_segment, args=(start_time,)).start()
        time.sleep(RECORD_SECONDS)

def continuous_recording():
    while True:
        start_time = time.time()
        record_segment(start_time)


# Démarrer l'enregistrement continu
if __name__ == "__main__":
    try:
        continuous_recording()
    except KeyboardInterrupt:
        print("Enregistrement arrêté.")
        audio.terminate()
