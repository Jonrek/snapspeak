export async function textToSpeech(text: string, onProgress?: (progress: number) => void): Promise<Blob> {
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

    let startTime: number;
    const estimatedDuration = text.length * 50; // Rough estimate: 50ms per character

    utterance.onstart = () => {
      startTime = Date.now();
      onProgress?.(0);
    };

    utterance.onboundary = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / estimatedDuration) * 100, 99);
      onProgress?.(progress);
    };

    mediaRecorder.ondataavailable = (e) => {
      chunks.push(e.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'audio/mp3' });
      onProgress?.(100);
      resolve(blob);
    };

    utterance.onend = () => {
      mediaRecorder.stop();
    };

    mediaRecorder.start();
    speechSynthesis.speak(utterance);
  });
}