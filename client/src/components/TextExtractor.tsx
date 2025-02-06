import { useEffect, useState } from "react";
import { createWorker } from "tesseract.js";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";

interface Props {
  image: File;
  onTextExtracted: (text: string) => void;
}

export default function TextExtractor({ image, onTextExtracted }: Props) {
  const [progress, setProgress] = useState(0);
  const [extractedText, setExtractedText] = useState("");

  useEffect(() => {
    const extractText = async () => {
      const worker = await createWorker({
        logger: m => {
          if (m.status === "recognizing text") {
            setProgress(m.progress * 100);
          }
        },
      });

      await worker.loadLanguage("ara+eng");
      await worker.initialize("ara+eng");
      
      const { data: { text } } = await worker.recognize(image);
      setExtractedText(text);
      onTextExtracted(text);
      await worker.terminate();
    };

    extractText();
  }, [image, onTextExtracted]);

  return (
    <div className="space-y-4">
      {progress < 100 && (
        <div className="space-y-2">
          <Progress value={progress} />
          <p className="text-sm text-center text-muted-foreground">
            Extracting text... {progress.toFixed(0)}%
          </p>
        </div>
      )}
      
      {extractedText && (
        <Textarea
          value={extractedText}
          onChange={(e) => {
            setExtractedText(e.target.value);
            onTextExtracted(e.target.value);
          }}
          className="min-h-[200px]"
          placeholder="Extracted text will appear here..."
          dir="auto"
        />
      )}
    </div>
  );
}
