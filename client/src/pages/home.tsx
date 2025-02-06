import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ImageUploader from "@/components/ImageUploader";
import TextExtractor from "@/components/TextExtractor";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { textToSpeech } from "@/lib/tts";
import { Camera, FileAudio, ArrowRight } from "lucide-react";
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
        title: "تم بنجاح! 🎉",
        description: "تم حفظ التسجيل في مكتبتك",
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
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50/50 py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container max-w-2xl mx-auto"
      >
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur">
          <CardHeader className="text-center space-y-2 pb-6">
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <CardTitle className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                SnapSpeak
              </CardTitle>
            </motion.div>
            <p className="text-lg text-muted-foreground">
              حول النص من الصور إلى صوت بسهولة
            </p>
          </CardHeader>
          <CardContent className="space-y-8">
            <ImageUploader onImageSelect={setImage} />

            {image && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.3 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-background/5 to-background/30 -z-10 rounded-lg" />
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
                  className="w-full font-medium text-lg h-12" 
                  size="lg"
                  onClick={handleSave}
                  disabled={processing}
                >
                  <FileAudio className="h-5 w-5 mr-2" />
                  {processing ? "جارٍ المعالجة..." : "حفظ التسجيل"}
                  {!processing && <ArrowRight className="h-5 w-5 ml-2 rtl:rotate-180" />}
                </Button>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}