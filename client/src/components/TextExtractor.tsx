import { useEffect, useState } from "react";
import { createWorker } from "tesseract.js";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { ScanSearch, Sparkles, Type } from "lucide-react";

interface Props {
  image: File;
  onTextExtracted: (text: string) => void;
}

export default function TextExtractor({ image, onTextExtracted }: Props) {
  const [progress, setProgress] = useState(0);
  const [extractedText, setExtractedText] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  useEffect(() => {
    const extractText = async () => {
      setStatus("loading");
      const worker = await createWorker({
        logger: m => {
          if (m.status === "recognizing text") {
            setProgress(m.progress * 100);
          }
        },
      });

      try {
        await worker.loadLanguage("ara+eng");
        await worker.initialize("ara+eng");

        const { data: { text } } = await worker.recognize(image);
        setExtractedText(text);
        onTextExtracted(text);
        setStatus("success");
      } catch (error) {
        console.error('Error extracting text:', error);
      } finally {
        await worker.terminate();
      }
    };

    extractText();
  }, [image, onTextExtracted]);

  return (
    <motion.div 
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {status === "loading" && (
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <motion.div
              animate={{
                rotate: [0, 360],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <ScanSearch className="w-8 h-8 text-primary" />
            </motion.div>
            <div className="flex-1 space-y-2">
              <Progress value={progress} className="bg-zinc-800" />
              <p className="text-sm text-center text-zinc-400">
                جارٍ استخراج النص... {progress.toFixed(0)}%
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {status === "success" && extractedText && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="space-y-4"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-orange-500/20 flex items-center justify-center">
              <Type className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-zinc-200">النص المستخرج</h3>
              <p className="text-sm text-zinc-400">يمكنك تعديل النص قبل تحويله إلى صوت</p>
            </div>
          </div>

          <div className="relative">
            <Textarea
              value={extractedText}
              onChange={(e) => {
                setExtractedText(e.target.value);
                onTextExtracted(e.target.value);
              }}
              className="min-h-[200px] bg-zinc-900/50 border-zinc-800 focus:border-primary text-zinc-100"
              placeholder="النص المستخرج سيظهر هنا..."
              dir="auto"
            />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute top-2 right-2"
            >
              <Sparkles className="w-4 h-4 text-primary" />
            </motion.div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}