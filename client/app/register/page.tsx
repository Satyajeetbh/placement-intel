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
  BrainCircuit,
  CheckCircle2,
  Sparkles,
  TrendingUp,
} from "lucide-react";

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

const benefits = [
  "Upload your resume and review core structure, skills, and quantified impact.",
  "Compare your profile against a job description to identify missing keywords.",
  "Use AI guidance to tighten bullets and make achievements clearer.",
];

const highlights = [
  {
    label: "Skill extraction",
    icon: BrainCircuit,
  },
  {
    label: "Score tracking",
    icon: TrendingUp,
  },
  {
    label: "AI guidance",
    icon: Sparkles,
  },
];

export default function RegisterPage() {
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register(name, email, password);
    } catch (error: unknown) {
      setError(getErrorMessage(error, "Register failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-7xl items-center justify-center">
        <div className="grid w-full overflow-hidden rounded-[2rem] border border-border bg-card shadow-2xl lg:grid-cols-[1.05fr_0.95fr]">
          <div className="hidden flex-col justify-between border-r border-border bg-linear-to-br from-foreground to-foreground/85 p-10 text-background lg:flex xl:p-12">
            <div className="space-y-8">
              <div className="flex flex-wrap gap-2">
                <Badge className="rounded-full bg-background/12 px-3 py-1 text-background hover:bg-background/12">
                  ResumeIntel
                </Badge>
                <Badge className="rounded-full bg-background/10 px-3 py-1 text-background hover:bg-background/10">
                  Create account
                </Badge>
              </div>

              <div className="space-y-4">
                <h1 className="max-w-xl text-4xl font-bold leading-tight xl:text-5xl">
                  Build a stronger profile with actual feedback.
                </h1>
                <p className="max-w-lg text-base leading-7 text-background/80 xl:text-lg">
                  Create your account to start analyzing what recruiters notice
                  first and where your resume can become more convincing.
                </p>
              </div>

              <div className="space-y-4">
                {benefits.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-2xl bg-background/10 p-4"
                  >
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-background" />
                    <p className="text-sm leading-6 text-background/85">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4 rounded-3xl border border-background/10 bg-background/10 p-5">
              <p className="text-sm font-medium text-background/90">
                Stop guessing whether your resume is good. Test it, improve it,
                and track the changes.
              </p>
              <div className="flex flex-wrap gap-2">
                {highlights.map((item) => {
                  const Icon = item.icon;
                  return (
                    <span
                      key={item.label}
                      className="inline-flex items-center gap-2 rounded-full border border-background/15 px-3 py-1 text-xs text-background/90"
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
                    Start free
                  </Badge>
                  <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                      Create account
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground sm:text-base">
                      Start using your resume analysis dashboard and unlock
                      structured feedback, score breakdowns, and AI-assisted
                      improvements.
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
                    <Label htmlFor="name">Full name</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="h-12 rounded-2xl"
                    />
                  </div>

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
                      placeholder="Create a password"
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
                    {loading ? "Creating account..." : "Register"}
                    {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                  </Button>
                </form>

                <div className="mt-5 rounded-2xl border border-border bg-muted/30 p-4">
                  <p className="text-sm text-muted-foreground">
                    Analyze your resume, compare against job descriptions, and
                    improve bullets with clearer feedback.
                  </p>
                </div>

                <p className="mt-6 text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-medium text-primary hover:underline"
                  >
                    Login
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
