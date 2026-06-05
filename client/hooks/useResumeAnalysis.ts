"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ResumeComparison,
  ResumeHistoryItem,
  ResumeResult,
} from "@/types/resume";

type AuthUser = {
  _id: string;
  name: string;
  email: string;
  token: string;
};

type UploadResponse = {
  message: string;
  resumeId: string;
  jobId: string;
  processingStatus: "queued" | "processing" | "completed" | "failed";
  previousResumeId?: string | null;
};

type ResumeStatusResponse = {
  processingStatus: "queued" | "processing" | "completed" | "failed";
  errorMessage?: string;
};

type ProcessingStatus =
  | "idle"
  | "uploading"
  | "queued"
  | "processing"
  | "completed"
  | "failed";

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}

export function useResumeAnalysis(user: AuthUser | null) {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<ResumeResult | null>(null);
  const [error, setError] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isOpeningHistory, setIsOpeningHistory] = useState(false);
  const [resumeId, setResumeId] = useState("");
  const [processingStatus, setProcessingStatus] =
    useState<ProcessingStatus>("idle");
  const [compareToResumeId, setCompareToResumeId] = useState("");

  const [history, setHistory] = useState<ResumeHistoryItem[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [comparison, setComparison] = useState<ResumeComparison | null>(null);
  const [comparisonLoading, setComparisonLoading] = useState(false);
  const [analyzeWithAI, setAnalyzeWithAI] = useState(
    String(
      process.env.NEXT_PUBLIC_AI_DEFAULT_ENABLED || "false",
    ).toLowerCase() === "true",
  );

  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  const clearPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
  }, []);

  const fetchResumeHistory = useCallback(async () => {
    if (!user) return;

    setHistoryLoading(true);

    try {
      const res = await fetch(`${apiUrl}/api/resume`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const data = (await res.json()) as
        | { message?: string }
        | ResumeHistoryItem[];

      if (!res.ok) {
        throw new Error(
          (data as { message?: string }).message ||
            "Failed to fetch resume history",
        );
      }

      setHistory(data as ResumeHistoryItem[]);
    } catch (error: unknown) {
      setError(getErrorMessage(error, "Failed to load resume history"));
    } finally {
      setHistoryLoading(false);
    }
  }, [apiUrl, user]);

  const fetchResumeComparison = useCallback(
    async (currentId: string, previousId: string) => {
      if (!user) return;

      setComparisonLoading(true);
      try {
        const res = await fetch(
          `${apiUrl}/api/resume/${currentId}/compare/${previousId}`,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          },
        );

        const data = (await res.json()) as
          | { message?: string }
          | ResumeComparison;

        if (!res.ok) {
          throw new Error(
            (data as { message?: string }).message ||
              "Failed to fetch comparison",
          );
        }

        setComparison(data as ResumeComparison);
      } catch (error: unknown) {
        setError(getErrorMessage(error, "Failed to load comparison"));
        setComparison(null);
      } finally {
        setComparisonLoading(false);
      }
    },
    [apiUrl, user],
  );

  const fetchResumeResult = useCallback(
    async (id: string) => {
      if (!user) return;

      const res = await fetch(`${apiUrl}/api/resume/${id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const data = (await res.json()) as { message?: string } | ResumeResult;

      if (!res.ok) {
        throw new Error(
          (data as { message?: string }).message ||
            "Failed to fetch resume result",
        );
      }

      const resumeData = data as ResumeResult;

      setResumeId(id);
      setResult(resumeData);
      setComparison(null);
      if (resumeData.previousResumeId) {
        await fetchResumeComparison(id, resumeData.previousResumeId);
      }
      setProcessingStatus(resumeData.processingStatus || "completed");
    },
    [apiUrl, fetchResumeComparison, user],
  );

  const pollResumeStatus = useCallback(
    (id: string) => {
      clearPolling();

      pollingRef.current = setInterval(async () => {
        try {
          if (!user) {
            clearPolling();
            return;
          }

          const res = await fetch(`${apiUrl}/api/resume/${id}/status`, {
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          });

          const data = (await res.json()) as
            | { message?: string }
            | ResumeStatusResponse;

          if (!res.ok) {
            throw new Error(
              (data as { message?: string }).message ||
                "Failed to fetch status",
            );
          }

          const statusData = data as ResumeStatusResponse;
          setProcessingStatus(statusData.processingStatus);

          if (statusData.processingStatus === "completed") {
            clearPolling();
            await fetchResumeResult(id);
            await fetchResumeHistory();
          }

          if (statusData.processingStatus === "failed") {
            clearPolling();
            setError(statusData.errorMessage || "Resume processing failed");
            setProcessingStatus("failed");
            await fetchResumeHistory();
          }
        } catch (error: unknown) {
          clearPolling();
          setError(getErrorMessage(error, "Status polling failed"));
          setProcessingStatus("failed");
        }
      }, 2500);
    },
    [apiUrl, clearPolling, fetchResumeHistory, fetchResumeResult, user],
  );

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file || !user) {
      setError("Please select a resume file");
      return;
    }

    setError("");
    setIsUploading(true);
    setComparison(null);
    setResult(null);
    setResumeId("");
    setProcessingStatus("uploading");

    try {
      const formData = new FormData();
      formData.append("analyzeWithAI", String(analyzeWithAI));
      formData.append("resume", file);
      if (jobDescription.trim()) {
        formData.append("jobDescription", jobDescription.trim());
      }
      if (compareToResumeId) {
        formData.append("compareToResumeId", compareToResumeId);
      }

      const res = await fetch(`${apiUrl}/api/resume/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: formData,
      });

      const data = (await res.json()) as UploadResponse;

      if (!res.ok) {
        throw new Error(data.message || "Upload failed");
      }

      setResumeId(data.resumeId);
      setProcessingStatus(data.processingStatus);
      setCompareToResumeId("");
      await fetchResumeHistory();
      pollResumeStatus(data.resumeId);
    } catch (error: unknown) {
      setError(getErrorMessage(error, "Something went wrong"));
      setProcessingStatus("failed");
    } finally {
      setIsUploading(false);
    }
  };

  const loadResumeFromHistory = async (id: string) => {
    if (!user) return;

    try {
      setError("");
      setIsOpeningHistory(true);
      await fetchResumeResult(id);
    } catch (error: unknown) {
      setError(getErrorMessage(error, "Failed to open resume result"));
    } finally {
      setIsOpeningHistory(false);
    }
  };

  const clearSelectedFile = () => {
    setFile(null);
    setJobDescription("");
    setCompareToResumeId("");
  };

  useEffect(() => {
    return () => {
      clearPolling();
    };
  }, [clearPolling]);

  useEffect(() => {
    if (user) {
      fetchResumeHistory();
    }
  }, [fetchResumeHistory, user]);

  return {
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
    fetchResumeHistory,
    comparison,
    comparisonLoading,
    analyzeWithAI,
    setAnalyzeWithAI,
    compareToResumeId,
    setCompareToResumeId,
  };
}
