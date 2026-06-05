"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowRight,
  CheckCircle2,
  LockKeyhole,
  Sparkles,
  Target,
} from "lucide-react";

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

const benefits = [
  "Review structure, skills, and quantified impact in one place.",
  "See recruiter-friendly strengths and highest-priority improvements.",
  "Get AI rewrite suggestions when you want sharper bullet points.",
];

const trustPoints = [
  {
    label: "Resume scoring",
    icon: Target,
  },
  {
    label: "Secure account",
    icon: LockKeyhole,
  },
  {
    label: "AI suggestions",
    icon: Sparkles,
  },
];

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
    } catch (error: unknown) {
      setError(getErrorMessage(error, "Login failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-7xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[2rem] border border-border bg-card shadow-2xl lg:grid-cols-[1.05fr_0.95fr]">
          <div className="hidden flex-col justify-between border-r border-border bg-linear-to-br from-primary to-primary/85 p-10 text-primary-foreground lg:flex xl:p-12">
            <div className="space-y-8">
              <div className="flex flex-wrap gap-2">
                <Badge className="rounded-full bg-primary-foreground/15 px-3 py-1 text-primary-foreground hover:bg-primary-foreground/15">
                  ResumeIntel
                </Badge>
                <Badge className="rounded-full bg-primary-foreground/10 px-3 py-1 text-primary-foreground hover:bg-primary-foreground/10">
                  Login
                </Badge>
              </div>

              <div className="space-y-4">
                <h1 className="max-w-xl text-4xl font-bold leading-tight xl:text-5xl">
                  See what your resume is really communicating.
                </h1>
                <p className="max-w-lg text-base leading-7 text-primary-foreground/80 xl:text-lg">
                  Sign in to open your dashboard, upload a resume, and review
                  the recruiter-facing signals that matter most.
                </p>
              </div>

              <div className="space-y-4">
                {benefits.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-2xl bg-primary-foreground/10 p-4"
                  >
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary-foreground" />
                    <p className="text-sm leading-6 text-primary-foreground/85">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4 rounded-3xl border border-primary-foreground/15 bg-primary-foreground/10 p-5">
              <p className="text-sm font-medium text-primary-foreground/90">
                Built for students and early-career engineers who want stronger
                resumes, not guesswork.
              </p>
              <div className="flex flex-wrap gap-2">
                {trustPoints.map((item) => {
                  const Icon = item.icon;
                  return (
                    <span
                      key={item.label}
                      className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/15 px-3 py-1 text-xs text-primary-foreground/90"
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {item.label}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center p-6 sm:p-8 lg:p-10 xl:p-12">
            <Card className="w-full max-w-lg border-0 bg-transparent shadow-none">
              <CardContent className="p-0">
                <div className="mb-8 space-y-3">
                  <Badge variant="secondary" className="rounded-full px-3 py-1">
                    Welcome back
                  </Badge>
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                      Login
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                      Access your dashboard and continue improving your resume
                      with structure, impact, and AI-guided feedback.
                    </p>
                  </div>
                </div>

                {error && (
                  <Alert variant="destructive" className="mb-5">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2.5">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="h-12 rounded-2xl"
                    />
                  </div>

                  <div className="space-y-2.5">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-12 rounded-2xl"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="h-12 w-full rounded-2xl text-sm font-medium"
                    disabled={loading}
                  >
                    {loading ? "Logging in..." : "Login"}
                    {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                  </Button>
                </form>

                <div className="mt-5 rounded-2xl border border-border bg-muted/30 p-4">
                  <p className="text-sm text-muted-foreground">
                    PDF upload • Resume scoring • Optional AI rewrite
                    suggestions
                  </p>
                </div>

                <p className="mt-6 text-sm text-muted-foreground">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/register"
                    className="font-medium text-primary hover:underline"
                  >
                    Create one
                  </Link>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
