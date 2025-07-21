// src/types/speech.d.ts
interface Window {
  webkitSpeechRecognition: typeof SpeechRecognition;
}

declare const webkitSpeechRecognition: {
  new (): SpeechRecognition;
};
