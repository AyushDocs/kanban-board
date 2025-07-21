"use client"
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import React from "react";
import { FaMicrophone } from "react-icons/fa";

const Microphone = () => {
        const {
            error,
            isListening,
            resetTranscript,
            startListening,
            stopListening,
            transcript,
        } = useSpeechRecognition();
    return (
        <>
            <FaMicrophone onClick={startListening} />
            <p>Click the microphone icon to add a todo using voice.</p>
            {!isListening && !transcript && transcript}
        </>
    );
};

export default Microphone;
