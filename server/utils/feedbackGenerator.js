function formatPercent(value) {
  return `${Math.round(value * 100)}%`;
}

function takeTop(items, count) {
  return items.slice(0, count);
}

const generateFeedback = ({
  scoreBreakdown,
  quantification,
  wordCount,
  sections = {},
  skills = [],
  nlpFeatures = {},
  jdMatch = null,
}) => {
  const strengths = [];
  const improvements = [];

  const {
    sectionCompletenessScore,
    technicalSkillScore,
    bulletStructureScore,
    quantifiedImpactScore,
    actionVerbScore,
    lengthScore,
    projectExperienceTechScore,
  } = scoreBreakdown;

  const totalBullets = quantification?.total_bullets || 0;
  const quantifiedBullets = quantification?.quantified_bullets || 0;
  const quantifiedRatio =
    totalBullets > 0 ? quantifiedBullets / totalBullets : 0;
  const actionVerbCoverage = Number(nlpFeatures?.actionVerbCoverage || 0);
  const weakPhraseCount = Number(nlpFeatures?.weakPhraseCount || 0);
  const avgWordsPerBullet = Number(
    nlpFeatures?.readability?.avgWordsPerBullet || 0,
  );
  const longBulletCount = Number(
    nlpFeatures?.readability?.longBulletCount || 0,
  );
  const skillCount = Array.isArray(skills) ? skills.length : 0;

  if (sectionCompletenessScore >= 12) {
    strengths.push(
      "Core resume sections are present, which makes the document easier for recruiters to scan quickly.",
    );
  } else {
    improvements.push(
      "Add or strengthen core sections such as Skills, Projects, Education, and Experience so the resume is easier to evaluate in a short screen.",
    );
  }

  if (technicalSkillScore >= 18) {
    strengths.push(
      `The resume shows solid engineering signal through ${skillCount} detected technical skill${skillCount === 1 ? "" : "s"}, including core tools and frameworks.`,
    );
  } else {
    improvements.push(
      "Increase the technical signal by naming the languages, frameworks, databases, and tooling you actually used in projects or internships.",
    );
  }

  if (jdMatch && typeof jdMatch.matchPercentage === "number") {
    if (jdMatch.matchPercentage >= 70) {
      strengths.push(
        `The resume already aligns well with the target job description at ${jdMatch.matchPercentage}%, which suggests good role relevance.`,
      );
    } else {
      const topMissing = (jdMatch.missingKeywords || []).slice(0, 4);
      if (topMissing.length > 0) {
        improvements.push(
          `JD alignment is currently ${jdMatch.matchPercentage}%. If these terms reflect real experience, consider naturally incorporating missing keywords such as ${topMissing.join(", ")}.`,
        );
      }
    }
  }

  if (bulletStructureScore >= 12) {
    strengths.push(
      "Project and experience content is mostly presented in bullet form, which improves readability during recruiter skim review.",
    );
  } else if (totalBullets === 0) {
    improvements.push(
      "Convert project or experience paragraphs into concise bullets so recruiters can scan technical work and outcomes faster.",
    );
  } else {
    improvements.push(
      `You currently have ${totalBullets} project/experience bullet${totalBullets === 1 ? "" : "s"}. Expanding to 4-6 concise bullets usually gives better coverage of implementation and impact.`,
    );
  }

  if (quantifiedImpactScore >= 15) {
    strengths.push(
      `${quantifiedBullets} of ${totalBullets} bullets already include measurable evidence, which makes achievements more credible.`,
    );
  } else if (totalBullets > 0) {
    improvements.push(
      `Only ${quantifiedBullets} of ${totalBullets} project/experience bullets include measurable outcomes. Add metrics such as latency reduction, scale, users served, throughput, conversion lift, or time saved.`,
    );
  }

  if (actionVerbScore >= 8) {
    strengths.push(
      `Bullet openings use direct ownership language in about ${formatPercent(actionVerbCoverage)}, which helps the resume sound more decisive and execution-focused.`,
    );
  } else if (weakPhraseCount >= 2) {
    improvements.push(
      `More bullets should start with direct action verbs, and ${weakPhraseCount} bullet${weakPhraseCount === 1 ? " still uses" : "s still use"} weaker phrasing such as “worked on” or “responsible for”. Rewrite those bullets to lead with the action, the tech, and the result.`,
    );
  } else {
    improvements.push(
      "Start more bullets with direct action verbs such as Built, Implemented, Optimized, Designed, Deployed, or Automated instead of softer phrasing.",
    );
  }

  if (projectExperienceTechScore >= 7) {
    strengths.push(
      "Project bullets mention implementation details such as frameworks, APIs, databases, deployment, or performance work, which makes the experience feel more concrete.",
    );
  } else {
    improvements.push(
      "Make bullets more technical by naming the architecture, APIs, databases, frameworks, deployment steps, or performance work involved in the implementation.",
    );
  }

  if (lengthScore >= 4) {
    strengths.push(
      `At roughly ${wordCount} words, the resume sits in a practical range for a software engineering profile.`,
    );
  } else if (wordCount < 280) {
    improvements.push(
      `At about ${wordCount} words, the resume feels light. Add more project depth, technical decisions, and outcomes rather than adding generic summary text.`,
    );
  } else {
    improvements.push(
      `At about ${wordCount} words, the resume may be slightly dense. Tighten long bullets and remove repeated wording so the strongest evidence stands out faster.`,
    );
  }

  if (avgWordsPerBullet > 24) {
    improvements.push(
      `Average bullet length is about ${avgWordsPerBullet.toFixed(1)} words. Shorter bullets are usually easier to scan; aim for tighter statements that keep the action, tech, and result.`,
    );
  } else if (totalBullets >= 3 && avgWordsPerBullet > 0) {
    strengths.push(
      `Bullets are reasonably concise at about ${avgWordsPerBullet.toFixed(1)} words on average, which helps readability.`,
    );
  }

  if (longBulletCount >= 2) {
    improvements.push(
      `${longBulletCount} bullet${longBulletCount === 1 ? " is" : "s are"} especially dense. Split long bullets when they mix problem, implementation, and outcome into one sentence.`,
    );
  }

  if (!sections.experience || !sections.experience.trim()) {
    improvements.push(
      "If you have internships, freelance work, leadership roles, or substantial engineering contributions, add an Experience section to strengthen credibility.",
    );
  }

  return {
    strengths: takeTop(strengths, 5),
    improvements: takeTop(improvements, 6),
  };
};

module.exports = generateFeedback;
