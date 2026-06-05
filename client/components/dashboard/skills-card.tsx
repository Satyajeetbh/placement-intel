import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { BrainCircuit, Sparkles } from "lucide-react";

export default function SkillsCard({ skills }: { skills: string[] }) {
  const sortedSkills = [...skills].sort((a, b) => a.localeCompare(b));

  return (
    <Card className="rounded-3xl border-border shadow-sm">
      <CardHeader className="space-y-3 pb-4">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-primary/10 p-3 text-primary">
            <BrainCircuit className="h-5 w-5" />
          </div>
          <div>
            <CardTitle>Extracted Skills</CardTitle>
            <CardDescription>
              Technical skills identified directly from the resume content.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="rounded-2xl border border-border bg-muted/30 p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Sparkles className="h-4 w-4 text-primary" />
            <p className="text-sm">Skills detected</p>
          </div>
          <p className="mt-3 text-3xl font-semibold text-foreground">
            {sortedSkills.length}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {sortedSkills.length > 0 ? (
            sortedSkills.map((skill) => (
              <Badge key={skill} className="rounded-full px-3 py-1">
                {skill}
              </Badge>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">No skills detected.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
