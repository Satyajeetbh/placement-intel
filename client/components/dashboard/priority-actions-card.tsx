import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, CircleAlert, Sparkles } from "lucide-react";

type Action = {
  action: string;
  impact: "high" | "medium" | "low";
  reason: string;
};

type Props = {
  actions?: Action[];
};

function impactVariant(impact: Action["impact"]) {
  if (impact === "high") return "destructive" as const;
  if (impact === "medium") return "secondary" as const;
  return "outline" as const;
}

export default function PriorityActionsCard({ actions = [] }: Props) {
  if (!actions.length) return null;

  return (
    <Card className="rounded-3xl border border-border shadow-sm">
      <CardHeader className="space-y-2 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">Top Priority Actions</CardTitle>
        </div>
        <CardDescription>
          Focus on the highest-leverage changes first to improve recruiter
          readability and overall score.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {actions.map((item, idx) => (
          <div
            key={`${item.action}-${idx}`}
            className={`rounded-2xl border p-4 transition-colors ${
              idx === 0
                ? "border-primary/30 bg-primary/5"
                : "border-border bg-background/70"
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-sm font-semibold text-foreground">
                  {idx + 1}
                </div>
                <div>
                  <p className="font-medium text-foreground">{item.action}</p>
                  {item.reason ? (
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {item.reason}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {idx === 0 && (
                  <Badge variant="default" className="rounded-full px-3 py-1">
                    Highest impact
                  </Badge>
                )}
                <Badge
                  variant={impactVariant(item.impact)}
                  className="rounded-full px-3 py-1"
                >
                  {item.impact}
                </Badge>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
              <CircleAlert className="h-4 w-4" />
              <span>
                {item.impact === "high"
                  ? "Worth addressing early because it directly affects clarity and credibility."
                  : item.impact === "medium"
                    ? "Helpful improvement once the major issues are addressed."
                    : "A smaller polish improvement after the big wins are complete."}
              </span>
              <ArrowUpRight className="ml-auto h-4 w-4" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
