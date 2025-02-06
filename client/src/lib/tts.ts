export async function textToSpeech(text: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Find Arabic voice if available
    const voices = speechSynthesis.getVoices();
    const arabicVoice = voices.find(voice => voice.lang.includes('ar'));
    if (arabicVoice) {
      utterance.voice = arabicVoice;
    }

    // Create MediaRecorder to capture the synthesized speech
    const audioCtx = new AudioContext();
    const destination = audioCtx.createMediaStreamDestination();
    const mediaRecorder = new MediaRecorder(destination.stream);
    const chunks: BlobPart[] = [];

    mediaRecorder.ondataavailable = (e) => {
      chunks.push(e.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'audio/mp3' });
      resolve(blob);
    };

    utterance.onend = () => {
      mediaRecorder.stop();
    };

    mediaRecorder.start();
    speechSynthesis.speak(utterance);
  });
}
