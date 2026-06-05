"use client";

import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/context/AuthContext";
import { useResumeAnalysis } from "@/hooks/useResumeAnalysis";

import DashboardHeader from "@/components/dashboard/dashboard-header";
import ResumeUploadCard from "@/components/dashboard/resume-upload-card";
import StatsGrid from "@/components/dashboard/stats-grid";
import SkillsCard from "@/components/dashboard/skills-card";
import SectionsCard from "@/components/dashboard/sections-card";
import ResumeScoreCard from "@/components/dashboard/resume-score-card";
import QuantificationChartCard from "@/components/dashboard/quantification-chart-card";
import ResumeHistoryCard from "@/components/dashboard/resume-history-card";
import FeedbackCard from "@/components/dashboard/feedback-card";
import JDMatchCard from "@/components/dashboard/jd-match-card";
import { getResumeStrength } from "@/lib/getResumeStrength";
import AnalysisSummaryCard from "@/components/dashboard/analysis-summary-card";
import AISummaryCard from "@/components/dashboard/ai-summary-card";
import PriorityActionsCard from "@/components/dashboard/priority-actions-card";
import RewriteSuggestionsCard from "@/components/dashboard/rewrite-suggestions-card";
import ResumeComparisonCard from "@/components/dashboard/resume-comparison-card";
import { Activity, FileText, Mail } from "lucide-react";

function getStatusLabel(
  processingStatus: string,
  isUploading: boolean,
  isOpeningHistory: boolean,
) {
  if (isUploading) return "Uploading resume";
  if (isOpeningHistory) return "Opening saved result";
  if (processingStatus === "queued") return "Queued for processing";
  if (processingStatus === "processing") return "Analyzing resume";
  if (processingStatus === "completed") return "Analysis complete";
  if (processingStatus === "failed") return "Analysis failed";
  return "Ready to analyze";
}

export default function DashboardPage() {
  const { user, logout } = useAuth();

  const {
    file,
    setFile,
    jobDescription,
    setJobDescription,
    clearSelectedFile,
    result,
    error,
    isUploading,
    isOpeningHistory,
    resumeId,
    processingStatus,
    history,
    historyLoading,
    handleUpload,
    loadResumeFromHistory,
    comparison,
    comparisonLoading,
    analyzeWithAI,
    setAnalyzeWithAI,
    compareToResumeId,
    setCompareToResumeId,
  } = useResumeAnalysis(user);

  const detectedSections = result
    ? Array.isArray(result.sectionOrder) && result.sectionOrder.length > 0
      ? result.sectionOrder
      : Object.entries(result.sections)
          .filter(
            ([, value]) => typeof value === "string" && value.trim().length > 0,
          )
          .map(([key]) => key)
    : [];

  const strength = getResumeStrength(result?.finalScore);
  const statusLabel = getStatusLabel(
    processingStatus,
    isUploading,
    isOpeningHistory,
  );
  const hasAIInsights = Boolean(
    result?.aiInsights?.overallSummary ||
    result?.aiInsights?.priorityActions?.length ||
    result?.aiInsights?.rewrittenBullets?.length,
  );

  if (!user) return null;

  return (
    <main className="min-h-screen bg-background px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <DashboardHeader name={user.name} onLogout={logout} />

        <section className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3 text-muted-foreground">
              <div className="rounded-xl bg-primary/10 p-2 text-primary">
                <Mail className="h-4 w-4" />
              </div>
              <p className="text-sm font-medium">Signed in as</p>
            </div>
            <p className="mt-4 break-all text-lg font-semibold text-foreground">
              {user.email}
            </p>
          </div>

          <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3 text-muted-foreground">
              <div className="rounded-xl bg-primary/10 p-2 text-primary">
                <Activity className="h-4 w-4" />
              </div>
              <p className="text-sm font-medium">Analysis status</p>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <p className="text-lg font-semibold text-foreground">
                {statusLabel}
              </p>
              {strength && (
                <Badge
                  variant={strength.variant}
                  className="rounded-full px-3 py-1"
                >
                  {strength.label}
                </Badge>
              )}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Upload a resume or reopen a previous result to continue the review
              flow.
            </p>
          </div>

          <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3 text-muted-foreground">
              <div className="rounded-xl bg-primary/10 p-2 text-primary">
                <FileText className="h-4 w-4" />
              </div>
              <p className="text-sm font-medium">Open result</p>
            </div>
            <p className="mt-4 text-lg font-semibold text-foreground">
              {result?.fileName || "No analysis selected"}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {result
                ? "Current analysis is loaded below with scoring and feedback details."
                : "Once analysis finishes, your most recent result appears here for review."}
            </p>
          </div>
        </section>

        <section className="grid items-start gap-6 xl:grid-cols-[1.45fr_0.95fr]">
          <ResumeUploadCard
            file={file}
            loading={isUploading}
            jobDescription={jobDescription}
            onJobDescriptionChange={setJobDescription}
            onFileChange={setFile}
            onSubmit={handleUpload}
            clearFile={clearSelectedFile}
            analyzeWithAI={analyzeWithAI}
            onAnalyzeWithAIChange={setAnalyzeWithAI}
            compareToResumeId={compareToResumeId}
            onCompareToResumeIdChange={setCompareToResumeId}
            history={history}
          />

          <ResumeHistoryCard
            history={history}
            historyLoading={historyLoading}
            actionLoading={isOpeningHistory}
            activeResumeId={resumeId}
            onOpenResume={loadResumeFromHistory}
          />
        </section>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {result && (
          <>
            <AnalysisSummaryCard
              finalScore={result.finalScore}
              resumeScore={result.resumeScore}
              skillsCount={result.skills.length}
              sectionsCount={detectedSections.length}
              quantifiedBullets={result.quantification.quantified_bullets}
              hasJDMatch={!!result.jdMatch}
              strength={strength}
            />

            <StatsGrid
              wordCount={result.wordCount}
              charCount={result.charCount}
              skillsCount={result.skills.length}
              sectionsCount={detectedSections.length}
            />

            {(result.jdMatch || result.aiInsights?.overallSummary) && (
              <div className="grid gap-6 lg:grid-cols-2">
                {result.jdMatch && (
                  <JDMatchCard
                    matchPercentage={result.jdMatch.matchPercentage}
                    matchedKeywords={result.jdMatch.matchedKeywords}
                    missingKeywords={result.jdMatch.missingKeywords}
                  />
                )}

                <AISummaryCard
                  summary={result.aiInsights?.overallSummary}
                  confidence={result.aiInsights?.confidence}
                  model={result.costMeta?.model}
                />
              </div>
            )}

            <div className="grid gap-6 lg:grid-cols-2">
              <ResumeScoreCard
                resumeScore={result.resumeScore}
                finalScore={result.finalScore}
                scoreBreakdown={result.scoreBreakdown}
              />

              <QuantificationChartCard
                totalBullets={result.quantification.total_bullets}
                quantifiedBullets={result.quantification.quantified_bullets}
                percentageMentions={result.quantification.percentage_mentions}
                numberMentions={result.quantification.number_mentions}
              />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <FeedbackCard
                title="Strengths"
                description="What your resume is already doing well."
                items={result.feedback.strengths}
                tone="positive"
              />

              <FeedbackCard
                title="Improvements"
                description="Where the resume can be made stronger."
                items={result.feedback.improvements}
                tone="warning"
              />
            </div>

            {hasAIInsights && (
              <section className="space-y-4">
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                    AI Guidance
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Prioritized actions and rewrite suggestions to make the
                    resume more concise and more impact-focused.
                  </p>
                </div>

                <div className="grid gap-6 xl:grid-cols-2">
                  <PriorityActionsCard
                    actions={result.aiInsights?.priorityActions || []}
                  />
                  <RewriteSuggestionsCard
                    rewrites={result.aiInsights?.rewrittenBullets || []}
                  />
                </div>
              </section>
            )}

            <ResumeComparisonCard
              comparison={comparison}
              loading={comparisonLoading}
            />

            <div className="grid gap-6 lg:grid-cols-2">
              <SectionsCard sections={detectedSections} />
              <SkillsCard skills={result.skills} />
            </div>
          </>
        )}
      </div>
    </main>
  );
}
