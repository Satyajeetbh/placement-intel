import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { ResumeHistoryItem } from "@/types/resume";
import {
  CheckCircle2,
  FileText,
  GitCompare,
  Sparkles,
  UploadCloud,
  WandSparkles,
  X,
} from "lucide-react";

type Props = {
  file: File | null;
  loading: boolean;
  jobDescription: string;
  onJobDescriptionChange: (value: string) => void;
  onFileChange: (file: File | null) => void;
  onSubmit: (e: React.FormEvent) => void;
  clearFile: () => void;
  analyzeWithAI: boolean;
  onAnalyzeWithAIChange: (value: boolean) => void;
  compareToResumeId: string;
  onCompareToResumeIdChange: (value: string) => void;
  history?: ResumeHistoryItem[];
};

const MAX_FILE_SIZE_MB = 5;

function formatHistoryLabel(item: ResumeHistoryItem) {
  const date = new Date(
    item.processedAt || item.createdAt,
  ).toLocaleDateString();
  const score =
    typeof item.finalScore === "number" ? ` • Score ${item.finalScore}` : "";
  return `${item.fileName || "Untitled resume"} • ${date}${score}`;
}

export default function ResumeUploadCard({
  file,
  loading,
  jobDescription,
  onJobDescriptionChange,
  onFileChange,
  onSubmit,
  clearFile,
  analyzeWithAI,
  onAnalyzeWithAIChange,
  compareToResumeId,
  onCompareToResumeIdChange,
  history = [],
}: Props) {
  const [dragActive, setDragActive] = useState(false);
  const [fileError, setFileError] = useState("");

  const completedHistory = useMemo(
    () => history.filter((item) => item.processingStatus === "completed"),
    [history],
  );

  const validateFile = (selectedFile: File | null) => {
    if (!selectedFile) return false;

    if (selectedFile.type !== "application/pdf") {
      setFileError("Only PDF files are allowed.");
      return false;
    }

    if (selectedFile.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setFileError(`File size must be under ${MAX_FILE_SIZE_MB} MB.`);
      return false;
    }

    setFileError("");
    return true;
  };

  const handleSelectedFile = (selectedFile: File | null) => {
    if (!selectedFile) return;

    if (!validateFile(selectedFile)) {
      onFileChange(null);
      return;
    }

    onFileChange(selectedFile);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);

    const droppedFile = e.dataTransfer.files?.[0] || null;
    handleSelectedFile(droppedFile);
  };

  const handleClearFile = () => {
    setFileError("");
    clearFile();
  };

  const formatFileSize = (size: number) => {
    if (size < 1024 * 1024) {
      return `${(size / 1024).toFixed(0)} KB`;
    }

    return `${(size / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <Card className="rounded-3xl border-border shadow-sm">
      <CardHeader className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-primary/10 p-3 text-primary">
            <UploadCloud className="h-5 w-5" />
          </div>
          <div>
            <CardTitle>Upload Resume</CardTitle>
            <CardDescription>
              Upload a PDF resume, optionally add a job description, and choose
              whether to include AI guidance.
            </CardDescription>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="rounded-full px-3 py-1">
            PDF only
          </Badge>
          <Badge variant="secondary" className="rounded-full px-3 py-1">
            Max {MAX_FILE_SIZE_MB} MB
          </Badge>
          <Badge variant="outline" className="rounded-full px-3 py-1">
            Best with clear headings
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6">
          <label
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`flex cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed px-6 py-12 text-center transition ${
              dragActive
                ? "border-primary bg-primary/10 shadow-sm"
                : "border-border bg-gradient-to-b from-muted/30 to-background hover:bg-muted/40"
            } ${loading ? "pointer-events-none opacity-70" : ""}`}
          >
            <div className="rounded-full bg-primary/10 p-4 text-primary">
              <UploadCloud className="h-8 w-8" />
            </div>

            <span className="mt-5 text-lg font-semibold text-foreground">
              Drag and drop your resume here
            </span>

            <span className="mt-2 text-sm text-muted-foreground">
              or click to browse from your device
            </span>

            <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
              <span className="rounded-full border border-border bg-background px-3 py-1">
                PDF only
              </span>
              <span className="rounded-full border border-border bg-background px-3 py-1">
                Max {MAX_FILE_SIZE_MB} MB
              </span>
              <span className="rounded-full border border-border bg-background px-3 py-1">
                Async analysis
              </span>
            </div>

            <input
              type="file"
              accept=".pdf"
              className="hidden"
              disabled={loading}
              onChange={(e) =>
                handleSelectedFile(e.target.files ? e.target.files[0] : null)
              }
            />
          </label>

          {fileError && (
            <Alert variant="destructive">
              <AlertDescription>{fileError}</AlertDescription>
            </Alert>
          )}

          {file && (
            <div className="flex items-start justify-between gap-4 rounded-2xl border border-border bg-background px-4 py-4">
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-primary/10 p-2 text-primary">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium text-foreground">
                      {file.name}
                    </p>
                    <Badge variant="secondary" className="rounded-full">
                      Ready to analyze
                    </Badge>
                  </div>
                  <p className="mt-1 break-all text-sm text-muted-foreground">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleClearFile}
                disabled={loading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          <div className="space-y-3">
            <div>
              <label
                htmlFor="jobDescription"
                className="text-sm font-medium text-foreground"
              >
                Target Job Description (optional)
              </label>
              <p className="mt-1 text-xs text-muted-foreground">
                Paste a job description to compare missing keywords and role
                alignment.
              </p>
            </div>

            <textarea
              id="jobDescription"
              value={jobDescription}
              onChange={(e) => onJobDescriptionChange(e.target.value)}
              placeholder="Paste a job description here to unlock role-specific keyword matching and missing-skill insights."
              disabled={loading}
              rows={5}
              className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary"
            />
          </div>

          <div className="space-y-3 rounded-3xl border border-border bg-muted/30 p-4">
            <div className="flex items-center gap-2">
              <GitCompare className="h-4 w-4 text-primary" />
              <p className="text-sm font-medium text-foreground">
                Version Comparison (optional)
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              Choose an earlier completed resume only when this upload is a
              revised version of that same resume. Leave it empty for a
              brand-new resume.
            </p>

            <select
              value={compareToResumeId}
              onChange={(e) => onCompareToResumeIdChange(e.target.value)}
              disabled={loading || completedHistory.length === 0}
              className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="">Do not compare this upload</option>
              {completedHistory.map((item) => (
                <option key={item._id} value={item._id}>
                  {formatHistoryLabel(item)}
                </option>
              ))}
            </select>

            {completedHistory.length === 0 && (
              <p className="text-xs text-muted-foreground">
                Upload and complete at least one resume analysis before using
                version comparison.
              </p>
            )}
          </div>

          <div className="rounded-3xl border border-border bg-muted/30 p-4">
            <div className="flex items-center gap-2">
              <WandSparkles className="h-4 w-4 text-primary" />
              <p className="text-sm font-medium text-foreground">
                Analysis Mode
              </p>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Choose between deterministic scoring only or AI-assisted feedback
              with rewrite suggestions.
            </p>

            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <button
                type="button"
                onClick={() => onAnalyzeWithAIChange(true)}
                disabled={loading}
                className={`rounded-2xl border p-4 text-left transition ${
                  analyzeWithAI
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border bg-background hover:bg-muted/40"
                } ${loading ? "cursor-not-allowed opacity-70" : ""}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-foreground">
                      Analyze with AI
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Includes priority actions, rewritten bullets, and AI
                      summary.
                    </p>
                  </div>
                  {analyzeWithAI ? (
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  ) : (
                    <Sparkles className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              </button>

              <button
                type="button"
                onClick={() => onAnalyzeWithAIChange(false)}
                disabled={loading}
                className={`rounded-2xl border p-4 text-left transition ${
                  !analyzeWithAI
                    ? "border-primary bg-primary/5 shadow-sm"
                    : "border-border bg-background hover:bg-muted/40"
                } ${loading ? "cursor-not-allowed opacity-70" : ""}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-foreground">
                      Analyze without AI
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Faster, deterministic scoring based only on built-in
                      resume signals.
                    </p>
                  </div>
                  {!analyzeWithAI ? (
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  ) : (
                    <FileText className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              type="submit"
              disabled={loading || !file}
              className="sm:w-auto rounded-full px-6"
            >
              {loading ? "Analyzing..." : "Upload Resume"}
            </Button>

            {file && (
              <Button
                type="button"
                variant="outline"
                onClick={handleClearFile}
                disabled={loading}
                className="rounded-full"
              >
                Clear file
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
