import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { FileCheck2, ListChecks } from "lucide-react";

function formatSectionLabel(section: string) {
  return section
    .split(/[_\s]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function SectionsCard({ sections }: { sections: string[] }) {
  return (
    <Card className="rounded-3xl border-border shadow-sm">
      <CardHeader className="space-y-3 pb-4">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-primary/10 p-3 text-primary">
            <ListChecks className="h-5 w-5" />
          </div>
          <div>
            <CardTitle>Detected Sections</CardTitle>
            <CardDescription>
              Sections currently identified from the uploaded resume.
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        <div className="rounded-2xl border border-border bg-muted/30 p-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <FileCheck2 className="h-4 w-4 text-primary" />
            <p className="text-sm">Sections found</p>
          </div>
          <p className="mt-3 text-3xl font-semibold text-foreground">
            {sections.length}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {sections.length > 0 ? (
            sections.map((section) => (
              <Badge
                key={section}
                variant="secondary"
                className="rounded-full px-3 py-1"
              >
                {formatSectionLabel(section)}
              </Badge>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              No sections detected.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
