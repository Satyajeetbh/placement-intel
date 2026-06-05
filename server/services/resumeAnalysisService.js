const pdfParse = require("pdf-parse");
const Resume = require("../models/Resume");
const cleanResumeText = require("../utils/cleanResumeText");
const parseSections = require("../utils/sectionParser");
const extractSkills = require("../utils/skillExtractor");
const detectQuantification = require("../utils/quantificationDetector");
const calculateResumeScore = require("../utils/resumeScorer");
const generateFeedback = require("../utils/feedbackGenerator");
const matchResumeToJD = require("../utils/jdMatcher");
const normalizeSkills = require("../utils/skillNormalizer");
const { generateAiInsights } = require("./aiEnrichmentService");

function extractBullets(text = "") {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => /^(\u2022|•|\*|-|\d+\.)/.test(line))
    .map((line) => line.replace(/^(\u2022|•|\*|-|\d+\.)/, "").trim())
    .filter(Boolean);
}

function computeNlpFeatures(textToAnalyze) {
  const bullets = extractBullets(textToAnalyze);

  const weakPhrases = [
    "responsible for",
    "worked on",
    "helped with",
    "involved in",
  ];
  const actionVerbs = [
    "built",
    "developed",
    "implemented",
    "optimized",
    "improved",
    "reduced",
    "designed",
    "led",
    "created",
    "engineered",
    "integrated",
    "automated",
    "deployed",
    "scaled",
    "launched",
  ];

  let weakPhraseCount = 0;
  let actionVerbHits = 0;
  let longBulletCount = 0;
  let measurableImpactMentions = 0;

  const bulletQuality = bullets.map((bullet) => {
    const lower = bullet.toLowerCase();
    const issues = [];

    const hasWeakPhrase = weakPhrases.some((p) => lower.includes(p));
    if (hasWeakPhrase) {
      weakPhraseCount += 1;
      issues.push("Uses weak ownership language.");
    }

    const firstWord = lower.split(/\s+/)[0] || "";
    if (actionVerbs.includes(firstWord)) {
      actionVerbHits += 1;
    } else {
      issues.push("Does not start with a strong action verb.");
    }

    const hasMetric =
      /(\d+%|\d+\s?(ms|sec|seconds|mins|minutes|x|k|m|b|users|requests|rps))/i.test(
        bullet,
      );
    if (hasMetric) {
      measurableImpactMentions += 1;
    } else {
      issues.push("Missing measurable impact signal.");
    }

    const words = bullet.split(/\s+/).filter(Boolean).length;
    if (words > 28) {
      longBulletCount += 1;
      issues.push("Bullet is too long; consider splitting.");
    }

    let score = 100;
    score -= issues.length * 20;
    score = Math.max(0, score);

    return { bullet, issues, score };
  });

  const totalWords = bullets.reduce(
    (sum, b) => sum + b.split(/\s+/).filter(Boolean).length,
    0,
  );
  const avgWordsPerBullet =
    bullets.length > 0 ? totalWords / bullets.length : 0;
  const actionVerbCoverage =
    bullets.length > 0 ? actionVerbHits / bullets.length : 0;

  return {
    actionVerbCoverage: Number(actionVerbCoverage.toFixed(2)),
    weakPhraseCount,
    measurableImpactMentions,
    readability: {
      avgWordsPerBullet: Number(avgWordsPerBullet.toFixed(2)),
      longBulletCount,
    },
    bulletQuality,
  };
}

async function processResumeAnalysis({
  resumeId,
  fileBuffer,
  originalName,
  userId,
  jobDescription,
  analyzeWithAI = false,
}) {
  const data = await pdfParse(fileBuffer);

  const text = cleanResumeText(data.text || "");
  const sections = parseSections(text);
  const sectionOrder = sections._sectionOrder || [];
  delete sections._sectionOrder;

  const skillSourceText = [
    sections.skills || "",
    sections.projects || "",
    sections.experience || "",
    sections.training || "",
    sections.certifications || "",
  ].join("\n");

  let skills = extractSkills(skillSourceText);
  skills = normalizeSkills(skills);

  const textToAnalyze =
    (sections.experience || "") + "\n" + (sections.projects || "");

  const quantification = detectQuantification(textToAnalyze);

  const nlpFeatures = computeNlpFeatures(textToAnalyze);

  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const charCount = text.length;

  const scoreData = calculateResumeScore({
    total_bullets: quantification.total_bullets,
    quantified_bullets: quantification.quantified_bullets,
    skills,
    wordCount,
    textToAnalyze,
    sections,
  });

  let jdMatch = null;
  if (jobDescription && jobDescription.trim()) {
    jdMatch = matchResumeToJD(skills, jobDescription);
  }

  let ruleScore = scoreData.totalScore;
  if (jdMatch) {
    ruleScore = Math.round(
      scoreData.totalScore * 0.7 + jdMatch.matchPercentage * 0.3,
    );
  }

  let aiInsights = {
    overallSummary: "",
    sectionFeedback: {
      skills: [],
      projects: [],
      experience: [],
      education: [],
      certifications: [],
      training: [],
    },
    priorityActions: [],
    rewrittenBullets: [],
    confidence: 0,
  };

  let aiScore = 0;
  let costMeta = {
    model: "ai-disabled",
    promptTokens: 0,
    completionTokens: 0,
    latencyMs: 0,
  };

  if (analyzeWithAI) {
    const aiResult = await generateAiInsights({
      sections,
      skills,
      scoreData,
      quantification,
      jobDescription,
    });

    aiInsights = aiResult.aiInsights;
    aiScore = aiResult.aiScore;
    costMeta = aiResult.costMeta;
  }

  const finalCompositeScore = analyzeWithAI
    ? Math.round(ruleScore * 0.7 + aiScore * 0.3)
    : ruleScore;

  const feedback = generateFeedback({
    scoreBreakdown: scoreData.breakdown,
    quantification,
    wordCount,
    sections,
    skills,
    nlpFeatures,
    jdMatch,
  });

  const updatedResume = await Resume.findByIdAndUpdate(
    resumeId,
    {
      user: userId,
      analysisVersion: "2.1-hybrid-evidence-feedback",

      fileName: originalName,
      extractedText: text,
      wordCount,
      charCount,

      sections,
      sectionOrder,
      skills,
      quantification,
      nlpFeatures,

      resumeScore: scoreData.totalScore,
      scoreBreakdown: scoreData.breakdown,

      feedback,
      analyzeWithAI,
      aiInsights,
      jdMatch,

      evaluation: {
        ruleScore,
        aiScore,
        finalCompositeScore,
      },
      costMeta,

      finalScore: finalCompositeScore,

      processingStatus: "completed",
      errorMessage: null,
      processedAt: new Date(),
    },
    { returnDocument: "after" },
  );

  if (!updatedResume) {
    throw new Error("Resume record not found while updating analysis result");
  }

  return updatedResume;
}

module.exports = {
  processResumeAnalysis,
};
