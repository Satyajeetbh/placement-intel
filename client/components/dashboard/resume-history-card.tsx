import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ResumeHistoryItem } from "@/types/resume";
import { Clock3, FileText } from "lucide-react";

type Props = {
  history: ResumeHistoryItem[];
  historyLoading: boolean;
  actionLoading: boolean;
  activeResumeId: string;
  onOpenResume: (id: string) => void;
};

const formatDate = (dateString?: string | null) => {
  if (!dateString) return "Not processed yet";
  return new Date(dateString).toLocaleString();
};

const getStatusBadgeVariant = (
  status: ResumeHistoryItem["processingStatus"],
) => {
  if (status === "completed") return "default" as const;
  if (status === "processing" || status === "queued")
    return "secondary" as const;
  return "destructive" as const;
};

export default function ResumeHistoryCard({
  history,
  historyLoading,
  actionLoading,
  activeResumeId,
  onOpenResume,
}: Props) {
  return (
    <Card className="rounded-3xl border-border shadow-sm">
      <CardHeader>
        <CardTitle>Resume History</CardTitle>
        <CardDescription>
          Review previous analyses and reopen any completed result.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {historyLoading ? (
          <p className="text-sm text-muted-foreground">Loading history...</p>
        ) : history.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No resume analyses yet.
          </p>
        ) : (
          <div className="max-h-[34rem] space-y-3 overflow-y-auto pr-1">
            {history.map((item) => (
              <div
                key={item._id}
                className="rounded-2xl border border-border bg-background/70 p-4"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-xl bg-primary/10 p-2 text-primary">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-foreground">
                        {item.fileName || "Untitled resume"}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <Badge
                          variant={getStatusBadgeVariant(item.processingStatus)}
                        >
                          {item.processingStatus}
                        </Badge>
                        {typeof item.finalScore === "number" && (
                          <Badge variant="outline">
                            Score {item.finalScore}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock3 className="h-4 w-4" />
                    <span>
                      {formatDate(item.processedAt || item.createdAt)}
                    </span>
                  </div>

                  <Button
                    variant={
                      activeResumeId === item._id ? "secondary" : "outline"
                    }
                    onClick={() => onOpenResume(item._id)}
                    disabled={
                      actionLoading || item.processingStatus !== "completed"
                    }
                    className="w-full rounded-full"
                  >
                    {item.processingStatus !== "completed"
                      ? "Unavailable"
                      : activeResumeId === item._id
                        ? "Currently Open"
                        : "Open Result"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
