const CORE_SKILLS = new Set([
  "javascript",
  "typescript",
  "python",
  "java",
  "c++",
  "react",
  "next.js",
  "node.js",
  "express.js",
  "mongodb",
  "mysql",
  "postgresql",
  "docker",
  "aws",
  "kubernetes",
  "redis",
  "spring boot",
  "django",
  "graphql",
]);

const TOOLING_SKILLS = new Set([
  "git",
  "github",
  "gitlab",
  "linux",
  "postman",
  "prisma",
  "jest",
  "webpack",
  "vite",
  "firebase",
  "chart.js",
  "ci/cd",
  "azure",
  "gcp",
  "socket.io",
  "stripe",
]);

const SUPPORTING_SKILLS = new Set([
  "html",
  "css",
  "tailwind css",
  "redux",
  "figma",
  "responsive design",
  "mvc architecture",
  "rest api",
  "authentication",
  "better auth",
  "inngest",
  "shadcn ui",
  "jetpack compose",
  "jetpack components",
  "kotlin",
]);

const STRONG_VERBS = new Set([
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
]);

const WEAK_PHRASES = [
  "responsible for",
  "worked on",
  "helped with",
  "involved in",
];

const TECH_SIGNAL_TERMS = [
  "api",
  "apis",
  "backend",
  "frontend",
  "database",
  "authentication",
  "docker",
  "cloud",
  "deploy",
  "deployed",
  "performance",
  "responsive",
  "scalable",
  "real-time",
  "realtime",
  "workflow",
  "automation",
  "chart",
  "integration",
];

function getBullets(textToAnalyze = "") {
  return (textToAnalyze || "")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => /^(\u2022|•|\*|-|\d+\.)/.test(line));
}

function calculateResumeScore({
  total_bullets,
  quantified_bullets,
  skills,
  wordCount,
  textToAnalyze,
  sections = {},
}) {
  const normalizedSkills = Array.isArray(skills)
    ? [...new Set(skills.map((skill) => skill.toLowerCase()))]
    : [];

  const requiredSectionKeys = ["skills", "projects", "education"];
  const optionalSectionKeys = ["experience"];

  let sectionCompletenessScore = 0;

  requiredSectionKeys.forEach((key) => {
    if (sections[key] && sections[key].trim()) {
      sectionCompletenessScore += 4;
    }
  });

  optionalSectionKeys.forEach((key) => {
    if (sections[key] && sections[key].trim()) {
      sectionCompletenessScore += 3;
    }
  });

  if (sections.certifications && sections.certifications.trim()) {
    sectionCompletenessScore += 1;
  }

  if (sections.training && sections.training.trim()) {
    sectionCompletenessScore += 1;
  }

  sectionCompletenessScore = Math.min(sectionCompletenessScore, 15);

  let weightedSkillPoints = 0;

  normalizedSkills.forEach((skill) => {
    if (CORE_SKILLS.has(skill)) {
      weightedSkillPoints += 3;
    } else if (TOOLING_SKILLS.has(skill)) {
      weightedSkillPoints += 2;
    } else if (SUPPORTING_SKILLS.has(skill)) {
      weightedSkillPoints += 1;
    }
  });

  const technicalSkillScore = Math.min(weightedSkillPoints, 25);

  const bullets = getBullets(textToAnalyze);
  const cleanedBullets = bullets.map((bullet) =>
    bullet.replace(/^(\u2022|•|\*|-|\d+\.)/, "").trim(),
  );

  const avgWordsPerBullet =
    cleanedBullets.length > 0
      ? cleanedBullets.reduce(
          (sum, bullet) => sum + bullet.split(/\s+/).filter(Boolean).length,
          0,
        ) / cleanedBullets.length
      : 0;

  const weakPhraseCount = cleanedBullets.filter((bullet) => {
    const lowerBullet = bullet.toLowerCase();
    return WEAK_PHRASES.some((phrase) => lowerBullet.includes(phrase));
  }).length;

  let bulletStructureScore = 0;
  if (total_bullets >= 5) bulletStructureScore = 15;
  else if (total_bullets >= 4) bulletStructureScore = 13;
  else if (total_bullets >= 2) bulletStructureScore = 8;
  else if (total_bullets === 1) bulletStructureScore = 4;
  else bulletStructureScore = 0;

  if (avgWordsPerBullet > 26) bulletStructureScore -= 2;
  if (weakPhraseCount >= 2) bulletStructureScore -= 1;
  bulletStructureScore = Math.max(0, Math.min(15, bulletStructureScore));

  const quantRatio = total_bullets > 0 ? quantified_bullets / total_bullets : 0;

  let quantifiedImpactScore = 0;
  if (quantified_bullets >= 3 && quantRatio >= 0.5) quantifiedImpactScore = 20;
  else if (quantified_bullets >= 2 && quantRatio >= 0.35)
    quantifiedImpactScore = 16;
  else if (quantified_bullets >= 1 && quantRatio >= 0.2)
    quantifiedImpactScore = 11;
  else if (quantified_bullets >= 1) quantifiedImpactScore = 6;
  else quantifiedImpactScore = 0;

  let strongVerbCount = 0;
  let techSignalCount = 0;

  cleanedBullets.forEach((cleanedBullet) => {
    const firstWord = cleanedBullet.split(/\s+/)[0]?.toLowerCase();

    if (STRONG_VERBS.has(firstWord)) {
      strongVerbCount += 1;
    }

    const lowerBullet = cleanedBullet.toLowerCase();

    const hasTechSignal =
      normalizedSkills.some((skill) => lowerBullet.includes(skill)) ||
      TECH_SIGNAL_TERMS.some((term) => lowerBullet.includes(term));

    if (hasTechSignal) {
      techSignalCount += 1;
    }
  });

  const actionVerbRatio =
    cleanedBullets.length > 0 ? strongVerbCount / cleanedBullets.length : 0;

  let actionVerbScore = 0;
  if (actionVerbRatio >= 0.7) actionVerbScore = 10;
  else if (actionVerbRatio >= 0.45) actionVerbScore = 8;
  else if (actionVerbRatio >= 0.2) actionVerbScore = 5;
  else if (actionVerbRatio > 0) actionVerbScore = 3;
  else actionVerbScore = 1;

  if (weakPhraseCount >= 2) {
    actionVerbScore = Math.max(0, actionVerbScore - 1);
  }

  const techSignalRatio =
    cleanedBullets.length > 0 ? techSignalCount / cleanedBullets.length : 0;

  let projectExperienceTechScore = 0;
  if (techSignalRatio >= 0.8) projectExperienceTechScore = 10;
  else if (techSignalRatio >= 0.5) projectExperienceTechScore = 7;
  else if (techSignalRatio >= 0.25) projectExperienceTechScore = 4;
  else projectExperienceTechScore = 1;

  let lengthScore = 0;
  if (wordCount >= 380 && wordCount <= 650) lengthScore = 5;
  else if (wordCount >= 280 && wordCount < 380) lengthScore = 4;
  else if (wordCount > 650 && wordCount <= 820) lengthScore = 3;
  else if (wordCount >= 220 && wordCount < 280) lengthScore = 2;
  else lengthScore = 1;

  const totalScore =
    sectionCompletenessScore +
    technicalSkillScore +
    bulletStructureScore +
    quantifiedImpactScore +
    actionVerbScore +
    lengthScore +
    projectExperienceTechScore;

  return {
    totalScore,
    breakdown: {
      sectionCompletenessScore,
      technicalSkillScore,
      bulletStructureScore,
      quantifiedImpactScore,
      actionVerbScore,
      lengthScore,
      projectExperienceTechScore,
    },
  };
}

module.exports = calculateResumeScore;
