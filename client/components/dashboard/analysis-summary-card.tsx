import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Sparkles, TrendingUp } from "lucide-react";

type Strength = {
  label: string;
  variant: "default" | "secondary" | "outline" | "destructive";
} | null;

type Props = {
  finalScore: number;
  resumeScore: number;
  skillsCount: number;
  sectionsCount: number;
  quantifiedBullets: number;
  hasJDMatch: boolean;
  strength: Strength;
};

function getSummaryText({
  finalScore,
  quantifiedBullets,
  hasJDMatch,
}: {
  finalScore: number;
  quantifiedBullets: number;
  hasJDMatch: boolean;
}) {
  if (finalScore >= 80) {
    return hasJDMatch
      ? "Strong overall profile with solid alignment to the target role."
      : "Strong overall profile with clear structure and technical depth.";
  }

  if (quantifiedBullets === 0) {
    return "Good baseline, but measurable outcomes are the biggest opportunity to improve recruiter impact.";
  }

  return hasJDMatch
    ? "A promising draft with room to improve both resume quality and job-targeted alignment."
    : "A decent foundation with room to make the resume more specific, measurable, and recruiter-friendly.";
}

export default function AnalysisSummaryCard({
  finalScore,
  resumeScore,
  skillsCount,
  sectionsCount,
  quantifiedBullets,
  hasJDMatch,
  strength,
}: Props) {
  const summaryText = getSummaryText({
    finalScore,
    quantifiedBullets,
    hasJDMatch,
  });

  const summaryStats = [
    {
      label: "Resume quality",
      value: `${resumeScore}/100`,
      icon: Target,
    },
    {
      label: hasJDMatch ? "JD-aware final" : "Final score",
      value: `${finalScore}/100`,
      icon: TrendingUp,
    },
    {
      label: "AI and scoring context",
      value: hasJDMatch ? "JD included" : "Resume only",
      icon: Sparkles,
    },
  ];

  return (
    <Card className="rounded-3xl border-border bg-card shadow-sm">
      <CardContent className="p-6 md:p-7">
        <div className="grid gap-6 lg:grid-cols-[1.25fr_0.95fr] lg:items-center">
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-sm font-medium text-muted-foreground">
                Current Analysis
              </p>
              {strength && (
                <Badge
                  variant={strength.variant}
                  className="rounded-full px-3 py-1"
                >
                  {strength.label}
                </Badge>
              )}
            </div>

            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Final score</p>
                <div className="mt-2 flex items-end gap-3">
                  <h2 className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
                    {finalScore}
                  </h2>
                  <span className="pb-1 text-base font-medium text-muted-foreground">
                    /100
                  </span>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-muted/40 px-4 py-3 text-sm text-muted-foreground sm:max-w-xs">
                {summaryText}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="rounded-full px-3 py-1">
                {skillsCount} skills detected
              </Badge>
              <Badge variant="secondary" className="rounded-full px-3 py-1">
                {sectionsCount} sections found
              </Badge>
              <Badge
                variant={quantifiedBullets > 0 ? "secondary" : "outline"}
                className="rounded-full px-3 py-1"
              >
                {quantifiedBullets} quantified bullets
              </Badge>
              <Badge
                variant={hasJDMatch ? "default" : "outline"}
                className="rounded-full px-3 py-1"
              >
                {hasJDMatch ? "JD match included" : "No JD provided"}
              </Badge>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {summaryStats.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="rounded-2xl border border-border bg-background/70 p-4"
                >
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <div className="rounded-xl bg-primary/10 p-2 text-primary">
                      <Icon className="h-4 w-4" />
                    </div>
                    <p className="text-xs font-medium uppercase tracking-wide">
                      {item.label}
                    </p>
                  </div>
                  <p className="mt-4 text-xl font-semibold text-foreground">
                    {item.value}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
