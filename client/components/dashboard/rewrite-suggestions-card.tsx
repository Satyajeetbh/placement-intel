"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Copy, Sparkles } from "lucide-react";

type Rewrite = {
  original: string;
  rewritten: string;
  rationale: string;
  confidence: number;
};

type Props = {
  rewrites?: Rewrite[];
};

function getConfidenceVariant(confidence: number) {
  if (confidence >= 0.85) return "default" as const;
  if (confidence >= 0.65) return "secondary" as const;
  return "outline" as const;
}

function getConfidenceLabel(confidence: number) {
  if (confidence >= 0.85) return "High confidence";
  if (confidence >= 0.65) return "Moderate confidence";
  return "Review closely";
}

export default function RewriteSuggestionsCard({ rewrites = [] }: Props) {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  if (!rewrites.length) return null;

  const copyText = async (text: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 1200);
    } catch {
      setCopiedIdx(null);
    }
  };

  return (
    <Card className="rounded-3xl border border-border shadow-sm">
      <CardHeader className="space-y-2 pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <CardTitle className="text-lg">AI Rewrite Suggestions</CardTitle>
        </div>
        <CardDescription>
          Compare dense or generic bullets with clearer, more concise rewrites
          that emphasize technical impact.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {rewrites.map((item, idx) => (
          <div
            key={`${item.original}-${idx}`}
            className="rounded-2xl border border-border bg-background/70 p-4"
          >
            <div className="grid gap-4 xl:grid-cols-2">
              <div className="rounded-2xl border border-border bg-muted/20 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Before
                </p>
                <p className="mt-3 text-sm leading-6 text-foreground">
                  {item.original}
                </p>
              </div>

              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  After
                </p>
                <p className="mt-3 text-sm font-medium leading-6 text-foreground">
                  {item.rewritten}
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Badge
                variant={getConfidenceVariant(item.confidence || 0)}
                className="rounded-full px-3 py-1"
              >
                {getConfidenceLabel(item.confidence || 0)} ·{" "}
                {Math.round((item.confidence || 0) * 100)}%
              </Badge>

              <Button
                type="button"
                size="sm"
                className="rounded-full"
                onClick={() => copyText(item.rewritten, idx)}
              >
                {copiedIdx === idx ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy rewritten bullet
                  </>
                )}
              </Button>
            </div>

            {item.rationale ? (
              <div className="mt-4 rounded-2xl bg-muted/30 p-3">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Why this is better
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {item.rationale}
                </p>
              </div>
            ) : null}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
