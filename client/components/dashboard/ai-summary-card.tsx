import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bot, Sparkles, TriangleAlert } from "lucide-react";

type Props = {
  summary?: string;
  confidence?: number;
  model?: string;
  isFallback?: boolean;
};

function getConfidenceVariant(confidence: number) {
  if (confidence >= 0.85) return "default" as const;
  if (confidence >= 0.65) return "secondary" as const;
  return "outline" as const;
}

export default function AISummaryCard({
  summary,
  confidence,
  model,
  isFallback,
}: Props) {
  if (!summary) return null;

  return (
    <Card className="rounded-3xl border border-border shadow-sm">
      <CardHeader className="space-y-3 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-primary/10 p-3 text-primary">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <CardTitle>AI Summary</CardTitle>
              <CardDescription>
                High-level guidance synthesized from the resume analysis
                pipeline.
              </CardDescription>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {typeof confidence === "number" && (
              <Badge
                variant={getConfidenceVariant(confidence)}
                className="rounded-full px-3 py-1"
              >
                Confidence {Math.round(confidence * 100)}%
              </Badge>
            )}
            {model && (
              <Badge variant="outline" className="rounded-full px-3 py-1">
                Model {model}
              </Badge>
            )}
            {isFallback && (
              <Badge variant="destructive" className="rounded-full px-3 py-1">
                <TriangleAlert className="mr-1 h-3 w-3" />
                Fallback
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="rounded-2xl border border-border bg-primary/5 p-5">
          <div className="mb-3 flex items-center gap-2 text-primary">
            <Sparkles className="h-4 w-4" />
            <p className="text-sm font-medium">AI reading</p>
          </div>
          <p className="text-sm leading-7 text-muted-foreground">{summary}</p>
        </div>
      </CardContent>
    </Card>
  );
}
