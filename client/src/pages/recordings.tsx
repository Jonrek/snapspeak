import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import AudioPlayer from "@/components/AudioPlayer";
import type { Recording } from "@shared/schema";

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
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="container max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>My Recordings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {recordings?.length === 0 ? (
            <p className="text-center text-muted-foreground">No recordings yet</p>
          ) : (
            recordings?.map((recording) => (
              <Card key={recording.id} className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-medium">{recording.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {recording.originalText}
                    </p>
                    <AudioPlayer audioUrl={recording.audioUrl} />
                  </div>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => deleteRecording.mutate(recording.id)}
                    disabled={deleteRecording.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
