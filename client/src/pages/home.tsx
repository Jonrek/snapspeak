import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ImageUploader from "@/components/ImageUploader";
import TextExtractor from "@/components/TextExtractor";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { textToSpeech } from "@/lib/tts";
import { Camera, FileAudio } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const [image, setImage] = useState<File | null>(null);
  const [text, setText] = useState<string>("");
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const handleSave = async () => {
    try {
      setProcessing(true);
      const audio = await textToSpeech(text);
      const audioUrl = URL.createObjectURL(audio);

      await apiRequest("POST", "/api/recordings", {
        title: `التسجيل ${new Date().toLocaleString('ar-SA')}`,
        originalText: text,
        audioUrl: audioUrl,
      });

      toast({
        title: "تم بنجاح!",
        description: "تم حفظ التسجيل",
      });

      navigate("/recordings");
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل حفظ التسجيل",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="container max-w-2xl mx-auto p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              SnapSpeak
            </CardTitle>
            <p className="text-muted-foreground mt-1">
              حول النص من الصور إلى صوت
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <ImageUploader onImageSelect={setImage} />
            {image && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
              >
                <TextExtractor image={image} onTextExtracted={setText} />
              </motion.div>
            )}
            {text && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <Button 
                  className="w-full font-medium" 
                  size="lg"
                  onClick={handleSave}
                  disabled={processing}
                >
                  <FileAudio className="h-5 w-5 mr-2" />
                  {processing ? "جارٍ المعالجة..." : "حفظ التسجيل"}
                </Button>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}