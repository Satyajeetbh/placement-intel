import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Sigma, Percent, ListOrdered, Target } from "lucide-react";

type Props = {
  totalBullets: number;
  quantifiedBullets: number;
  percentageMentions: number;
  numberMentions: number;
};

export default function QuantificationChartCard({
  totalBullets,
  quantifiedBullets,
  percentageMentions,
  numberMentions,
}: Props) {
  const quantifiedPercent =
    totalBullets > 0 ? Math.round((quantifiedBullets / totalBullets) * 100) : 0;

  const numberMentionsScore = Math.min(numberMentions * 10, 100);
  const percentageMentionsScore = Math.min(percentageMentions * 20, 100);

  const bars = [
    {
      label: "Quantified bullets ratio",
      value: quantifiedPercent,
      helper: `${quantifiedBullets}/${totalBullets || 0} bullets include measurable results`,
    },
    {
      label: "Number mentions strength",
      value: numberMentionsScore,
      helper: `${numberMentions} numeric mentions detected`,
    },
    {
      label: "Percentage mentions strength",
      value: percentageMentionsScore,
      helper: `${percentageMentions} percentage mentions detected`,
    },
  ];

  const statCards = [
    {
      label: "Total bullets",
      value: totalBullets,
      icon: ListOrdered,
    },
    {
      label: "Quantified bullets",
      value: quantifiedBullets,
      icon: Target,
    },
    {
      label: "Numeric mentions",
      value: numberMentions,
      icon: Sigma,
    },
    {
      label: "Percent mentions",
      value: percentageMentions,
      icon: Percent,
    },
  ];

  return (
    <Card className="rounded-3xl border-border shadow-sm">
      <CardHeader className="space-y-3 pb-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle>Quantified Impact</CardTitle>
            <CardDescription>
              Measures how much measurable evidence appears across your resume
              bullets.
            </CardDescription>
          </div>

          <Badge
            variant={quantifiedPercent > 0 ? "secondary" : "outline"}
            className="rounded-full px-3 py-1"
          >
            {quantifiedPercent}% quantified
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="rounded-2xl border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
          {quantifiedBullets > 0
            ? `You already have ${quantifiedBullets} quantified bullet${quantifiedBullets === 1 ? "" : "s"}. Add a few more measurable outcomes to strengthen credibility further.`
            : "No quantified bullets detected yet. Add percentages, scale, latency reductions, revenue, or usage metrics to make achievements more convincing."}
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {statCards.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="rounded-2xl border border-border bg-background/70 p-4"
              >
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Icon className="h-4 w-4 text-primary" />
                  <p className="text-sm">{item.label}</p>
                </div>
                <p className="mt-3 text-2xl font-semibold text-foreground">
                  {item.value}
                </p>
              </div>
            );
          })}
        </div>

        <div className="space-y-4">
          {bars.map((bar) => (
            <div key={bar.label} className="space-y-2">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {bar.label}
                  </p>
                  <p className="text-xs text-muted-foreground">{bar.helper}</p>
                </div>
                <p className="text-sm font-medium text-foreground">
                  {bar.value}%
                </p>
              </div>
              <Progress value={bar.value} className="h-2.5" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
