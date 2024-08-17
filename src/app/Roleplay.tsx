"use client";

import { Recorder } from "../components/Recorder";
import Transcript from "../components/Transcript";
import { useTranscriber } from "../hooks/useTranscriber";

function Roleplay() {
    const transcriber = useTranscriber();

    return (
        <div className='flex justify-center items-center min-h-screen'>
            <div className='container flex flex-col justify-center items-center'>
                <Recorder transcriber={transcriber} />
                <Transcript transcribedData={transcriber.output} />
            </div>
        </div>
    );
}

export default Roleplay;
