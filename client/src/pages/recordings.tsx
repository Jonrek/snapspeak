import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, FileAudio, Calendar, Loader2 } from "lucide-react";
import AudioPlayer from "@/components/AudioPlayer";
import type { Recording } from "@shared/schema";
import { motion } from "framer-motion";
import { format } from "date-fns";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function Recordings() {
  const { data: recordings, isLoading } = useQuery<Recording[]>({
    queryKey: ["/api/recordings"],
  });

  const deleteRecording = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/recordings/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/recordings"] });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50/50 py-8 px-4">
        <div className="container max-w-2xl mx-auto">
          <Card className="border-0 shadow-xl bg-white/80 backdrop-blur">
            <CardHeader className="text-center pb-2">
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                <span className="text-muted-foreground">جاري التحميل...</span>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-muted/50 animate-pulse rounded-lg" />
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50/50 py-8 px-4">
      <div className="container max-w-2xl mx-auto">
        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur">
          <CardHeader className="text-center space-y-2 pb-6">
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                تسجيلاتي
              </CardTitle>
            </motion.div>
            <p className="text-lg text-muted-foreground">
              {recordings?.length || 0} تسجيلات صوتية
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {recordings?.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <FileAudio className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground text-lg">لا توجد تسجيلات حتى الآن</p>
                <p className="text-sm text-muted-foreground/75 mt-2">
                  قم بإضافة تسجيل جديد من الصفحة الرئيسية
                </p>
              </motion.div>
            ) : (
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="space-y-4"
              >
                {recordings?.map((recording) => (
                  <motion.div key={recording.id} variants={item}>
                    <Card className="group overflow-hidden border border-muted/10 hover:border-primary/20 hover:shadow-md transition-all duration-300">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-3">
                              <FileAudio className="h-5 w-5 text-primary" />
                              <h3 className="font-medium text-lg">{recording.title}</h3>
                            </div>
                            <p className="text-sm text-muted-foreground mb-3 line-clamp-2" dir="auto">
                              {recording.originalText}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                              <Calendar className="h-3.5 w-3.5" />
                              <time>
                                {format(new Date(recording.createdAt), "dd/MM/yyyy HH:mm")}
                              </time>
                            </div>
                            <AudioPlayer audioUrl={recording.audioUrl} />
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground/50 opacity-0 group-hover:opacity-100 hover:text-destructive hover:opacity-100 transition-all"
                            onClick={() => deleteRecording.mutate(recording.id)}
                            disabled={deleteRecording.isPending}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}