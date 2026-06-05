import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Target, TriangleAlert } from "lucide-react";

type Props = {
  matchPercentage: number;
  matchedKeywords: string[];
  missingKeywords: string[];
};

function getMatchLabel(matchPercentage: number) {
  if (matchPercentage >= 75) {
    return { label: "Strong alignment", variant: "default" as const };
  }

  if (matchPercentage >= 50) {
    return { label: "Partial alignment", variant: "secondary" as const };
  }

  return { label: "Needs tailoring", variant: "outline" as const };
}

export default function JDMatchCard({
  matchPercentage,
  matchedKeywords,
  missingKeywords,
}: Props) {
  const matchMeta = getMatchLabel(matchPercentage);

  return (
    <Card className="rounded-3xl border-border shadow-sm">
      <CardHeader className="space-y-3 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle>Job Description Match</CardTitle>
            <CardDescription>
              Shows how well your resume aligns with the target role based on
              matched and missing keywords.
            </CardDescription>
          </div>

          <Badge variant={matchMeta.variant} className="rounded-full px-3 py-1">
            {matchMeta.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-3xl border border-border bg-muted/30 p-5">
            <p className="text-sm font-medium text-muted-foreground">
              Match percentage
            </p>
            <div className="mt-3 flex items-end gap-2">
              <p className="text-5xl font-bold tracking-tight text-foreground">
                {matchPercentage}
              </p>
              <span className="pb-1 text-lg text-muted-foreground">%</span>
            </div>
            <Progress value={matchPercentage} className="mt-5 h-3" />
            <p className="mt-3 text-sm text-muted-foreground">
              Higher percentages suggest the resume is already using language
              closer to the job description.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <div className="rounded-2xl border border-border bg-background/70 p-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <p className="text-sm">Matched keywords</p>
              </div>
              <p className="mt-3 text-2xl font-semibold text-foreground">
                {matchedKeywords.length}
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-background/70 p-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <TriangleAlert className="h-4 w-4 text-amber-600" />
                <p className="text-sm">Missing keywords</p>
              </div>
              <p className="mt-3 text-2xl font-semibold text-foreground">
                {missingKeywords.length}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-emerald-500/5 p-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <h3 className="text-sm font-semibold text-foreground">
                Matched keywords
              </h3>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {matchedKeywords.length > 0 ? (
                matchedKeywords.map((keyword) => (
                  <Badge
                    key={keyword}
                    variant="secondary"
                    className="rounded-full"
                  >
                    {keyword}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No matched keywords found yet.
                </p>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-amber-500/5 p-4">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-amber-600" />
              <h3 className="text-sm font-semibold text-foreground">
                Missing keywords
              </h3>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {missingKeywords.length > 0 ? (
                missingKeywords.map((keyword) => (
                  <Badge
                    key={keyword}
                    variant="outline"
                    className="rounded-full bg-background/80"
                  >
                    {keyword}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No missing keywords detected.
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
