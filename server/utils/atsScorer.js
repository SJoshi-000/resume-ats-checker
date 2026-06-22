// ── Common English stopwords to filter out during keyword extraction ──
const STOPWORDS = new Set([
  "a","an","the","and","or","but","is","are","was","were","be","been","being",
  "have","has","had","do","does","did","will","would","shall","should","may",
  "might","must","can","could","about","above","after","again","against","all",
  "am","any","as","at","because","before","below","between","both","by","during",
  "each","few","for","from","further","get","got","he","her","here","hers",
  "herself","him","himself","his","how","i","if","in","into","it","its","itself",
  "just","know","let","like","make","me","more","most","my","myself","no","nor",
  "not","now","of","off","on","once","only","other","our","ours","ourselves",
  "out","over","own","per","same","she","so","some","such","than","that","their",
  "theirs","them","themselves","then","there","these","they","this","those",
  "through","to","too","under","until","up","us","very","we","well","what",
  "when","where","which","while","who","whom","why","with","work","working",
  "works","worked","you","your","yours","yourself","yourselves",
  "also","able","across","already","always","among","another","around",
  "become","began","come","every","everything","experience","good","great",
  "help","high","include","including","job","join","looking","much","need",
  "new","one","part","provide","role","seek","seeking","strong","take","team",
  "time","two","use","using","used","want","way","year","years","etc","eg",
  "ie","via","within","without","along","apply","based","best","company",
  "day","ensure","environment","excellent","ideal","minimum","opportunity",
  "plus","preferred","required","requirements","responsibilities","responsible",
  "skills","ability","knowledge","understanding","proficiency","proficient",
  "familiar","familiarity","candidate","position","qualification","qualifications",
]);

// ── Multi-word tech terms to preserve as single keywords ──
const MULTI_WORD_TERMS = [
  "machine learning","deep learning","artificial intelligence","natural language processing",
  "computer vision","data science","data engineering","data analysis","data analytics",
  "web development","full stack","front end","back end","mobile development",
  "cloud computing","dev ops","devops","ci cd","ci/cd",
  "project management","product management","agile methodology","scrum master",
  "user experience","user interface","ui ux","ux design","ui design",
  "quality assurance","test automation","unit testing","integration testing",
  "version control","source control","code review",
  "rest api","restful api","graphql api",
  "object oriented","design patterns","microservices architecture",
  "amazon web services","google cloud","google cloud platform",
  "microsoft azure","power bi","google analytics",
  "node js","node.js","react js","react.js","next js","next.js","vue js","vue.js",
  "angular js","express js","nest js","spring boot","ruby on rails",
  "type script","typescript","java script","javascript",
  "c++","c#",".net","asp.net",
  "sql server","my sql","mysql","mongo db","mongodb","postgre sql","postgresql",
  "redis cache","elastic search","elasticsearch",
  "apache kafka","rabbit mq","rabbitmq",
  "docker compose","kubernetes cluster",
  "adobe photoshop","adobe illustrator","figma design",
  "social media","content management","search engine optimization","seo",
  "problem solving","critical thinking","communication skills",
  "cross functional","self motivated","detail oriented","results driven",
];

// ── Normalization aliases: map variant forms to a single canonical form ──
const NORMALIZATION_MAP = {
  "apis": "api",
  "restful": "rest",
  "restful api": "rest api",
  "restful apis": "rest api",
  "rest apis": "rest api",
  "node js": "node.js",
  "nodejs": "node.js",
  "react js": "react.js",
  "reactjs": "react.js",
  "vue js": "vue.js",
  "vuejs": "vue.js",
  "next js": "next.js",
  "nextjs": "next.js",
  "express js": "express.js",
  "expressjs": "express.js",
  "angular js": "angular.js",
  "angularjs": "angular.js",
  "nest js": "nest.js",
  "nestjs": "nest.js",
  "type script": "typescript",
  "java script": "javascript",
  "mongo db": "mongodb",
  "postgre sql": "postgresql",
  "my sql": "mysql",
  "elastic search": "elasticsearch",
  "rabbit mq": "rabbitmq",
  "dev ops": "devops",
  "ci cd": "ci/cd",
  "amazon web services": "aws",
  "google cloud platform": "google cloud",
  "microsoft azure": "azure",
  "redis cache": "redis",
  // Plural → singular normalization
  "services": "service",
  "systems": "system",
  "applications": "application",
  "technologies": "technology",
  "methodologies": "methodology",
  "frameworks": "framework",
  "pipelines": "pipeline",
  "patterns": "pattern",
  "databases": "database",
  "containers": "container",
  "clusters": "cluster",
  "deployments": "deployment",
  "environments": "environment",
  "architectures": "architecture",
  "microservices": "microservice",
  "solutions": "solution",
  "integrations": "integration",
  "interfaces": "interface",
  "endpoints": "endpoint",
  "repositories": "repository",
  "libraries": "library",
  "modules": "module",
  "components": "component",
  "features": "feature",
  "functions": "function",
  "scripts": "script",
  "tests": "test",
  "tools": "tool",
  "servers": "server",
  "clients": "client",
};

// ── Context words used to classify keyword importance ──
const CORE_INDICATORS = [
  "required","must have","must-have","essential","mandatory","need","critical",
  "key requirement","strong experience","proven experience","deep experience",
  "expert","hands-on experience","solid experience","extensive experience",
  "core","fundamental",
];
const BONUS_INDICATORS = [
  "preferred","nice to have","nice-to-have","bonus","a plus","is a plus",
  "desired","optional","ideally","advantage","beneficial","good to have",
  "exposure to","familiarity with","awareness of",
];

// ── Skill category classification ──
const SKILL_CATEGORIES = {
  Frontend: new Set([
    "react", "react.js", "vue", "vue.js", "angular", "angular.js", "svelte",
    "next.js", "nuxt", "gatsby", "html", "css", "sass", "scss", "less",
    "tailwind", "tailwindcss", "bootstrap", "material ui", "mui", "chakra",
    "styled-components", "javascript", "typescript", "jquery", "webpack",
    "vite", "babel", "eslint", "prettier", "storybook", "framer motion",
    "redux", "zustand", "mobx", "context api", "responsive design",
    "web development", "front end", "full stack", "ui ux", "ux design",
    "ui design", "user experience", "user interface", "pwa",
    "web components", "shadow dom",
  ]),
  Backend: new Set([
    "node.js", "express", "express.js", "nest.js", "django", "flask",
    "fastapi", "spring boot", "spring", "ruby on rails", "rails",
    "laravel", "php", "java", "python", "go", "golang", "rust", "c#",
    ".net", "asp.net", "kotlin", "scala", "elixir", "phoenix",
    "rest api", "graphql", "graphql api", "grpc", "websocket",
    "microservice", "microservices architecture", "back end", "full stack",
    "authentication", "authorization", "oauth", "jwt",
    "api", "middleware", "server", "serverless", "lambda",
  ]),
  Database: new Set([
    "mongodb", "postgresql", "mysql", "sql", "sql server", "sqlite",
    "redis", "elasticsearch", "dynamodb", "cassandra", "couchdb",
    "firebase", "firestore", "supabase", "neo4j", "mariadb",
    "oracle", "database", "nosql", "data modeling", "orm",
    "prisma", "sequelize", "mongoose", "typeorm", "knex",
    "apache kafka", "rabbitmq", "message queue",
  ]),
  DevOps: new Set([
    "docker", "docker compose", "kubernetes", "kubernetes cluster",
    "aws", "azure", "gcp", "google cloud", "cloud computing",
    "ci/cd", "jenkins", "github actions", "gitlab ci", "circleci",
    "terraform", "ansible", "puppet", "chef", "vagrant",
    "nginx", "apache", "linux", "bash", "shell",
    "monitoring", "grafana", "prometheus", "datadog", "new relic",
    "devops", "sre", "infrastructure", "deployment", "helm",
    "cloudformation", "serverless", "lambda",
  ]),
  Tools: new Set([
    "git", "github", "gitlab", "bitbucket", "version control", "source control",
    "jira", "confluence", "trello", "asana", "notion",
    "figma", "figma design", "adobe photoshop", "adobe illustrator", "sketch",
    "postman", "insomnia", "swagger",
    "vs code", "vim", "intellij",
    "npm", "yarn", "pnpm",
    "agile", "agile methodology", "scrum", "scrum master", "kanban",
    "code review", "unit testing", "integration testing",
    "test automation", "quality assurance", "jest", "mocha", "cypress",
    "selenium", "playwright",
    "power bi", "google analytics", "tableau",
    "seo", "search engine optimization",
  ]),
};

// ── Context relevance: action verbs/phrases that indicate genuine usage ──
const CONTEXT_VERBS = [
  "built","developed","created","designed","implemented","deployed","managed",
  "configured","maintained","optimized","integrated","migrated","automated",
  "architected","refactored","led","delivered","wrote","authored","contributed",
  "used","utilizing","leveraged","worked with","proficient in","experienced in",
  "expertise in","skilled in","knowledge of","familiar with","hands-on",
  "responsible for","contributed to","collaborated on","set up","established",
];

/**
 * Normalize a keyword string to its canonical form.
 * Handles plurals, tech name variants, and casing.
 */
function normalize(keyword) {
  let k = keyword.toLowerCase().trim();

  // Direct alias lookup (check multi-word first, then single)
  if (NORMALIZATION_MAP[k]) {
    k = NORMALIZATION_MAP[k];
  }

  // Generic trailing-s plural removal for words > 3 chars
  // (only if not already in the map and not a known term like "aws", "css")
  if (k.length > 3 && k.endsWith("s") && !k.endsWith("ss") && !NORMALIZATION_MAP[k]) {
    const stripped = k.slice(0, -1);
    if (NORMALIZATION_MAP[stripped]) {
      k = NORMALIZATION_MAP[stripped];
    }
  }

  return k;
}

/**
 * Classify a keyword as 'core', 'secondary', or 'bonus' based on
 * surrounding context in the job description.
 */
function classifyKeyword(keyword, jdLower) {
  const idx = jdLower.indexOf(keyword.toLowerCase());
  if (idx === -1) return "secondary";

  // Look at ~150 chars before the keyword for context
  const contextStart = Math.max(0, idx - 150);
  const context = jdLower.substring(contextStart, idx + keyword.length + 50);

  for (const indicator of BONUS_INDICATORS) {
    if (context.includes(indicator)) return "bonus";
  }
  for (const indicator of CORE_INDICATORS) {
    if (context.includes(indicator)) return "core";
  }

  return "secondary";
}

/**
 * Check if a keyword appears in the resume with meaningful context,
 * not just as a random word. Returns a relevance multiplier (0.0–1.0).
 */
function checkContextRelevance(keyword, resumeLower) {
  const kwLower = keyword.toLowerCase();
  const idx = resumeLower.indexOf(kwLower);
  if (idx === -1) return 0;

  // Short tech terms (≤ 4 chars like "css", "git", "aws") — presence is enough
  if (kwLower.length <= 4) return 1.0;

  // Multi-word terms — presence is strong enough signal
  if (kwLower.includes(" ") || kwLower.includes(".") || kwLower.includes("/")) return 1.0;

  // For single longer words, check for contextual action verbs nearby
  const windowStart = Math.max(0, idx - 120);
  const windowEnd = Math.min(resumeLower.length, idx + kwLower.length + 120);
  const context = resumeLower.substring(windowStart, windowEnd);

  for (const verb of CONTEXT_VERBS) {
    if (context.includes(verb)) return 1.0;
  }

  // Keyword appears but without strong contextual verbs — partial credit
  return 0.7;
}

/**
 * Calculate ATS match score between a resume and job description.
 * Uses weighted scoring: core=3, secondary=2, bonus=1.
 * Deduplicates after normalization. Normalizes keyword variants.
 * Applies context relevance and score ceiling.
 *
 * @param {string} resumeText    — Plain text extracted from the resume.
 * @param {string} jobDescription — The job description text.
 * @returns {{ score, matchedKeywords, missingKeywords, suggestions, breakdown, skillCategories }}
 */
function calculateAtsScore(resumeText, jobDescription) {
  const jdLower = jobDescription.toLowerCase();
  const rawKeywords = extractKeywords(jobDescription);

  // ── Normalize & deduplicate ──
  const seen = new Set();
  const uniqueKeywords = [];
  for (const kw of rawKeywords) {
    const norm = normalize(kw);
    if (!seen.has(norm)) {
      seen.add(norm);
      uniqueKeywords.push({ original: kw, normalized: norm });
    }
  }

  // ── Classify each keyword by weight tier ──
  const WEIGHTS = { core: 3, secondary: 2, bonus: 1 };

  const classified = uniqueKeywords.map(({ original, normalized }) => ({
    original,
    normalized,
    tier: classifyKeyword(original, jdLower),
  }));

  // ── Match against resume (also normalize resume text for matching) ──
  const resumeNormalized = normalizeFullText(resumeText);
  const resumeLower = resumeText.toLowerCase();

  const matchedKeywords = [];
  const missingKeywords = [];
  const breakdown = {
    core:      { matched: [], missing: [], weight: WEIGHTS.core },
    secondary: { matched: [], missing: [], weight: WEIGHTS.secondary },
    bonus:     { matched: [], missing: [], weight: WEIGHTS.bonus },
  };

  // Track context relevance scores for matched keywords
  let contextWeightedEarned = 0;
  let totalPoints = 0;

  for (const { original, normalized, tier } of classified) {
    const w = WEIGHTS[tier];

    // Check both the normalized form and the original form against the resume
    const found =
      resumeNormalized.includes(normalized) ||
      resumeNormalized.includes(original.toLowerCase());

    const displayName = formatKeyword(original);

    if (found) {
      // Apply context relevance check
      const relevance = checkContextRelevance(normalized, resumeLower) ||
                        checkContextRelevance(original, resumeLower);
      matchedKeywords.push(displayName);
      breakdown[tier].matched.push(displayName);
      contextWeightedEarned += w * relevance;
    } else {
      missingKeywords.push(displayName);
      breakdown[tier].missing.push(displayName);
    }

    totalPoints += w;
  }

  // ── Weighted score with context relevance ──
  let rawScore = totalPoints > 0 ? (contextWeightedEarned / totalPoints) * 100 : 0;

  // ── Score ceiling: cap at 95 unless truly perfect (all keywords matched with full context) ──
  const allMatched = missingKeywords.length === 0;
  const perfectContext = contextWeightedEarned === totalPoints;

  if (allMatched && perfectContext) {
    rawScore = 100;
  } else if (rawScore > 95) {
    rawScore = 95;
  }

  const score = Math.round(rawScore);

  // ── Build skill category breakdown ──
  const skillCategories = buildSkillCategories(matchedKeywords, missingKeywords, uniqueKeywords);

  // Generate actionable suggestions
  const suggestions = generateSuggestions(missingKeywords, score, matchedKeywords, breakdown);

  return {
    score,
    matchedKeywords,
    missingKeywords,
    suggestions,
    breakdown,
    skillCategories,
  };
}

/**
 * Build skill category breakdown from matched/missing keywords.
 * Classifies each keyword into Frontend/Backend/Database/DevOps/Tools categories.
 */
function buildSkillCategories(matchedKeywords, missingKeywords, uniqueKeywords) {
  const categories = {};

  for (const categoryName of Object.keys(SKILL_CATEGORIES)) {
    categories[categoryName] = {
      matched: [],
      missing: [],
      percentage: 0,
    };
  }

  // Classify each unique keyword into categories
  for (const { original, normalized } of uniqueKeywords) {
    const displayName = formatKeyword(original);
    const isMatched = matchedKeywords.includes(displayName);

    for (const [categoryName, categorySet] of Object.entries(SKILL_CATEGORIES)) {
      if (categorySet.has(normalized) || categorySet.has(original.toLowerCase())) {
        if (isMatched) {
          // Avoid duplicate entries within a category
          if (!categories[categoryName].matched.includes(displayName)) {
            categories[categoryName].matched.push(displayName);
          }
        } else {
          if (!categories[categoryName].missing.includes(displayName)) {
            categories[categoryName].missing.push(displayName);
          }
        }
        break; // Each keyword belongs to only one category
      }
    }
  }

  // Calculate percentage for each category
  for (const categoryName of Object.keys(categories)) {
    const cat = categories[categoryName];
    const total = cat.matched.length + cat.missing.length;
    cat.percentage = total > 0 ? Math.round((cat.matched.length / total) * 100) : -1;
    // -1 means "no keywords in this category" (will be displayed as N/A)
  }

  return categories;
}

/**
 * Normalize the full resume text for more flexible matching.
 */
function normalizeFullText(text) {
  let t = text.toLowerCase();

  // Apply the same normalization aliases so "REST APIs" in resume matches "REST API" keyword
  for (const [variant, canonical] of Object.entries(NORMALIZATION_MAP)) {
    if (variant.length >= 3) {
      // Use word-boundary-aware replacement for single words
      const escaped = variant.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      t = t.replace(new RegExp(escaped, "g"), canonical);
    }
  }

  return t;
}

/**
 * Extract significant keywords from the job description.
 * Preserves multi-word tech terms, filters stopwords, deduplicates.
 */
function extractKeywords(text) {
  const lower = text.toLowerCase();
  const found = new Set();

  // 1. Extract multi-word terms first
  for (const term of MULTI_WORD_TERMS) {
    const normalized = term.toLowerCase();
    if (lower.includes(normalized)) {
      found.add(normalized);
    }
  }

  // 2. Tokenize remaining single words
  const tokens = lower
    .replace(/[^a-z0-9#+.\-/]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

  for (const token of tokens) {
    const clean = token.replace(/^[.\-]+|[.\-]+$/g, "");
    if (
      clean.length >= 2 &&
      !STOPWORDS.has(clean) &&
      !isOnlyNumbers(clean) &&
      !isAlreadyCoveredByMultiWord(clean, found)
    ) {
      found.add(clean);
    }
  }

  return Array.from(found);
}

/**
 * Check if a single-word token is already part of a matched multi-word term.
 */
function isAlreadyCoveredByMultiWord(token, foundSet) {
  for (const term of foundSet) {
    if (term.includes(" ") && term.split(" ").includes(token)) {
      return true;
    }
  }
  return false;
}

/**
 * Check if a string is only digits.
 */
function isOnlyNumbers(str) {
  return /^\d+$/.test(str);
}

/**
 * Capitalize a single keyword for display.
 */
function formatKeyword(kw) {
  if (kw === kw.toUpperCase() && kw.length <= 5) return kw;
  if (kw.includes(".") || kw.includes("#") || kw.includes("+")) return kw;
  if (kw.includes("/")) return kw;

  return kw
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/**
 * Generate actionable improvement suggestions based on missing keywords, score, and breakdown.
 */
function generateSuggestions(missing, score, matched, breakdown) {
  const suggestions = [];

  // ── Critical: missing core skills ──
  if (breakdown.core.missing.length > 0) {
    const top = breakdown.core.missing.slice(0, 4);
    suggestions.push(
      `High priority — add these required skills: ${top.join(", ")}${breakdown.core.missing.length > 4 ? ` and ${breakdown.core.missing.length - 4} more` : ""}.`
    );
  }

  // ── Secondary missing skills ──
  if (breakdown.secondary.missing.length > 0) {
    const top = breakdown.secondary.missing.slice(0, 4);
    suggestions.push(
      `Add experience or mention of: ${top.join(", ")}${breakdown.secondary.missing.length > 4 ? ` and ${breakdown.secondary.missing.length - 4} more` : ""}.`
    );
  }

  // ── Score-tier suggestions ──
  if (score < 40) {
    suggestions.push(
      "Your resume is significantly misaligned with this job description. Consider tailoring it specifically for this role."
    );
    suggestions.push(
      "Mirror the exact terminology used in the job posting — ATS systems match on specific keywords."
    );
  } else if (score < 60) {
    suggestions.push(
      "Add quantifiable achievements (numbers, percentages, dollar amounts) to strengthen your impact."
    );
    suggestions.push(
      "Ensure your skills section lists technologies explicitly mentioned in the job description."
    );
  } else if (score < 80) {
    suggestions.push(
      "You're close! Review the missing keywords and weave them naturally into your experience bullets."
    );
  }

  // ── General best-practice suggestions ──
  if (missing.some((kw) => ["Docker", "Kubernetes", "Aws", "Azure", "Gcp", "Cloud", "Cloud Computing"].includes(kw))) {
    suggestions.push(
      "Mention cloud or containerization experience — even personal projects or certifications count."
    );
  }

  if (missing.some((kw) => ["ci/cd", "Ci/cd", "Devops", "Jenkins", "Github Actions"].includes(kw))) {
    suggestions.push(
      "Add CI/CD pipeline experience to demonstrate your deployment workflow knowledge."
    );
  }

  if (missing.some((kw) => ["Agile", "Scrum", "Kanban", "Jira", "Agile Methodology"].includes(kw))) {
    suggestions.push(
      "Include Agile/Scrum methodology experience — most modern teams use iterative development."
    );
  }

  if (matched.length > 0 && suggestions.length < 3) {
    suggestions.push(
      "Use action verbs (built, designed, optimized, led, implemented) to describe your accomplishments."
    );
  }

  if (suggestions.length < 3) {
    suggestions.push(
      "Keep your resume to 1–2 pages and use a clean, ATS-friendly format without tables, columns, or images."
    );
  }

  // Cap at 6 suggestions max
  return suggestions.slice(0, 6);
}

module.exports = { calculateAtsScore };
