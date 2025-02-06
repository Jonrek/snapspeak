import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Eye, Wand2 } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  text: string;
  onProcess: (processedText: string) => void;
  disabled?: boolean;
}

export default function TextProcessor({ text, onProcess, disabled }: Props) {
  const [processingType, setProcessingType] = useState<string>("direct");
  const [preview, setPreview] = useState(text);
  const [processing, setProcessing] = useState(false);

  const processText = async () => {
    setProcessing(true);
    try {
      let processedText = text;
      
      if (processingType !== "direct") {
        const response = await fetch("/api/process-text", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text,
            type: processingType,
          }),
        });
        
        if (!response.ok) {
          throw new Error("فشلت معالجة النص");
        }
        
        const data = await response.json();
        processedText = data.result;
      }
      
      setPreview(processedText);
      onProcess(processedText);
    } catch (error) {
      console.error("Error processing text:", error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Select
          value={processingType}
          onValueChange={setProcessingType}
          disabled={disabled}
        >
          <SelectTrigger className="flex-1 bg-zinc-900/50 border-zinc-800 text-zinc-100">
            <SelectValue placeholder="اختر نوع المعالجة" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-800">
            <SelectItem value="direct" className="text-zinc-100">
              تحويل مباشر إلى صوت
            </SelectItem>
            <SelectItem value="translate" className="text-zinc-100">
              ترجمة النص
            </SelectItem>
            <SelectItem value="summarize" className="text-zinc-100">
              تلخيص النص
            </SelectItem>
            <SelectItem value="qa" className="text-zinc-100">
              تحويل إلى أسئلة وأجوبة
            </SelectItem>
          </SelectContent>
        </Select>

        <Dialog>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              size="icon"
              className="bg-zinc-900/50 border-zinc-800 text-zinc-400 hover:text-primary hover:border-primary"
              disabled={disabled}
            >
              <Eye className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-zinc-900 border-zinc-800">
            <DialogHeader>
              <DialogTitle className="text-zinc-100">معاينة النص</DialogTitle>
            </DialogHeader>
            <Textarea
              value={preview}
              readOnly
              className="min-h-[200px] bg-zinc-900/50 border-zinc-800 text-zinc-100"
              dir="auto"
            />
          </DialogContent>
        </Dialog>

        <Button
          onClick={processText}
          disabled={disabled || processing}
          className="bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90"
        >
          <Wand2 className="h-4 w-4 mr-2" />
          معالجة النص
        </Button>
      </div>
    </div>
  );
}
