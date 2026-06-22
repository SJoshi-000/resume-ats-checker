import { jsPDF } from "jspdf";

/**
 * Generate and download a styled ATS Analysis Report PDF.
 * Includes: Score, Strengths, Matched/Missing Keywords, Critical Keywords,
 * Skill Breakdown, Suggestions, and Recommended Next Steps.
 * @param {object} results — The full analysis results from the API.
 * @param {string} [filename] — Original resume filename for the report header.
 */
export function generateAtsReport(results, filename = "Resume") {
  const { score, matchedKeywords, missingKeywords, suggestions, skillCategories, breakdown } = results;
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  const timestamp = new Date().toLocaleString();
  let y = margin;

  // ── Colors ──
  const colors = {
    primary: [99, 102, 241],     // Indigo
    success: [16, 185, 129],     // Emerald
    danger: [244, 63, 94],       // Rose
    warning: [245, 158, 11],     // Amber
    blue: [59, 130, 246],        // Blue
    dark: [15, 15, 26],          // Dark background
    cardBg: [22, 22, 38],        // Card background
    text: [229, 231, 235],       // Light text
    muted: [156, 163, 175],      // Gray text
    dimmed: [107, 114, 128],     // Dimmer text
    white: [255, 255, 255],
  };

  // ── Helper: check if we need a new page ──
  function checkPage(needed = 20) {
    if (y + needed > pageHeight - 25) {
      doc.addPage();
      y = margin;
      return true;
    }
    return false;
  }

  // ── Helper: draw section header with colored accent bar ──
  function drawSectionHeader(title, color = colors.primary) {
    checkPage(18);
    // Accent bar
    doc.setFillColor(...color);
    doc.roundedRect(margin, y - 1, 3, 9, 1.5, 1.5, "F");

    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...color);
    doc.text(title, margin + 7, y + 5);
    y += 12;

    // Subtle divider line
    doc.setDrawColor(50, 50, 70);
    doc.setLineWidth(0.3);
    doc.line(margin, y, margin + contentWidth, y);
    y += 6;
  }

  // ── Helper: draw keyword chips ──
  function drawKeywordChips(keywords, color) {
    if (keywords.length === 0) {
      doc.setFontSize(9);
      doc.setTextColor(...colors.muted);
      doc.text("None", margin, y);
      y += 6;
      return;
    }

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");

    let x = margin;
    const chipHeight = 6;
    const chipPadding = 3;
    const chipGap = 3;
    const lineHeight = chipHeight + 3;

    for (const kw of keywords) {
      const textWidth = doc.getTextWidth(kw);
      const chipWidth = textWidth + chipPadding * 2;

      // Wrap to next line if needed
      if (x + chipWidth > pageWidth - margin) {
        x = margin;
        y += lineHeight;
        checkPage(lineHeight);
      }

      // Draw chip background
      doc.setFillColor(...color, 30);
      doc.roundedRect(x, y - chipHeight + 1.5, chipWidth, chipHeight, 1.5, 1.5, "F");

      // Draw chip text
      doc.setTextColor(...color);
      doc.text(kw, x + chipPadding, y);

      x += chipWidth + chipGap;
    }

    y += lineHeight;
  }

  // ══════════════════════════════════════════
  // ── HEADER ──
  // ══════════════════════════════════════════
  // Header background with gradient effect
  doc.setFillColor(...colors.dark);
  doc.rect(0, 0, pageWidth, 48, "F");

  // Accent line at bottom of header
  doc.setFillColor(...colors.primary);
  doc.rect(0, 46, pageWidth, 2, "F");

  // Title
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...colors.white);
  doc.text("ATS Analysis Report", margin, 20);

  // Subtitle
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...colors.muted);
  doc.text(`Resume: ${filename}`, margin, 28);
  doc.text(`Generated: ${timestamp}`, margin, 34);

  // Score badge in header
  const scoreColor = score >= 75 ? colors.success : score >= 50 ? colors.warning : colors.danger;
  const scoreLabel = score >= 75 ? "Excellent" : score >= 50 ? "Good" : "Needs Work";

  doc.setFillColor(...scoreColor, 40);
  doc.roundedRect(pageWidth - margin - 32, 14, 32, 22, 4, 4, "F");
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...scoreColor);
  doc.text(`${score}%`, pageWidth - margin - 16, 27, { align: "center" });

  y = 58;

  // ══════════════════════════════════════════
  // ── SUMMARY CALLOUT ──
  // ══════════════════════════════════════════
  doc.setFillColor(...colors.cardBg);
  doc.roundedRect(margin, y, contentWidth, 18, 3, 3, "F");
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...scoreColor);
  doc.text(`Score: ${score}/100 — ${scoreLabel}`, margin + 8, y + 7);
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...colors.muted);
  const summaryText = `${matchedKeywords.length} keywords matched · ${missingKeywords.length} missing · ${matchedKeywords.length + missingKeywords.length} total analyzed`;
  doc.text(summaryText, margin + 8, y + 13);
  y += 24;

  // ══════════════════════════════════════════
  // ── RESUME STRENGTHS ──
  // ══════════════════════════════════════════
  const strengths = deriveStrengthsForPdf(score, matchedKeywords, skillCategories, breakdown);
  if (strengths.length > 0) {
    drawSectionHeader("Resume Strengths", colors.success);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");

    for (const strength of strengths) {
      checkPage(10);
      doc.setTextColor(...colors.success);
      doc.text("●", margin + 2, y);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...colors.text);
      doc.text(strength.title, margin + 8, y);
      y += 4.5;
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...colors.muted);
      const lines = doc.splitTextToSize(strength.description, contentWidth - 10);
      doc.text(lines, margin + 8, y);
      y += lines.length * 4 + 2;
    }
    y += 2;
  }

  // ══════════════════════════════════════════
  // ── MATCHED KEYWORDS ──
  // ══════════════════════════════════════════
  drawSectionHeader(`Matched Keywords (${matchedKeywords.length})`, colors.success);
  drawKeywordChips(matchedKeywords, colors.success);
  y += 2;

  // ══════════════════════════════════════════
  // ── MISSING KEYWORDS ──
  // ══════════════════════════════════════════
  drawSectionHeader(`Missing Keywords (${missingKeywords.length})`, colors.danger);
  drawKeywordChips(missingKeywords, colors.danger);
  y += 2;

  // ══════════════════════════════════════════
  // ── CRITICAL MISSING KEYWORDS ──
  // ══════════════════════════════════════════
  if (breakdown) {
    const critical = [];
    if (breakdown.core?.missing) {
      critical.push(...breakdown.core.missing.map(kw => ({ keyword: kw, tier: "Required" })));
    }
    if (critical.length < 5 && breakdown.secondary?.missing) {
      const remaining = 5 - critical.length;
      critical.push(...breakdown.secondary.missing.slice(0, remaining).map(kw => ({ keyword: kw, tier: "Important" })));
    }
    const top5 = critical.slice(0, 5);

    if (top5.length > 0) {
      drawSectionHeader("Critical Missing Keywords", colors.danger);

      doc.setFontSize(9);
      for (let i = 0; i < top5.length; i++) {
        checkPage(8);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...colors.danger);
        doc.text(`${i + 1}.`, margin + 2, y);
        doc.setTextColor(...colors.text);
        doc.text(top5[i].keyword, margin + 10, y);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...colors.dimmed);
        doc.text(`[${top5[i].tier}]`, margin + 10 + doc.getTextWidth(top5[i].keyword) + 3, y);
        y += 6;
      }
      y += 2;
    }
  }

  // ══════════════════════════════════════════
  // ── SKILL CATEGORY BREAKDOWN ──
  // ══════════════════════════════════════════
  if (skillCategories) {
    drawSectionHeader("Skill Category Breakdown", colors.primary);

    const categoryIcons = {
      Frontend: "▸",
      Backend: "▸",
      Database: "▸",
      DevOps: "▸",
      Tools: "▸",
    };

    for (const [catName, catData] of Object.entries(skillCategories)) {
      if (catData.percentage === -1) continue; // Skip empty categories
      checkPage(25);

      // Category header
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...colors.white);
      doc.text(`${categoryIcons[catName] || "▸"} ${catName}`, margin, y);

      // Percentage
      const pctColor = catData.percentage >= 75 ? colors.success
        : catData.percentage >= 50 ? colors.warning : colors.danger;
      doc.setTextColor(...pctColor);
      doc.text(`${catData.percentage}%`, pageWidth - margin - 15, y);
      y += 5;

      // Progress bar
      const barWidth = contentWidth - 20;
      const barHeight = 3;
      const barX = margin;

      // Background bar
      doc.setFillColor(50, 50, 70);
      doc.roundedRect(barX, y, barWidth, barHeight, 1.5, 1.5, "F");

      // Progress fill
      const fillWidth = Math.max(0, (catData.percentage / 100) * barWidth);
      if (fillWidth > 0) {
        doc.setFillColor(...pctColor);
        doc.roundedRect(barX, y, fillWidth, barHeight, 1.5, 1.5, "F");
      }
      y += 6;

      // Matched skills
      if (catData.matched.length > 0) {
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...colors.success);
        const matchedStr = `✔ ${catData.matched.join(", ")}`;
        const matchedLines = doc.splitTextToSize(matchedStr, contentWidth);
        doc.text(matchedLines, margin + 2, y);
        y += matchedLines.length * 4;
      }

      // Missing skills
      if (catData.missing.length > 0) {
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...colors.danger);
        const missingStr = `✘ ${catData.missing.join(", ")}`;
        const missingLines = doc.splitTextToSize(missingStr, contentWidth);
        doc.text(missingLines, margin + 2, y);
        y += missingLines.length * 4;
      }

      y += 4;
    }
    y += 2;
  }

  // ══════════════════════════════════════════
  // ── SUGGESTIONS ──
  // ══════════════════════════════════════════
  if (suggestions && suggestions.length > 0) {
    drawSectionHeader("Improvement Suggestions", colors.warning);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");

    for (let i = 0; i < suggestions.length; i++) {
      checkPage(12);
      doc.setTextColor(...colors.warning);
      doc.text(`${i + 1}.`, margin, y);
      doc.setTextColor(...colors.text);
      const lines = doc.splitTextToSize(suggestions[i], contentWidth - 10);
      doc.text(lines, margin + 7, y);
      y += lines.length * 4.5 + 2;
    }
    y += 2;
  }

  // ══════════════════════════════════════════
  // ── RECOMMENDED NEXT STEPS ──
  // ══════════════════════════════════════════
  const nextSteps = generateNextStepsForPdf(score, missingKeywords, breakdown, skillCategories);
  if (nextSteps.length > 0) {
    drawSectionHeader("Recommended Next Steps", colors.primary);

    doc.setFontSize(9);

    const priorityColors = {
      critical: colors.danger,
      high: colors.warning,
      medium: colors.blue,
      low: colors.success,
    };

    for (let i = 0; i < nextSteps.length; i++) {
      checkPage(14);
      const step = nextSteps[i];
      const stepColor = priorityColors[step.priority] || colors.muted;

      // Step number
      doc.setFont("helvetica", "bold");
      doc.setTextColor(...stepColor);
      doc.text(`Step ${i + 1}`, margin, y);

      // Priority label
      const priorityLabel = step.priority.charAt(0).toUpperCase() + step.priority.slice(1);
      doc.setFontSize(8);
      doc.text(`[${priorityLabel}]`, margin + 18, y);

      // Title
      doc.setFontSize(9);
      doc.setTextColor(...colors.text);
      doc.text(step.title, margin + 35, y);
      y += 4.5;

      // Description
      doc.setFont("helvetica", "normal");
      doc.setTextColor(...colors.muted);
      const lines = doc.splitTextToSize(step.description, contentWidth - 10);
      doc.text(lines, margin + 7, y);
      y += lines.length * 4 + 3;
    }
  }

  // ══════════════════════════════════════════
  // ── FOOTER ──
  // ══════════════════════════════════════════
  const totalPages = doc.internal.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFontSize(8);
    doc.setTextColor(...colors.muted);
    doc.text(
      `Resume ATS Checker — Page ${p} of ${totalPages}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: "center" }
    );
  }

  // ── Download ──
  const sanitizedFilename = filename.replace(/[^a-zA-Z0-9_\-]/g, "_");
  doc.save(`ATS_Report_${sanitizedFilename}_${Date.now()}.pdf`);
}

// ── PDF-only helpers (mirror component logic but simplified for PDF) ──

function deriveStrengthsForPdf(score, matchedKeywords, skillCategories, breakdown) {
  const strengths = [];

  if (score >= 80) {
    strengths.push({ title: "Excellent ATS Match", description: `Score of ${score}/100 shows strong alignment with this position.` });
  } else if (score >= 65) {
    strengths.push({ title: "Good ATS Compatibility", description: `Score of ${score}/100 demonstrates solid role alignment.` });
  }

  if (skillCategories) {
    const strongCats = Object.entries(skillCategories)
      .filter(([, data]) => data.percentage >= 75 && data.percentage !== -1)
      .sort((a, b) => b[1].percentage - a[1].percentage);

    for (const [catName, catData] of strongCats.slice(0, 3)) {
      strengths.push({
        title: `Strong ${catName} Skills`,
        description: `${catData.percentage}% match — ${catData.matched.slice(0, 3).join(", ")}${catData.matched.length > 3 ? ` +${catData.matched.length - 3} more` : ""}.`,
      });
    }
  }

  if (breakdown?.core) {
    const coreTotal = breakdown.core.matched.length + breakdown.core.missing.length;
    if (coreTotal > 0 && breakdown.core.matched.length > 0) {
      const corePct = Math.round((breakdown.core.matched.length / coreTotal) * 100);
      if (corePct >= 60) {
        strengths.push({
          title: "Core Requirements Covered",
          description: `${breakdown.core.matched.length}/${coreTotal} required skills matched (${corePct}%).`,
        });
      }
    }
  }

  if (matchedKeywords.length >= 8) {
    strengths.push({
      title: "Broad Keyword Coverage",
      description: `${matchedKeywords.length} keywords matched across the job description.`,
    });
  }

  return strengths.slice(0, 5);
}

function generateNextStepsForPdf(score, missingKeywords, breakdown, skillCategories) {
  const steps = [];

  if (breakdown?.core?.missing?.length > 0) {
    const top = breakdown.core.missing.slice(0, 3).join(", ");
    steps.push({
      priority: "critical",
      title: "Add Required Skills",
      description: `Include ${top} — these are explicitly required.`,
    });
  }

  if (skillCategories) {
    const weakCats = Object.entries(skillCategories)
      .filter(([, data]) => data.percentage >= 0 && data.percentage < 50 && data.missing.length > 0)
      .sort((a, b) => a[1].percentage - b[1].percentage);

    if (weakCats.length > 0) {
      const [catName, catData] = weakCats[0];
      steps.push({
        priority: "high",
        title: `Boost ${catName} Section`,
        description: `Only ${catData.percentage}% match. Add: ${catData.missing.slice(0, 3).join(", ")}.`,
      });
    }
  }

  if (breakdown?.secondary?.missing?.length > 0) {
    const top = breakdown.secondary.missing.slice(0, 3).join(", ");
    steps.push({
      priority: "medium",
      title: "Include Supporting Skills",
      description: `Consider adding: ${top}.`,
    });
  }

  if (score < 50) {
    steps.push({
      priority: "high",
      title: "Tailor Your Resume",
      description: "Mirror the exact terminology from the job posting.",
    });
  } else if (score < 75) {
    steps.push({
      priority: "medium",
      title: "Quantify Achievements",
      description: "Add metrics to demonstrate measurable impact.",
    });
  }

  if (score >= 60) {
    steps.push({
      priority: "low",
      title: "Polish & Format",
      description: "Use a clean, ATS-friendly format without tables or images.",
    });
  }

  return steps.slice(0, 5);
}
