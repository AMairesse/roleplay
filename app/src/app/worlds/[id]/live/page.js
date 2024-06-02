"use client";

import { useEffect, useState } from 'react';
import { ProtectRoute } from '@/utils/auth';
import { useRouter } from 'next/navigation';
import { useGlobalState, useGlobalDispatch } from '@/context/GlobalState';
import AudioRecorder from "@/utils/audio-recorder";
import { transcribeAudio } from "@/utils/transcript";
import { generateContext, generateImage } from "@/utils/mistral";
import { updateWorld } from '@/utils/directus';

const batchSize = 5;

export default function EditWorld() {
  const router = useRouter();
  const dispatch = useGlobalDispatch();
  const { currentWorld, scenes, currentScene } = useGlobalState();
  const [recording, setRecording] = useState(false);
  const [image, setImage] = useState(null);
  const [transcriptions, setTranscriptions] = useState([]);
  const [batches, setBatches] = useState([]);
  const [recorder] = useState(new AudioRecorder());

  const startRecording = () => {
    if (!recording) {
      recorder.start();
      setRecording(true);
    }
  }

  const stopRecording = () => {
    if (recording) {
      recorder.stop();
      setRecording(false);
    }
  }

  const saveScene = (scene = {}, index) => {
    if (index) {
      // update existing one
      scenes[index] = scene;
      dispatch({ type: 'SET_SCENES', payload: scenes });
    } else {
      // add new one
      const newScene = { index: scenes.length, name: "", place: "", actors: [], images: [], ...scene };
      dispatch({ type: 'SET_SCENES', payload: [...scenes, newScene] });
    }
  }

  // New batch round
  const newBatch = () => {
    const batch = transcriptions.slice(-batchSize);
    const index = batches.length;
    console.log("newBatch", batch, index);
    // Set rich batch object
    saveScene({
      transcriptions: batch,
      index,
      name: `Scene #${index}`,
      image: null,
      date: new Date()
    });
    // Paralellized
    generateContext({ transcriptions, message: "" })
      .then(context => {
        console.log("context", context);
      })
      .catch(console.error);
    generateImage({ transcriptions: batch })
      .then(image => {
        console.log("image", image);
      })
      .catch(console.error);
  }

  recorder.onData = blob => {
    transcribeAudio("", blob)
      .then(d => {
        // Start transcription from audio blob
        setTranscriptions(prev => [...prev, d]);
        console.log("Batch size", transcriptions.length, transcriptions.length % batchSize);
        if (transcriptions.length % batchSize === 0 && transcriptions.length > 0) {
          newBatch();
        }
      })
      .catch(console.error);
  };

  useEffect(() => {
    if (currentWorld) {
      // Save World object
      currentWorld.scenes = scenes;
      updateWorld(currentWorld);
    }
  }, [scenes]);

  return (
    <div className="h-full p-4 relative">
      <div className={`absolute ease-in-out duration-300 justify-center flex flex-col gap-4 top-0 ${recording ? "items-end scale-50 right-0" : "items-center right-1/2 translate-x-1/2"}`}>
        <div className="relative">
          {recording && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>}
          <button
            className="rounded-full text-3xl bg-red-500 cursor-pointer h-20 w-20 hover:scale-110 ease-in-out duration-200 drop-shadow-md hover:drop-shadow-xl"
            onClick={() => {
              if (recording) stopRecording();
              else startRecording();
            }}
          >
            {recording ? <i className="fas fa-microphone-slash text-white" /> : <i className="fas fa-microphone text-white" />}
          </button>
        </div>
        {!recording && <span className="text-gray-500">Démarrer l'enregistrement</span>}
      </div>
      {currentScene && (
        <section className="flex">
          <div className="flex flex-col gap-5 items-center">
            <div className="p-3 rounded-lg">
              {currentScene.place}
            </div>
            <h1 className="text-2xl">{currentScene.title}</h1>
            {currentScene.image && (
              <div className="relative" style={{ padding: "2px" }}>
                {/* <img className="rounded-md opacity-0" src={image} alt="Game scene" /> */}
                <div className="rounded-lg bg-cover block absolute" style={{
                  backgroundImage: `url(${currentScene.image})`,
                  opacity: "0.2",
                  top: "-2px",
                  left: "-2px",
                  height: "calc(100% + 4px)",
                  width: "calc(100% + 4px)"
                }} />
                <div className="top-0 left-0 rounded-lg h-full w-full bg-cover block absolute" style={{
                  backgroundImage: `url(${currentScene.image})`,
                  margin: "2px",
                  height: "calc(100% - 4px)",
                  width: "calc(100% - 4px)"
                }} />
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
