import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, FileAudio, Calendar } from "lucide-react";
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
      <div className="container max-w-2xl mx-auto p-4">
        <Card>
          <CardHeader>
            <div className="h-8 w-48 bg-muted animate-pulse rounded" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-muted animate-pulse rounded" />
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto p-4">
      <Card className="border-0 shadow-lg">
        <CardHeader className="text-center pb-2">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            تسجيلاتي
          </CardTitle>
          <p className="text-muted-foreground mt-1">
            {recordings?.length || 0} تسجيلات
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {recordings?.length === 0 ? (
            <div className="text-center py-8">
              <FileAudio className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">لا توجد تسجيلات حتى الآن</p>
            </div>
          ) : (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
              className="space-y-4"
            >
              {recordings?.map((recording) => (
                <motion.div key={recording.id} variants={item}>
                  <Card className="overflow-hidden border border-muted/20 hover:border-primary/20 transition-colors">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <FileAudio className="h-4 w-4 text-primary" />
                            <h3 className="font-medium">{recording.title}</h3>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-2" dir="auto">
                            {recording.originalText}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                            <Calendar className="h-3 w-3" />
                            <time>
                              {format(new Date(recording.createdAt), "dd/MM/yyyy HH:mm")}
                            </time>
                          </div>
                          <AudioPlayer audioUrl={recording.audioUrl} />
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
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
  );
}