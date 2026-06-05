import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ResumeComparison } from "@/types/resume";
import { ArrowDownRight, ArrowUpRight, GitCompare, Minus } from "lucide-react";

type Props = {
  comparison: ResumeComparison | null;
  loading?: boolean;
};

function deltaText(value: number) {
  return `${value > 0 ? "+" : ""}${value}`;
}

function deltaVariant(
  value: number,
): "default" | "secondary" | "destructive" | "outline" {
  if (value > 0) return "default";
  if (value < 0) return "destructive";
  return "secondary";
}

function DeltaIcon({ value }: { value: number }) {
  if (value > 0) return <ArrowUpRight className="h-4 w-4" />;
  if (value < 0) return <ArrowDownRight className="h-4 w-4" />;
  return <Minus className="h-4 w-4" />;
}

export default function ResumeComparisonCard({ comparison, loading }: Props) {
  if (loading) {
    return (
      <Card className="rounded-3xl border border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Version Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Loading comparison...</p>
        </CardContent>
      </Card>
    );
  }

  if (!comparison) return null;

  const { deltas, skills, current, previous } = comparison;

  const metricCards = [
    { label: "Final score", value: deltas.finalScore },
    { label: "Rule score", value: deltas.ruleScore },
    { label: "AI score", value: deltas.aiScore },
    { label: "Quantified bullets", value: deltas.quantifiedBullets },
  ];

  return (
    <Card className="rounded-3xl border border-border shadow-sm">
      <CardHeader className="space-y-3 pb-4">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-primary/10 p-3 text-primary">
            <GitCompare className="h-5 w-5" />
          </div>
          <div>
            <CardTitle>Version Comparison</CardTitle>
            <CardDescription>
              Compare this resume against the previous completed version to see
              what improved.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {metricCards.map((item) => (
            <div
              key={item.label}
              className="rounded-2xl border border-border bg-muted/30 p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm text-muted-foreground">{item.label}</p>
                <Badge
                  variant={deltaVariant(item.value)}
                  className="rounded-full px-3 py-1"
                >
                  <DeltaIcon value={item.value} />
                  {deltaText(item.value)}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-background/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Current resume
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3 md:grid-cols-1 xl:grid-cols-3">
              <div>
                <p className="text-sm text-muted-foreground">Final</p>
                <p className="mt-1 text-xl font-semibold text-foreground">
                  {current.finalScore}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Skills</p>
                <p className="mt-1 text-xl font-semibold text-foreground">
                  {current.skillsCount}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Quantified bullets
                </p>
                <p className="mt-1 text-xl font-semibold text-foreground">
                  {current.quantifiedBullets}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-background/70 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Previous resume
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3 md:grid-cols-1 xl:grid-cols-3">
              <div>
                <p className="text-sm text-muted-foreground">Final</p>
                <p className="mt-1 text-xl font-semibold text-foreground">
                  {previous.finalScore}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Skills</p>
                <p className="mt-1 text-xl font-semibold text-foreground">
                  {previous.skillsCount}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Quantified bullets
                </p>
                <p className="mt-1 text-xl font-semibold text-foreground">
                  {previous.quantifiedBullets}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-emerald-500/5 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Skills added
            </p>
            {skills.added.length ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {skills.added.map((skill) => (
                  <Badge
                    key={`add-${skill}`}
                    variant="default"
                    className="rounded-full"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">
                No new skills detected.
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-border bg-amber-500/5 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Skills removed
            </p>
            {skills.removed.length ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {skills.removed.map((skill) => (
                  <Badge
                    key={`remove-${skill}`}
                    variant="outline"
                    className="rounded-full bg-background/80"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">
                No removed skills.
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
