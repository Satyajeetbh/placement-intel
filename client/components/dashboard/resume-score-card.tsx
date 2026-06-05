import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

type ScoreBreakdown = {
  sectionCompletenessScore: number;
  technicalSkillScore: number;
  bulletStructureScore: number;
  quantifiedImpactScore: number;
  actionVerbScore: number;
  lengthScore: number;
  projectExperienceTechScore: number;
};

type Props = {
  resumeScore: number;
  finalScore?: number;
  scoreBreakdown: ScoreBreakdown;
};

export default function ResumeScoreCard({
  resumeScore,
  finalScore,
  scoreBreakdown,
}: Props) {
  const displayScore =
    typeof finalScore === "number" ? finalScore : resumeScore;

  const getLabel = () => {
    if (displayScore >= 75) {
      return { text: "Strong resume", variant: "default" as const };
    }

    if (displayScore >= 50) {
      return { text: "Decent foundation", variant: "secondary" as const };
    }

    return { text: "Needs work", variant: "outline" as const };
  };

  const label = getLabel();

  const breakdownItems = [
    {
      label: "Section completeness",
      score: scoreBreakdown.sectionCompletenessScore,
      max: 15,
    },
    {
      label: "Technical skills",
      score: scoreBreakdown.technicalSkillScore,
      max: 25,
    },
    {
      label: "Bullet structure",
      score: scoreBreakdown.bulletStructureScore,
      max: 15,
    },
    {
      label: "Quantified impact",
      score: scoreBreakdown.quantifiedImpactScore,
      max: 20,
    },
    {
      label: "Action verbs",
      score: scoreBreakdown.actionVerbScore,
      max: 10,
    },
    {
      label: "Length",
      score: scoreBreakdown.lengthScore,
      max: 5,
    },
    {
      label: "Project / experience tech depth",
      score: scoreBreakdown.projectExperienceTechScore,
      max: 10,
    },
  ];

  return (
    <Card className="rounded-3xl border-border shadow-sm">
      <CardHeader className="space-y-3 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle>Resume Score</CardTitle>
            <CardDescription>
              Backend scoring across structure, skills, bullet quality, impact,
              and project depth.
            </CardDescription>
          </div>

          <Badge variant={label.variant} className="rounded-full px-3 py-1">
            {label.text}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-3xl border border-border bg-muted/30 p-5">
            <p className="text-sm font-medium text-muted-foreground">
              {typeof finalScore === "number" ? "Final score" : "Resume score"}
            </p>
            <div className="mt-3 flex items-end gap-2">
              <p className="text-5xl font-bold tracking-tight text-foreground">
                {displayScore}
              </p>
              <span className="pb-1 text-lg text-muted-foreground">/100</span>
            </div>
            <Progress value={displayScore} className="mt-5 h-3" />
            <p className="mt-3 text-sm text-muted-foreground">
              {typeof finalScore === "number"
                ? "Final score can include job-description matching on top of resume quality."
                : "This score reflects the quality of the resume itself."}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <div className="rounded-2xl border border-border bg-background/70 p-4">
              <p className="text-sm text-muted-foreground">Resume score</p>
              <p className="mt-2 text-2xl font-semibold text-foreground">
                {resumeScore}/100
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                Pure resume quality before any JD influence.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-background/70 p-4">
              <p className="text-sm text-muted-foreground">Final score</p>
              <p className="mt-2 text-2xl font-semibold text-foreground">
                {displayScore}/100
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                The score surfaced to the user in the final analysis.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-sm font-semibold text-foreground">
              Score breakdown
            </p>
            <p className="text-sm text-muted-foreground">
              See which parts of the resume are already strong and which need
              the most work.
            </p>
          </div>

          <div className="space-y-4">
            {breakdownItems.map((item) => {
              const progress = (item.score / item.max) * 100;
              return (
                <div key={item.label} className="space-y-2">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm font-medium text-foreground">
                      {item.label}
                    </p>
                    <p className="text-sm font-medium text-muted-foreground">
                      {item.score}/{item.max}
                    </p>
                  </div>
                  <Progress value={progress} className="h-2.5" />
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
