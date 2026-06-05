import { Card, CardContent } from "@/components/ui/card";
import { FileText, Type, BrainCircuit, ListChecks } from "lucide-react";

type Props = {
  wordCount: number;
  charCount: number;
  skillsCount: number;
  sectionsCount: number;
};

export default function StatsGrid({
  wordCount,
  charCount,
  skillsCount,
  sectionsCount,
}: Props) {
  const stats = [
    {
      label: "Word Count",
      value: wordCount,
      icon: FileText,
      helper:
        wordCount < 300
          ? "Could use more detail"
          : wordCount > 900
            ? "Consider trimming"
            : "Healthy content range",
    },
    {
      label: "Character Count",
      value: charCount,
      icon: Type,
      helper: "Overall resume density",
    },
    {
      label: "Skills Found",
      value: skillsCount,
      icon: BrainCircuit,
      helper:
        skillsCount >= 15
          ? "Strong technical coverage"
          : "Expand core stack details",
    },
    {
      label: "Sections Found",
      value: sectionsCount,
      icon: ListChecks,
      helper:
        sectionsCount >= 5
          ? "Good structural coverage"
          : "Consider adding core sections",
    },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <Card
            key={stat.label}
            className="rounded-3xl border-border bg-gradient-to-br from-card to-muted/30 shadow-sm"
          >
            <CardContent className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-3">
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </p>
                  <p className="text-4xl font-bold tracking-tight text-foreground">
                    {stat.value}
                  </p>
                </div>
                <div className="rounded-2xl bg-primary/10 p-3 text-primary shadow-sm">
                  <Icon className="h-5 w-5" />
                </div>
              </div>

              <p className="mt-4 text-sm text-muted-foreground">
                {stat.helper}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </section>
  );
}
