import { useState, useEffect, useCallback } from 'react';


interface UseSpeechRecognitionProps {
    lang?: string;
    continuous?: boolean;
    interimResults?: boolean;
}

interface UseSpeechRecognitionReturn {
    isListening: boolean;
    transcript: string;
    error: string | null;
    startListening: () => void;
    stopListening: () => void;
    resetTranscript: () => void;
}

export const useSpeechRecognition = ({
    continuous = true,
    interimResults = true,
}: UseSpeechRecognitionProps = {}): UseSpeechRecognitionReturn => {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
    // Initialize SpeechRecognition
    useEffect(() => {
        if (typeof window === 'undefined' || !('SpeechRecognition' in window))
            setError('Speech Recognition API is not supported in this browser.');
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognitionInstance = new SpeechRecognition();

        recognitionInstance.lang = 'en-US';
        recognitionInstance.continuous = continuous;
        recognitionInstance.interimResults = interimResults;

        setRecognition(recognitionInstance);
        return () => {
            if (recognition) {
                recognition.stop();
            }
        };
    }, [continuous, interimResults, recognition]);

    // Handle speech recognition results
    const handleResult = useCallback((event: SpeechRecognitionEvent) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
            const result = event.results[i];
            const transcript = result[0].transcript;

            if (result.isFinal) {
                finalTranscript += transcript;
            } else {
                interimTranscript += transcript;
            }
        }

        setTranscript(finalTranscript + interimTranscript);
    }, []);

    // Handle errors
    const handleError = useCallback((event: SpeechRecognitionErrorEvent) => {
        setError(`Speech recognition error: ${event.error}`);
        setIsListening(false);
    }, []);

    // Start listening
    const startListening = useCallback(() => {
        if (recognition && !isListening) {
            try {
                recognition.start();
                setIsListening(true);
                setError(null);
                setTranscript('');
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('Unknown error');
                }
            }
        }
    }, [recognition, isListening]);

    // Stop listening
    const stopListening = useCallback(() => {
        if (recognition && isListening) {
            recognition.stop();
            setIsListening(false);
        }
    }, [recognition, isListening]);

    // Reset transcript
    const resetTranscript = useCallback(() => {
        setTranscript('');
        setError(null);
    }, []);

    // Setup event listeners
    useEffect(() => {
        if (recognition) {
            recognition.onresult = handleResult;
            recognition.onerror = handleError;
            recognition.onend = () => setIsListening(false);
        }

        return () => {
            if (recognition) {
                recognition.onresult = null;
                recognition.onerror = null;
                recognition.onend = null;
            }
        };
    }, [recognition, handleResult, handleError]);

    return {
        isListening,
        transcript,
        error,
        startListening,
        stopListening,
        resetTranscript,
    };
};