import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  LogOut,
  Sparkles,
  Target,
  UploadCloud,
} from "lucide-react";

type Props = {
  name: string;
  onLogout: () => void;
};

export default function DashboardHeader({ name, onLogout }: Props) {
  return (
    <div className="flex flex-col gap-5 rounded-3xl border border-border bg-card p-6 shadow-sm md:flex-row md:items-center md:justify-between">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <LayoutDashboard className="h-5 w-5 text-primary" />
          <p className="text-sm font-medium text-muted-foreground">Dashboard</p>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Welcome, {name}
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
            Upload your resume, review structure and measurable impact, and turn
            the analysis into clearer recruiter-facing improvements.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="rounded-full px-3 py-1">
            ResumeIntel
          </Badge>
          <Badge variant="outline" className="rounded-full px-3 py-1">
            <UploadCloud className="mr-1 h-3 w-3" />
            PDF upload
          </Badge>
          <Badge variant="outline" className="rounded-full px-3 py-1">
            <Target className="mr-1 h-3 w-3" />
            JD matching
          </Badge>
          <Badge variant="outline" className="rounded-full px-3 py-1">
            <Sparkles className="mr-1 h-3 w-3" />
            AI rewrites
          </Badge>
        </div>
      </div>

      <Button
        variant="outline"
        onClick={onLogout}
        className="w-full rounded-full md:w-auto"
      >
        <LogOut className="mr-2 h-4 w-4" />
        Logout
      </Button>
    </div>
  );
}
