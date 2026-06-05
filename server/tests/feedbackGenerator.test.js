const generateFeedback = require("../utils/feedbackGenerator");

describe("feedbackGenerator", () => {
  test("produces evidence-based improvement feedback for weak-impact resumes", () => {
    const result = generateFeedback({
      scoreBreakdown: {
        sectionCompletenessScore: 11,
        technicalSkillScore: 14,
        bulletStructureScore: 8,
        quantifiedImpactScore: 0,
        actionVerbScore: 4,
        lengthScore: 2,
        projectExperienceTechScore: 4,
      },
      quantification: {
        total_bullets: 4,
        quantified_bullets: 0,
        percentage_mentions: 0,
        number_mentions: 0,
      },
      wordCount: 230,
      sections: {
        skills: "JavaScript React Node.js",
        projects: "Project details",
        education: "B.Tech",
        experience: "",
      },
      skills: ["javascript", "react", "node.js"],
      nlpFeatures: {
        actionVerbCoverage: 0.25,
        weakPhraseCount: 2,
        readability: {
          avgWordsPerBullet: 27.5,
          longBulletCount: 2,
        },
      },
      jdMatch: {
        matchPercentage: 42,
        matchedKeywords: ["react", "node.js"],
        missingKeywords: ["docker", "aws", "postgresql"],
      },
    });

    expect(result.improvements.some((item) => item.includes("Only 0 of 4"))).toBe(true);
    expect(result.improvements.some((item) => item.includes("weaker phrasing"))).toBe(true);
    expect(result.improvements.some((item) => item.includes("JD alignment is currently 42%"))).toBe(true);
    expect(result.improvements.length).toBeLessThanOrEqual(6);
  });

  test("surfaces concrete strengths for a strong resume", () => {
    const result = generateFeedback({
      scoreBreakdown: {
        sectionCompletenessScore: 15,
        technicalSkillScore: 22,
        bulletStructureScore: 14,
        quantifiedImpactScore: 16,
        actionVerbScore: 9,
        lengthScore: 5,
        projectExperienceTechScore: 8,
      },
      quantification: {
        total_bullets: 5,
        quantified_bullets: 3,
        percentage_mentions: 2,
        number_mentions: 3,
      },
      wordCount: 480,
      sections: {
        skills: "JavaScript React Node.js Docker",
        projects: "Project details",
        education: "B.Tech",
        experience: "Internship details",
      },
      skills: ["javascript", "react", "node.js", "docker", "mongodb"],
      nlpFeatures: {
        actionVerbCoverage: 0.8,
        weakPhraseCount: 0,
        readability: {
          avgWordsPerBullet: 16.4,
          longBulletCount: 0,
        },
      },
      jdMatch: {
        matchPercentage: 76,
        matchedKeywords: ["react", "node.js", "docker"],
        missingKeywords: ["aws"],
      },
    });

    expect(result.strengths.some((item) => item.includes("Core resume sections"))).toBe(true);
    expect(result.strengths.some((item) => item.includes("3 of 5 bullets"))).toBe(true);
    expect(result.strengths.some((item) => item.includes("76%"))).toBe(true);
    expect(result.strengths.length).toBeLessThanOrEqual(5);
  });
});
