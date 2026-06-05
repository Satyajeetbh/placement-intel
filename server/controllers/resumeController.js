const Resume = require("../models/Resume");
const { enqueueResumeJob } = require("../services/resumeJobService");

const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const jobDescription = req.body?.jobDescription || "";
    const analyzeWithAI =
      req.body?.analyzeWithAI === undefined
        ? false
        : String(req.body.analyzeWithAI).toLowerCase() === "true";
    const compareToResumeId = req.body?.compareToResumeId
      ? String(req.body.compareToResumeId).trim()
      : null;

    const queuedJob = await enqueueResumeJob({
      userId: req.user.id,
      file: req.file,
      jobDescription,
      analyzeWithAI,
      compareToResumeId,
    });

    return res.status(202).json({
      message: "Resume queued for processing",
      resumeId: queuedJob.resumeId,
      jobId: queuedJob.jobId,
      processingStatus: queuedJob.processingStatus,
      analyzeWithAI: queuedJob.analyzeWithAI,
      previousResumeId: queuedJob.previousResumeId,
    });
  } catch (error) {
    const status = error.statusCode || 500;
    return res.status(status).json({
      message:
        status === 429
          ? error.message
          : status === 400
            ? error.message
            : "Failed to queue resume analysis",
      error: error.message,
    });
  }
};

const getResumeStatus = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user.id,
    }).select("processingStatus errorMessage processedAt finalScore");

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    return res.status(200).json(resume);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch resume status",
      error: error.message,
    });
  }
};

const getResumeResult = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    return res.status(200).json(resume);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch resume result",
      error: error.message,
    });
  }
};

const getResumeHistory = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user.id })
      .select(
        "fileName processingStatus finalScore processedAt createdAt updatedAt previousResumeId analyzeWithAI",
      )
      .sort({ createdAt: -1 });

    return res.status(200).json(resumes);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch resume history",
      error: error.message,
    });
  }
};

const getResumeComparison = async (req, res) => {
  try {
    const { id, previousId } = req.params;

    const [current, previous] = await Promise.all([
      Resume.findOne({ _id: id, user: req.user.id }),
      Resume.findOne({ _id: previousId, user: req.user.id }),
    ]);

    if (!current || !previous) {
      return res.status(404).json({ message: "Resume(s) not found" });
    }

    const currentSkills = new Set(
      (current.skills || []).map((s) => s.toLowerCase()),
    );
    const previousSkills = new Set(
      (previous.skills || []).map((s) => s.toLowerCase()),
    );

    const skillsAdded = [...currentSkills].filter(
      (s) => !previousSkills.has(s),
    );
    const skillsRemoved = [...previousSkills].filter(
      (s) => !currentSkills.has(s),
    );

    const currentQuantified = current.quantification?.quantified_bullets || 0;
    const previousQuantified = previous.quantification?.quantified_bullets || 0;

    const currentTotalBullets = current.quantification?.total_bullets || 0;
    const previousTotalBullets = previous.quantification?.total_bullets || 0;

    const currentRuleScore =
      current.evaluation?.ruleScore ?? current.resumeScore ?? 0;
    const previousRuleScore =
      previous.evaluation?.ruleScore ?? previous.resumeScore ?? 0;

    const currentAiScore = current.evaluation?.aiScore ?? 0;
    const previousAiScore = previous.evaluation?.aiScore ?? 0;

    const currentFinal = current.finalScore ?? 0;
    const previousFinal = previous.finalScore ?? 0;

    return res.status(200).json({
      currentResumeId: current._id,
      previousResumeId: previous._id,
      deltas: {
        finalScore: currentFinal - previousFinal,
        ruleScore: currentRuleScore - previousRuleScore,
        aiScore: currentAiScore - previousAiScore,
        quantifiedBullets: currentQuantified - previousQuantified,
        totalBullets: currentTotalBullets - previousTotalBullets,
      },
      current: {
        finalScore: currentFinal,
        ruleScore: currentRuleScore,
        aiScore: currentAiScore,
        quantifiedBullets: currentQuantified,
        totalBullets: currentTotalBullets,
        skillsCount: (current.skills || []).length,
      },
      previous: {
        finalScore: previousFinal,
        ruleScore: previousRuleScore,
        aiScore: previousAiScore,
        quantifiedBullets: previousQuantified,
        totalBullets: previousTotalBullets,
        skillsCount: (previous.skills || []).length,
      },
      skills: {
        added: skillsAdded,
        removed: skillsRemoved,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to compare resumes",
      error: error.message,
    });
  }
};

module.exports = {
  uploadResume,
  getResumeStatus,
  getResumeResult,
  getResumeHistory,
  getResumeComparison,
};
