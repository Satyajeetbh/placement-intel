import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  ArrowRight,
  BrainCircuit,
  FileCheck2,
  ListChecks,
  Sparkles,
  Target,
  UploadCloud,
} from "lucide-react";

const featureCards = [
  {
    title: "Resume scoring",
    description:
      "Break down structure, skills, bullet quality, and quantified impact with backend scoring.",
    icon: FileCheck2,
  },
  {
    title: "JD matching",
    description:
      "Compare your resume against a target role and surface matched and missing keywords.",
    icon: Target,
  },
  {
    title: "AI rewrite help",
    description:
      "Turn dense bullets into clearer recruiter-facing rewrites with actionable suggestions.",
    icon: Sparkles,
  },
];

const previewStats = [
  { label: "Sections found", value: "6", helper: "Strong structure coverage" },
  { label: "Skills detected", value: "20", helper: "Good technical signal" },
  { label: "Final score", value: "73", helper: "Decent foundation" },
];

const checks = [
  {
    title: "Structure and completeness",
    description:
      "Checks whether the resume includes the sections recruiters expect first.",
    icon: ListChecks,
  },
  {
    title: "Skill extraction",
    description:
      "Highlights the technical stack actually present in your resume content.",
    icon: BrainCircuit,
  },
  {
    title: "Impact signals",
    description:
      "Looks for quantified bullets, metrics, percentages, and measurable outcomes.",
    icon: Target,
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-background px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-7xl items-center justify-center">
        <div className="w-full rounded-[2rem] border border-border bg-card/95 p-6 shadow-2xl backdrop-blur sm:p-8 lg:p-10">
          <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr] xl:items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="rounded-full px-3 py-1">
                    AI-assisted resume analysis
                  </Badge>
                  <Badge variant="outline" className="rounded-full px-3 py-1">
                    PDF upload
                  </Badge>
                  <Badge variant="outline" className="rounded-full px-3 py-1">
                    JD matching
                  </Badge>
                </div>

                <div className="space-y-4">
                  <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                    See how your resume reads before recruiters do.
                  </h1>
                  <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                    ResumeIntel analyzes structure, extracted skills, quantified
                    impact, and job-description alignment so you can improve the
                    parts that matter most.
                  </p>
                </div>

                <div className="rounded-3xl border border-border bg-primary/5 p-5 shadow-sm">
                  <p className="text-sm font-medium text-foreground">
                    Start in under a minute
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Create an account to upload your resume, or log in to
                    continue an existing analysis.
                  </p>

                  <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                    <Button
                      asChild
                      size="lg"
                      className="h-12 rounded-2xl px-7 text-sm font-semibold shadow-sm sm:min-w-44"
                    >
                      <Link href="/register">
                        Get started
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>

                    <Button
                      asChild
                      variant="outline"
                      size="lg"
                      className="h-12 rounded-2xl border-2 px-7 text-sm font-semibold sm:min-w-36"
                    >
                      <Link href="/login">Login</Link>
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {featureCards.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.title}
                      className="rounded-3xl border border-border bg-muted/30 p-5"
                    >
                      <div className="rounded-2xl bg-primary/10 p-3 text-primary w-fit">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h2 className="mt-4 text-lg font-semibold text-foreground">
                        {item.title}
                      </h2>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-5">
              <Card className="rounded-[1.75rem] border-border bg-linear-to-br from-card to-muted/40 shadow-sm">
                <CardHeader className="space-y-3 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                      <UploadCloud className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">
                        Product snapshot
                      </CardTitle>
                      <CardDescription>
                        A quick view of the analysis experience users get after
                        upload.
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-5">
                  <div className="rounded-3xl border border-border bg-background/80 p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Current analysis
                        </p>
                        <p className="mt-2 text-4xl font-bold tracking-tight text-foreground">
                          Final Score 73
                        </p>
                      </div>
                      <Badge
                        variant="secondary"
                        className="rounded-full px-3 py-1"
                      >
                        Decent foundation
                      </Badge>
                    </div>

                    <div className="mt-5 grid gap-3 sm:grid-cols-3">
                      {previewStats.map((item) => (
                        <div
                          key={item.label}
                          className="rounded-2xl border border-border bg-muted/30 p-4"
                        >
                          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                            {item.label}
                          </p>
                          <p className="mt-2 text-2xl font-semibold text-foreground">
                            {item.value}
                          </p>
                          <p className="mt-2 text-xs text-muted-foreground">
                            {item.helper}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-3xl border border-border bg-primary/5 p-5">
                    <div className="flex items-center gap-2 text-primary">
                      <Sparkles className="h-4 w-4" />
                      <p className="text-sm font-medium">What it checks</p>
                    </div>

                    <div className="mt-4 space-y-4">
                      {checks.map((item) => {
                        const Icon = item.icon;
                        return (
                          <div
                            key={item.title}
                            className="flex items-start gap-3"
                          >
                            <div className="rounded-xl bg-background p-2 text-primary shadow-sm">
                              <Icon className="h-4 w-4" />
                            </div>
                            <div>
                              <h3 className="font-medium text-foreground">
                                {item.title}
                              </h3>
                              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                                {item.description}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
