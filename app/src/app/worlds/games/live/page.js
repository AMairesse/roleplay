"use client";
import { useState, useEffect } from 'react';
import MistralComponent from './mistral';

export default function WorldsGamesLive() {
  const [players, setPlayers] = useState([]);
  const [mediaRecorderElement, setMediaRecorder] = useState(null);
  const [conditions, setConditions] = useState("Jour");
  const [place, setPlace] = useState("Tour du mage fou");
  const [image, setImage] = useState('https://cdn.1j1ju.com/thumbs/game-lg/medias/36/28/18-pathfinder-le-jeu-de-role-boite-dinitiation-cover.jpeg');
  const [transcriptions, setTranscriptions] = useState([]);

  useEffect(() => {
    async function getMicrophoneAccess() {
      console.log('Getting microphone access...');
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        setMediaRecorder(mediaRecorder);
        let audioChunks = [];

        mediaRecorder.ondataavailable = event => {
          console.log("data available", event);
          audioChunks.push(event.data);
          //if (mediaRecorder.state === 'inactive') {
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            const textTranscription = transcribeAudio(audioBlob);
            console.log("textTranscription", textTranscription);
            audioChunks = [];
          //}
        };

        console.log("start audio recording");

        mediaRecorder.start();
        setInterval(() => {
          if (mediaRecorder.state === 'recording') {
            console.log("stop audio recording");
            mediaRecorder.stop();
            console.log("and start again");
            mediaRecorder.start();
          } else {
            console.log("state is not recoring. Nothing to stop", mediaRecorder.state);
          }
        }, 10000); // 10 seconds
      } catch (error) {
        console.error('Error accessing microphone:', error);
      }
    }

    async function pollForResult(resultUrl, headers) {
      while (true) {
        console.log("Polling for results...");
        const pollResponse = await fetch(resultUrl, {
          method: "GET",
          headers: headers }
        ).then((res) => res.json());
    
        if (pollResponse.status === "done") {
          console.log("- Transcription done: \n ");
          console.log(pollResponse.result.transcription.full_transcript);
          setTranscriptions(prev => [...prev, pollResponse.result.transcription.full_transcript]);
          return pollResponse.result.transcription.full_transcript;
        } else {
          console.log("Transcription status : ", pollResponse.status);
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
    }

    async function transcribeAudio(audioBlob) {
      const gladiaKey = "c5e95c51-c819-417a-96e5-c6b805fab962";
      const uploadUrl = "https://api.gladia.io/v2/upload/";
      const transcriptionUrl = "https://api.gladia.io/v2/transcription/";
  
      // Step 1: Upload the audio file
      const formData = new FormData();
      formData.append('audio', audioBlob, 'conversation.wav');
  
      const uploadResponse = await fetch(uploadUrl, {
          method: 'POST',
          headers: {
              'x-gladia-key': gladiaKey,
              'accept': 'application/json'
          },
          body: formData
      }).then(res => res.json());
  
      if (!uploadResponse || !uploadResponse.audio_url) {
          return "Erreur lors de l'upload de l'audio.";
      }
  
      const audioUrl = uploadResponse.audio_url;
  
      // Step 2: Request transcription
      const transcriptionData = {
          audio_url: audioUrl,
          context_prompt: "Enregistrement d une partie de jeu de role de type Dongeon et Dragons.",
          custom_vocabulary: ["MJ", "prompt", "contexte"],
          diarization: true,
          diarization_config: {
              number_of_speakers: 3,
              min_speakers: 1,
              max_speakers: 4
          }
      };
  
      const transcriptionResponse = await fetch(transcriptionUrl, {
          method: 'POST',
          headers: {
              'x-gladia-key': gladiaKey,
              'accept': 'application/json',
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(transcriptionData)
      }).then(res => res.json());
  
      if (!transcriptionResponse || !transcriptionResponse.result_url) {
          return "Erreur lors de la transcription.";
      }
  
      const resultUrl = transcriptionResponse.result_url;
  
      // Step 3: Poll for the transcription result
      // Define headers
      const headers = {
          'x-gladia-key': gladiaKey,
          'accept': 'application/json'
      };

      const result = await pollForResult(resultUrl, headers);
      return result; // Assuming result contains the transcription text
  }
  
    console.log('---');
    getMicrophoneAccess();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* HEADER */}
      <div className="p-4 flex justify-between">
      <button onClick={() => mediaRecorderElement.start()}>Start</button>
      <button onClick={() => mediaRecorderElement.stop()}>Stop</button>
        <ul className="flex flex-row gap-2">
          {players.map(player => (
            <li key={player.name} className="h-10 w-10 rounded-full">{player.name}</li>
          ))}
        </ul>
      </div>
      {/* CONTENT */}
      <div className="p-4 flex flex-col">
        <div className="flex flex-col gap-5 items-center">
          <div className="p-3 rounded-lg">
            {conditions}
          </div>
          <h1 className="text-2xl">{place}</h1>
          {image && (
            <div className="relative" style={{ padding: "2px" }}>
              <img className="rounded-md opacity-0" src={image} alt="Game scene" />
              <div className="rounded-lg bg-cover block absolute" style={{
                backgroundImage: `url(${image})`,
                opacity: "0.2",
                top: "-2px",
                left: "-2px",
                height: "calc(100% + 4px)",
                width: "calc(100% + 4px)"
              }} />
              <div className="top-0 left-0 rounded-lg h-full w-full bg-cover block absolute" style={{
                backgroundImage: `url(${image})`,
                margin: "2px",
                height: "calc(100% - 4px)",
                width: "calc(100% - 4px)"
              }} />
            </div>
          )}
        </div>
        <div className="p-4">
          <h2 className="text-xl">Transcriptions:</h2>
          <ul>
            {transcriptions.map((transcription, index) => (
              <li key={index}>{transcription}</li>
            ))}
          </ul>
        </div>
        <MistralComponent parentVariable={transcriptions} />
      </div>
    </div>
  );
}
