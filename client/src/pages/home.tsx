import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ImageUploader from "@/components/ImageUploader";
import TextExtractor from "@/components/TextExtractor";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { textToSpeech } from "@/lib/tts";

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
        title: `Recording ${new Date().toLocaleString()}`,
        originalText: text,
        audioUrl: audioUrl,
      });

      toast({
        title: "Success!",
        description: "Recording saved successfully",
      });

      navigate("/recordings");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save recording",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="container max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">SnapSpeak</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ImageUploader onImageSelect={setImage} />
          {image && <TextExtractor image={image} onTextExtracted={setText} />}
          {text && (
            <Button 
              className="w-full" 
              onClick={handleSave}
              disabled={processing}
            >
              {processing ? "Processing..." : "Save Recording"}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
