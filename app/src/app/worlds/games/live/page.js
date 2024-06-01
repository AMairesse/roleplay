"use client";
import { useState, useEffect } from 'react';

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
          if (mediaRecorder.state === 'inactive') {
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            sendToGladia(audioBlob);
            audioChunks = [];
          }
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
        }, 5000); // 15 seconds
      } catch (error) {
        console.error('Error accessing microphone:', error);
      }
    }

    async function sendToGladia(audioBlob) {
      console.log('Sending audio to Gladia...');
      const formData = new FormData();
      formData.append('audio', audioBlob, 'audio.wav');

      console.log('FormData:', formData);

      try {
        const response = await fetch('https://api.gladia.io/transcription', {
          method: 'POST',
          body: formData,
          headers: {
            'Authorization': 'c5e95c51-c819-417a-96e5-c6b805fab962'
          }
        });
        const result = await response.json();
        console.log('Result:', result);
        setTranscriptions(prev => [...prev, result.transcription]);
      } catch (error) {
        console.error('Error sending audio to Gladia:', error);
      }
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
      </div>
    </div>
  );
}
