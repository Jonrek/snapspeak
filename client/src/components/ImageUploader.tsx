import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Card } from "@/components/ui/card";
import { Camera, Upload } from "lucide-react";

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
      <Card
        {...getRootProps()}
        className={`p-8 text-center cursor-pointer border-dashed ${
          isDragActive ? "border-primary" : "border-muted"
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
        <p className="mt-2 text-sm text-muted-foreground">
          {isDragActive
            ? "Drop the image here"
            : "Drag & drop an image here, or click to select"}
        </p>
      </Card>

      <Card
        className="p-8 text-center cursor-pointer hover:border-primary"
        onClick={handleCameraCapture}
      >
        <Camera className="mx-auto h-8 w-8 text-muted-foreground" />
        <p className="mt-2 text-sm text-muted-foreground">
          Capture from camera
        </p>
      </Card>
    </div>
  );
}
