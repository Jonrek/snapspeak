import { Button } from "@/components/ui/button";
import { Play, Pause, Download, Volume2 } from "lucide-react";
import { useState, useRef } from "react";
import { motion } from "framer-motion";

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
    <motion.div 
      className="flex gap-3 items-center"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative">
        <audio
          ref={audioRef}
          src={audioUrl}
          onEnded={() => setIsPlaying(false)}
        />
        <Button
          size="icon"
          variant="outline"
          onClick={togglePlay}
          className={`relative w-12 h-12 rounded-full border-2 transition-all duration-300 ${
            isPlaying 
              ? "border-primary text-primary bg-primary/10"
              : "border-zinc-700 text-zinc-400 hover:border-primary/50 hover:text-primary"
          }`}
        >
          {isPlaying ? (
            <Pause className="h-5 w-5" />
          ) : (
            <Play className="h-5 w-5 ml-0.5" />
          )}

          {/* Animated ring when playing */}
          {isPlaying && (
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-primary/30"
              initial={{ scale: 1 }}
              animate={{ scale: 1.2, opacity: [1, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}
        </Button>
      </div>

      <motion.div 
        className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-orange-500"
          initial={{ width: "0%" }}
          animate={{ width: isPlaying ? "100%" : "0%" }}
          transition={{ duration: 30, ease: "linear" }}
        />
      </motion.div>

      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", duration: 0.5, delay: 0.3 }}
      >
        <Button
          size="icon"
          variant="ghost"
          onClick={handleDownload}
          className="w-10 h-10 text-zinc-400 hover:text-primary hover:bg-primary/10"
        >
          <Download className="h-4 w-4" />
        </Button>
      </motion.div>
    </motion.div>
  );
}