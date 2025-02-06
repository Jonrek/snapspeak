import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Card } from "@/components/ui/card";
import { Camera, Upload, Image as ImageIcon } from "lucide-react";
import { motion } from "framer-motion";

interface Props {
  onImageSelect: (file: File) => void;
}

export default function ImageUploader({ onImageSelect }: Props) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles[0]) {
      onImageSelect(acceptedFiles[0]);
    }
  }, [onImageSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    multiple: false
  });

  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      const video = document.createElement('video');
      video.srcObject = stream;
      await video.play();

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d')?.drawImage(video, 0, 0);

      stream.getTracks().forEach(track => track.stop());

      canvas.toBlob((blob) => {
        if (blob) {
          const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
          onImageSelect(file);
        }
      }, 'image/jpeg');
    } catch (error) {
      console.error('Error accessing camera:', error);
    }
  };

  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card
          {...getRootProps()}
          className={`p-8 text-center cursor-pointer border-dashed relative overflow-hidden transition-all duration-300 ${
            isDragActive 
              ? "border-primary border-2 bg-primary/5" 
              : "border-zinc-800 hover:border-primary/50 hover:bg-zinc-900/50"
          }`}
        >
          <input {...getInputProps()} />
          <motion.div
            animate={{
              scale: isDragActive ? 1.1 : 1,
              rotate: isDragActive ? 5 : 0
            }}
            transition={{ type: "spring", stiffness: 200, damping: 10 }}
            className="relative z-10"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-orange-500/20 flex items-center justify-center">
              <Upload className={`h-8 w-8 ${isDragActive ? 'text-primary' : 'text-zinc-400'}`} />
            </div>

            <p className={`text-lg font-medium mb-2 ${isDragActive ? 'text-primary' : 'text-zinc-300'}`}>
              {isDragActive ? "أفلت الصورة هنا" : "اسحب وأفلت الصورة هنا"}
            </p>
            <p className="text-sm text-zinc-500">
              أو انقر لاختيار ملف
            </p>
          </motion.div>

          {/* Decorative elements */}
          <div className="absolute inset-0 -z-10 opacity-50">
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-2xl transform -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-orange-500/10 to-transparent rounded-full blur-2xl transform translate-x-1/2 translate-y-1/2" />
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card
          className="p-8 text-center cursor-pointer relative overflow-hidden hover:border-primary/50 hover:bg-zinc-900/50 transition-all duration-300"
          onClick={handleCameraCapture}
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative z-10"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/20 to-orange-500/20 flex items-center justify-center">
              <Camera className="h-8 w-8 text-zinc-400" />
            </div>

            <p className="text-lg font-medium mb-2 text-zinc-300">
              التقط صورة من الكاميرا
            </p>
            <p className="text-sm text-zinc-500">
              استخدم كاميرا الجهاز لالتقاط صورة مباشرة
            </p>
          </motion.div>

          {/* Decorative elements */}
          <div className="absolute inset-0 -z-10 opacity-50">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-orange-500/10 to-transparent rounded-full blur-2xl transform -translate-x-1/2 translate-y-1/2" />
          </div>
        </Card>
      </motion.div>
    </div>
  );
}