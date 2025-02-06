import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ImageUploader from "@/components/ImageUploader";
import TextExtractor from "@/components/TextExtractor";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { textToSpeech } from "@/lib/tts";
import { Camera, FileAudio, ArrowRight, Wand2 } from "lucide-react";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";

export default function Home() {
  const [image, setImage] = useState<File | null>(null);
  const [text, setText] = useState<string>("");
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const handleSave = async () => {
    try {
      setProcessing(true);
      const audio = await textToSpeech(text, (progress) => {
        setProgress(progress);
      });
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
      setProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-zinc-800 py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container max-w-2xl mx-auto"
      >
        <Card className="border-0 shadow-2xl bg-zinc-900/80 backdrop-blur">
          <CardHeader className="text-center space-y-2 pb-6">
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <CardTitle className="text-4xl font-bold bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
                SnapSpeak
              </CardTitle>
            </motion.div>
            <p className="text-lg text-zinc-400">
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
                <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/5 to-zinc-900/30 -z-10 rounded-lg" />
                <TextExtractor image={image} onTextExtracted={setText} />
              </motion.div>
            )}

            {text && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {processing && (
                  <div className="space-y-2">
                    <Progress value={progress} className="bg-zinc-800" />
                    <p className="text-sm text-center text-zinc-400">
                      جاري تحويل النص إلى صوت... {progress.toFixed(0)}%
                    </p>
                  </div>
                )}
                <Button 
                  className="w-full font-medium text-lg h-12 bg-gradient-to-r from-primary to-orange-500 hover:from-primary/90 hover:to-orange-500/90" 
                  size="lg"
                  onClick={handleSave}
                  disabled={processing}
                >
                  <Wand2 className="h-5 w-5 mr-2" />
                  {processing ? "جارٍ المعالجة..." : "تحويل إلى صوت"}
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