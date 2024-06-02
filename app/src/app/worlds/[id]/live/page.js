  /** En l'état :

La ligne suivante permet la sélection d'une scène
dispatch({ type: 'SET_CURRENT_SCENE', payload: newScene });

La ligne suitante permets la mise à jours de toutes les scènes
dispatch({ type: 'SET_SCENES', payload: [...scenes, newScene] });

*/
"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGlobalState, useGlobalDispatch } from '@/context/GlobalState';
import AudioRecorder from "@/utils/audio-recorder";
import { transcribeAudio } from "@/utils/transcript";
import { generateContext, generateImage } from "@/utils/mistral";
import { updateWorld } from '@/utils/directus';

const batchSize = 1;

export default function EditWorld() {
  const router = useRouter();
  const dispatch = useGlobalDispatch();
  const { currentWorld, scenes, currentScene } = useGlobalState();
  const [recording, setRecording] = useState(false);
  const [image, setImage] = useState(null);
  const [transcriptions, setTranscriptions] = useState([]);
  const [recorder] = useState(new AudioRecorder());

  const startRecording = () => {
    if (!recording) {
      recorder.start();
      setRecording(true);
    }
  };

  const stopRecording = () => {
    if (recording) {
      recorder.stop();
      setRecording(false);
    }
  };

  const saveScene = (scene = {}, index) => {
    if (index !== undefined) {
      // update existing one
      scenes[index] = scene;
      dispatch({ type: 'SET_SCENES', payload: scenes });
    } else {
      // add new one
      const newScene = {
        type: "image",
        loading: false,
        index: scenes.length,
        name: "",
        place: "",
        actors: [],
        images: [],
        ...scene
      };
      dispatch({ type: 'SET_SCENES', payload: [...scenes, newScene] });
      dispatch({ type: 'SET_CURRENT_SCENE', payload: newScene }); // Activate this line here
    }
  };

  // New batch round
  const newBatch = () => {
    const batch = transcriptions.slice(-batchSize);
    const index = scenes.length;
    console.log("newBatch", batch, index);
    // Set rich batch object
    saveScene({
      transcriptions: batch,
      index,
      name: `Scene #${index}`,
      image: null,
      date: new Date()
    });
    // Parallelized
    generateContext({ transcriptions: batch, message: "" })
      .then(context => {
        console.log("context", context);
      })
      .catch(console.error);
    generateImage({ transcriptions: batch })
      .then(image => {
        console.log("image", image);
      })
      .catch(console.error);
  };

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
      currentWorld.scenes = JSON.stringify(scenes);
      updateWorld(currentWorld);
    }
  }, [scenes]);

  const handleSceneClick = (scene) => {
    // dispatch({ type: 'SET_CURRENT_SCENE', payload: scene });
    dispatch({ type: 'SET_CURRENT_SCENE', payload: scene });
  };

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

      <aside className="sidebar">
        <div className="sidebar-body">
          {(scenes || []).map((scene) => (
            <div
              key={scene.index}
              className={`sidebar-item ${currentScene && scene.index === currentScene.index ? 'current' : ''}`}
              onClick={() => handleSceneClick(scene)}
            >
              {/* {scene.loading ? (
                <svg
                  className="animate-spin -ml-1 mr-1 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <i className="fas fa-image" />
              )}
              <span>{scene.name}</span> */}
            </div>
          ))}
        </div>
      </aside>

      {currentScene && (
        <section className="flex">
          <div className="flex flex-col gap-5 items-center">
            <div className="p-3 rounded-lg">
              {currentScene.place}
            </div>
            <h1 className="text-2xl">{currentScene.name}</h1>
            {currentScene.image && (
              <div className="relative" style={{ padding: "2px" }}>
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
            <div className="p-3 rounded-lg">
              <p>Date: {currentScene.date ? new Date(currentScene.date).toLocaleString() : ''}</p>
              <p>Transcriptions: {currentScene.transcriptions.join(', ')}</p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
