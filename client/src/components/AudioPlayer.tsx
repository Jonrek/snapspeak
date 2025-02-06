import { Button } from "@/components/ui/button";
import { Play, Download } from "lucide-react";
import { useState, useRef } from "react";

interface Props {
  audioUrl: string;
}

export default function AudioPlayer({ audioUrl }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = audioUrl;
    a.download = "recording.mp3";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="flex gap-2 mt-2">
      <audio
        ref={audioRef}
        src={audioUrl}
        onEnded={() => setIsPlaying(false)}
      />
      <Button size="sm" variant="outline" onClick={togglePlay}>
        <Play className="h-4 w-4" />
        {isPlaying ? "Pause" : "Play"}
      </Button>
      <Button size="sm" variant="outline" onClick={handleDownload}>
        <Download className="h-4 w-4" />
        Download
      </Button>
    </div>
  );
}
