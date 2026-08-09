/**
 * Bellwood Networks — Training Budget Effectiveness Analysis
 * Stakeholder deck generator
 *
 * Design system mirrors the Employee Attrition Analysis deck:
 * Montserrat, blue 3C78D8 titles, red eyebrow, 50pt section dividers,
 * "Key Finding / Insight" two-column analysis layout.
 *
 * Run: node deck/build_deck.js
 */
const pptxgen = require("pptxgenjs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const A = (f) => path.join(ROOT, "deck", "assets", f);
const F = (f) => path.join(ROOT, "05_communication", "figures", f);

// ---------- design tokens ----------
const BLUE = "3C78D8";
const RED = "FF0000";
const CRIMSON = "C0392B";
const AMBER = "E67E22";
const GREEN = "1E8449";
const DARK = "1D2A3B";
const GREY = "666666";
const MUTED = "B7B7B7";
const TINT = "EEF3FC";
const TINT2 = "F6F8FB";
const FONT = "Montserrat";

const FOOTER = "Bellwood Networks, Inc.  |  Deleonard Simanjorang  |  2026";

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9"; // 10 x 5.625 in
pres.author = "Deleonard Simanjorang";
pres.title = "Training Budget Effectiveness Analysis — Bellwood Networks";

// ---------- helpers ----------
function logo(s) {
  s.addImage({ path: A("logo_bellwood.png"), x: 7.72, y: 0.16, w: 1.95, h: 0.61 });
}

function title(s, text, sub) {
  s.addText(text, {
    x: 0.5, y: 0.3, w: 7.0, h: 0.45, fontFace: FONT, fontSize: 21,
    bold: true, color: BLUE, valign: "middle", margin: 0,
  });
  if (sub) {
    s.addText(sub, {
      x: 0.5, y: 0.72, w: 7.0, h: 0.26, fontFace: FONT, fontSize: 10.5,
      color: GREY, valign: "middle", margin: 0,
    });
  }
}

function divider(s, line1, line2) {
  s.addText("People Analytics Project", {
    x: 0.5, y: 0.28, w: 5.0, h: 0.3, fontFace: FONT, fontSize: 13, color: RED, margin: 0,
  });
  logo(s);
  s.addText(line2 ? `${line1}\n${line2}` : line1, {
    x: 0.5, y: 1.85, w: 7.4, h: 1.6, fontFace: FONT, fontSize: 40,
    bold: true, color: DARK, valign: "middle", lineSpacingMultiple: 1.05, margin: 0,
  });
  s.addShape(pres.ShapeType.rect, { x: 0.5, y: 3.62, w: 1.5, h: 0.045, fill: { color: BLUE } });
  s.addText(FOOTER, {
    x: 0.5, y: 4.85, w: 7.5, h: 0.3, fontFace: FONT, fontSize: 11, color: GREY, margin: 0,
  });
}

function card(s, x, y, w, h, fill) {
  s.addShape(pres.ShapeType.roundRect, {
    x, y, w, h, rectRadius: 0.06,
    fill: { color: fill || TINT }, line: { color: "DCE6F7", width: 0.75 },
  });
}

/** Card with a bold heading and body text inside. */
function textCard(s, x, y, w, h, head, body, opts) {
  const o = opts || {};
  card(s, x, y, w, h, o.fill);
  s.addText(head, {
    x: x + 0.16, y: y + 0.11, w: w - 0.32, h: 0.26, fontFace: FONT,
    fontSize: o.headSize || 11, bold: true, color: o.headColor || BLUE, margin: 0, valign: "middle",
  });
  s.addText(body, {
    x: x + 0.16, y: y + 0.4, w: w - 0.32, h: h - 0.52, fontFace: FONT,
    fontSize: o.bodySize || 9, color: o.bodyColor || DARK, margin: 0,
    valign: "top", lineSpacingMultiple: 1.16,
  });
}

/** Big statistic block. */
function stat(s, x, y, w, value, label, color) {
  s.addText(value, {
    x, y, w, h: 0.52, fontFace: FONT, fontSize: 26, bold: true,
    color: color || BLUE, margin: 0, valign: "middle",
  });
  s.addText(label, {
    x, y: y + 0.5, w, h: 0.42, fontFace: FONT, fontSize: 8.5,
    color: GREY, margin: 0, valign: "top", lineSpacingMultiple: 1.1,
  });
}

/** Right-hand "Key Finding / Insight" column used on deep-dive slides. */
function findingColumn(s, x, finding, insight) {
  textCard(s, x, 1.28, 4.45, 1.72, "Key Finding", finding, { headSize: 10.5, bodySize: 9 });
  textCard(s, x, 3.14, 4.45, 1.72, "Insight", insight, {
    headSize: 10.5, bodySize: 9, fill: TINT2,
  });
}

// =====================================================================
// 1 — TITLE
// =====================================================================
let s = pres.addSlide();
s.addText("People Analytics Project", {
  x: 0.5, y: 0.28, w: 5, h: 0.3, fontFace: FONT, fontSize: 13, color: RED, margin: 0,
});
logo(s);
s.addText("Training Budget\nEffectiveness Analysis", {
  x: 0.5, y: 1.55, w: 6.6, h: 1.25, fontFace: FONT, fontSize: 30, bold: true,
  color: BLUE, valign: "middle", lineSpacingMultiple: 1.08, margin: 0,
});
s.addShape(pres.ShapeType.rect, { x: 0.5, y: 2.95, w: 1.5, h: 0.045, fill: { color: DARK } });
s.addText(
  "Tracing $1.68M of training spend and testing whether the 80% effectiveness target is reachable",
  { x: 0.5, y: 3.16, w: 6.4, h: 0.6, fontFace: FONT, fontSize: 12, color: GREY, margin: 0 }
);
s.addText(FOOTER, {
  x: 0.5, y: 4.85, w: 7.5, h: 0.3, fontFace: FONT, fontSize: 11, color: GREY, margin: 0,
});
s.addNotes(
  "Bellwood Networks spent $1.68M on training last year. Only half of it produced a completed course. " +
  "This deck traces where the money went and tests whether management's 80% target can actually be reached."
);

// =====================================================================
// 2 — OUR COMPANY
// =====================================================================
s = pres.addSlide();
title(s, "Our Company !");
logo(s);
textCard(s, 0.5, 1.15, 4.35, 1.62, "Who Are We?",
  "Bellwood Networks is a telecommunications infrastructure contractor headquartered in Massachusetts, " +
  "building and maintaining fiber, cable and wireless networks — aerial and underground construction, " +
  "splicing, CATV and wireless site work — for carrier and municipal clients.",
  { bodySize: 8.5 });
textCard(s, 0.5, 2.92, 4.35, 1.95, "Why Training Matters Here",
  "3,000 employees, two-thirds of them in field production roles.\n\n" +
  "Crews work on live utility infrastructure, so certification currency decides whether a crew can " +
  "legally be dispatched. An incomplete course is not a missed development opportunity — " +
  "it is a crew member who cannot be deployed.",
  { bodySize: 8.5, fill: TINT2 });
s.addImage({ path: A("chart_headcount.png"), x: 5.15, y: 1.45, w: 4.35, h: 2.9 });
s.addText("Source: employee master, 3,000 records", {
  x: 5.15, y: 4.42, w: 4.35, h: 0.25, fontFace: FONT, fontSize: 8, color: MUTED, margin: 0,
});

// =====================================================================
// 3 — EXECUTIVE SUMMARY
// =====================================================================
s = pres.addSlide();
title(s, "Executive Summary");
logo(s);
const ex = [
  ["The problem", "Bellwood spent $1,675,886 on 3,000 training sessions in FY22–23. Only 50.6% produced a completed course. Management targets 80% within 6 months."],
  ["What we found first", "43.9% of all training records ($735,145) carry dates that are impossible against the employee's own employment period."],
  ["The real number", "Only $492,343 — 29.4% of the budget — is fully defensible: plausibly recorded and completed."],
  ["What does not explain it", "Five of six tested drivers show no effect. Cost, duration, tenure, department and delivery type are all unrelated to completion."],
  ["The target is unreachable", "Every available lever combined moves effectiveness from 50.6% to 53.4% — closing 3 of the 29.4 points required."],
  ["What we recommend", "Six actions addressing $768,304 (45.8%) of the budget, a replacement KPI set, and a staged target to replace the 80% figure."],
];
ex.forEach((b, i) => {
  const x = 0.5 + (i % 2) * 4.62;
  const y = 1.13 + Math.floor(i / 2) * 1.28;
  textCard(s, x, y, 4.38, 1.15, b[0], b[1], { headSize: 9.5, bodySize: 8, fill: i % 2 ? TINT2 : TINT });
});

// =====================================================================
// 4 — FINANCIAL IMPACT
// =====================================================================
s = pres.addSlide();
title(s, "We cannot account for $735,145", "Why training budget governance is a financial priority");
logo(s);
s.addText(
  "Of the $1,675,886 spent on training last year, 43.9% sits on records whose dates cannot be true — " +
  "sessions booked for employees who had already left, or who had not yet been hired.",
  { x: 0.5, y: 1.14, w: 9.0, h: 0.42, fontFace: FONT, fontSize: 10, color: DARK, margin: 0 }
);
stat(s, 0.5, 1.72, 2.15, "$1.68M", "Total training budget\nFY Aug 2022 – Aug 2023", DARK);
stat(s, 2.75, 1.72, 2.15, "50.6%", "Budget effectiveness\n$847,484 completed", AMBER);
stat(s, 5.0, 1.72, 2.15, "$735,145", "On impossible records\n1,317 of 3,000 sessions", CRIMSON);
stat(s, 7.25, 1.72, 2.25, "29.4%", "Fully defensible spend\nonly $492,343", CRIMSON);

s.addTable(
  [
    [
      { text: "Budget segment", options: { bold: true, color: "FFFFFF", fill: { color: BLUE } } },
      { text: "Amount", options: { bold: true, color: "FFFFFF", fill: { color: BLUE }, align: "right" } },
      { text: "Share", options: { bold: true, color: "FFFFFF", fill: { color: BLUE }, align: "right" } },
    ],
    ["Plausibly recorded and completed", { text: "$492,343", options: { align: "right" } }, { text: "29.4%", options: { align: "right" } }],
    ["Plausibly recorded, not completed", { text: "$448,398", options: { align: "right" } }, { text: "26.8%", options: { align: "right" } }],
    ["Impossible date, recorded as completed", { text: "$355,140", options: { align: "right" } }, { text: "21.2%", options: { align: "right" } }],
    ["Impossible date, not completed", { text: "$380,004", options: { align: "right" } }, { text: "22.7%", options: { align: "right" } }],
  ],
  {
    x: 0.5, y: 2.95, w: 5.6, colW: [3.2, 1.3, 1.1], rowH: 0.3,
    fontFace: FONT, fontSize: 8.5, color: DARK, valign: "middle",
    border: { type: "solid", color: "E3E9F4", pt: 0.5 },
    fill: { color: "FFFFFF" },
  }
);
textCard(s, 6.35, 2.95, 3.15, 1.5, "Two explanations, both serious",
  "If the money genuinely left the company, this is real leakage. If it is a recording error, " +
  "then the $1.68M reported to the board is wrong and every L&D report must be restated.",
  { headSize: 9.5, bodySize: 8, fill: TINT });
s.addText(
  "All figures derived from 3,000 training records joined to the employee master. See Appendix B for source queries.",
  { x: 0.5, y: 4.65, w: 9.0, h: 0.3, fontFace: FONT, fontSize: 7.5, color: MUTED, margin: 0 }
);

// =====================================================================
// 5 — SECTION: ANALYSIS OBJECTIVES
// =====================================================================
divider(pres.addSlide(), "Analysis", "Objectives");

// =====================================================================
// 6 — PROJECT BACKGROUND
// =====================================================================
s = pres.addSlide();
title(s, "What's driving this? — Project Background");
logo(s);
s.addImage({ path: A("chart_trend_small.png"), x: 0.5, y: 1.2, w: 4.5, h: 3.15 });
s.addText("Monthly budget effectiveness, Aug 2022 – Jul 2023", {
  x: 0.5, y: 4.42, w: 4.5, h: 0.25, fontFace: FONT, fontSize: 8, color: MUTED, margin: 0,
});
textCard(s, 5.25, 1.2, 4.25, 1.5, "The situation",
  "Budget effectiveness has sat between 44.3% and 58.9% for twelve straight months. " +
  "The downward drift is not statistically significant (p = 0.087) — this is a stable state, not a decline.",
  { headSize: 10, bodySize: 8.5 });
textCard(s, 5.25, 2.85, 4.25, 1.5, "Why that matters",
  "There is no incident, vendor change or quarter to point at. A problem that has been " +
  "steady for a year cannot be fixed by a one-off remediation — it points to a missing control.",
  { headSize: 10, bodySize: 8.5, fill: TINT2 });

// =====================================================================
// 7 — PROJECT GOALS
// =====================================================================
s = pres.addSlide();
title(s, "Project Goals");
logo(s);
textCard(s, 0.5, 1.12, 4.38, 1.62, "Problem Statement",
  "Bellwood spent $1,675,886 on training with only 50.6% effectiveness. No one can explain where the " +
  "money goes or which levers would move the number, and next year's budget is due for approval.",
  { headSize: 10, bodySize: 8 });
textCard(s, 5.12, 1.12, 4.38, 1.62, "SMART Objective",
  "Identify where the training budget is lost and determine which levers can raise effectiveness " +
  "from 50.6% toward the 80% target within 6 months, measured through a Power BI monitoring dashboard.",
  { headSize: 10, bodySize: 8, fill: TINT2 });
textCard(s, 0.5, 2.9, 4.38, 1.72, "In Scope",
  "3,000 training records (Aug 2022 – Aug 2023) joined to the employee master for status and date validation.\n\n" +
  "Drivers tested: programme, delivery type, tenure, duration, cost, department.",
  { headSize: 10, bodySize: 8, fill: TINT2 });
textCard(s, 5.12, 2.9, 4.38, 1.72, "Out of Scope",
  "Training ROI against job performance — the system records cost and completion only, with no " +
  "before/after measurement.\n\nTools used: PostgreSQL (extraction), Python (preparation, statistical testing), Power BI (monitoring).",
  { headSize: 10, bodySize: 8 });

// =====================================================================
// 8 — METHODOLOGY
// =====================================================================
s = pres.addSlide();
title(s, "Methodology", "Data analytics project lifecycle — from business problem to business impact");
logo(s);
const steps = [
  ["01", "Define", "Business problem, SMART objective, stakeholders", "—"],
  ["02", "Data Discovery", "Identify datasets, map sources, validate reliability", "Python"],
  ["03", "Data Preparation", "Extract, clean, standardise, engineer features", "SQL · Python"],
  ["04", "Analysis", "EDA, anomaly detection, hypothesis testing", "Python · SQL"],
  ["05", "Communication", "Visualisation, storytelling, dashboard", "Power BI"],
  ["06", "Action", "Recommendations, KPI tracking, business impact", "—"],
];
steps.forEach((st, i) => {
  const x = 0.5 + (i % 3) * 3.13;
  const y = 1.28 + Math.floor(i / 3) * 1.78;
  card(s, x, y, 2.93, 1.55, i % 2 ? TINT2 : TINT);
  s.addShape(pres.ShapeType.roundRect, {
    x: x + 0.16, y: y + 0.14, w: 0.44, h: 0.32, rectRadius: 0.05, fill: { color: BLUE },
  });
  s.addText(st[0], {
    x: x + 0.16, y: y + 0.14, w: 0.44, h: 0.32, fontFace: FONT, fontSize: 10.5,
    bold: true, color: "FFFFFF", align: "center", valign: "middle", margin: 0,
  });
  s.addText(st[1], {
    x: x + 0.7, y: y + 0.14, w: 2.05, h: 0.32, fontFace: FONT, fontSize: 11.5,
    bold: true, color: DARK, valign: "middle", margin: 0,
  });
  s.addText(st[2], {
    x: x + 0.16, y: y + 0.56, w: 2.6, h: 0.6, fontFace: FONT, fontSize: 8,
    color: DARK, margin: 0, valign: "top", lineSpacingMultiple: 1.15,
  });
  s.addText(`Tools: ${st[3]}`, {
    x: x + 0.16, y: y + 1.19, w: 2.6, h: 0.24, fontFace: FONT, fontSize: 7.5,
    color: BLUE, bold: true, margin: 0, valign: "middle",
  });
});

// =====================================================================
// 9 — SECTION: DEEP DIVE
// =====================================================================
divider(pres.addSlide(), "Deep Dive", "Analysis");

// =====================================================================
// 10 — BUDGET FLOW
// =====================================================================
s = pres.addSlide();
title(s, "What does data tell us? — Where the budget went");
logo(s);
s.addImage({ path: F("02_budget_flow.png"), x: 0.4, y: 1.35, w: 4.65, h: 2.45 });
findingColumn(s,
  5.15,
  "Only $492,343 (29.4%) of the $1.68M budget is fully defensible — plausibly recorded and completed. " +
  "The remaining 70.6% fails at least one of the two tests.",
  "The headline effectiveness rate of 50.6% overstates what can actually be justified, because it only " +
  "tests completion. Cross-tabulating completion against record integrity halves the defensible figure."
);

// =====================================================================
// 11 — RECORD INTEGRITY
// =====================================================================
s = pres.addSlide();
title(s, "What does data tell us? — Record integrity");
logo(s);
s.addImage({ path: F("05_post_exit_anomaly.png"), x: 0.4, y: 1.4, w: 4.65, h: 2.35 });
findingColumn(s,
  5.15,
  "1,029 sessions ($574,242) are dated after the employee's exit — a median of 358 days after, with the " +
  "furthest case 1,677 days (4.6 years). A further 288 sessions predate the employee's hire date.",
  "The enrolment system never checks employment status. One employee who left in November 2018 is " +
  "recorded as attending a course in July 2023 and passing it."
);

// =====================================================================
// 12 — PROGRAMME PERFORMANCE
// =====================================================================
s = pres.addSlide();
title(s, "What does data tell us? — Programme performance");
logo(s);
s.addImage({ path: F("03_effectiveness_by_program.png"), x: 0.4, y: 1.4, w: 4.65, h: 2.35 });
findingColumn(s,
  5.15,
  "Technical Skills is the weakest programme at 43.7% while absorbing $323,073. The best performer, " +
  "Communication Skills, reaches only 54.0%. The whole portfolio spans just 10 points.",
  "Programme choice is statistically significant (p = 0.002) but the effect is weak (Cramér's V = 0.075). " +
  "Even the best programme sits 26 points below target — no reshuffle of the portfolio reaches 80%."
);

// =====================================================================
// 13 — DRIVER TESTING
// =====================================================================
s = pres.addSlide();
title(s, "What does data tell us? — Drivers tested", "Five of six candidate drivers show no relationship with completion");
logo(s);
s.addTable(
  [
    [
      { text: "Hypothesis", options: { bold: true, color: "FFFFFF", fill: { color: BLUE } } },
      { text: "p-value", options: { bold: true, color: "FFFFFF", fill: { color: BLUE }, align: "center" } },
      { text: "Effect size", options: { bold: true, color: "FFFFFF", fill: { color: BLUE }, align: "center" } },
      { text: "Verdict", options: { bold: true, color: "FFFFFF", fill: { color: BLUE }, align: "center" } },
    ],
    ["Programme drives completion", { text: "0.002", options: { align: "center" } }, { text: "V = 0.075", options: { align: "center" } }, { text: "Supported", options: { align: "center", bold: true, color: GREEN } }],
    ["Budget leaks to departing employees", { text: "0.008", options: { align: "center" } }, { text: "$857,430", options: { align: "center" } }, { text: "Supported", options: { align: "center", bold: true, color: GREEN } }],
    ["External training is less effective", { text: "0.101", options: { align: "center" } }, { text: "V = 0.030", options: { align: "center" } }, { text: "Rejected", options: { align: "center", color: GREY } }],
    ["Shorter tenure lowers completion", { text: "0.123", options: { align: "center" } }, { text: "r = −0.027", options: { align: "center" } }, { text: "Rejected", options: { align: "center", color: GREY } }],
    ["Longer courses are less completed", { text: "0.445", options: { align: "center" } }, { text: "r = 0.014", options: { align: "center" } }, { text: "Rejected", options: { align: "center", color: GREY } }],
    ["Costlier training is more completed", { text: "0.480", options: { align: "center" } }, { text: "r = 0.011", options: { align: "center" } }, { text: "Rejected", options: { align: "center", color: GREY } }],
  ],
  {
    x: 0.5, y: 1.28, w: 5.85, colW: [2.75, 0.9, 1.1, 1.1], rowH: 0.315,
    fontFace: FONT, fontSize: 8.5, color: DARK, valign: "middle",
    border: { type: "solid", color: "E3E9F4", pt: 0.5 }, fill: { color: "FFFFFF" },
  }
);
textCard(s, 6.6, 1.28, 2.9, 1.62, "What this rules out",
  "Expensive training is not completed more often than cheap training. Five-day courses fare no worse " +
  "than one-day courses. New hires complete at the same rate as veterans.",
  { headSize: 9.5, bodySize: 8 });
textCard(s, 6.6, 3.05, 2.9, 1.6, "What it means",
  "Every intuitive explanation was tested and failed. The failure is systemic, not confined to any " +
  "programme, vendor or employee group.",
  { headSize: 9.5, bodySize: 8, fill: TINT2 });
s.addText("Chi-square for categorical drivers, Mann-Whitney U for numeric. Full census, n = 3,000.", {
  x: 0.5, y: 4.72, w: 9.0, h: 0.28, fontFace: FONT, fontSize: 7.5, color: MUTED, margin: 0,
});

// =====================================================================
// 14 — CAN WE REACH 80%?
// =====================================================================
s = pres.addSlide();
title(s, "Can we actually reach 80%?", "Sizing every available lever against the 29.4-point gap");
logo(s);
s.addImage({ path: F("01_gap_to_target.png"), x: 0.4, y: 1.35, w: 4.55, h: 2.65 });
s.addTable(
  [
    [
      { text: "Lever", options: { bold: true, color: "FFFFFF", fill: { color: BLUE } } },
      { text: "Reaches", options: { bold: true, color: "FFFFFF", fill: { color: BLUE }, align: "center" } },
      { text: "Gap closed", options: { bold: true, color: "FFFFFF", fill: { color: BLUE }, align: "center" } },
    ],
    ["Baseline today", { text: "50.6%", options: { align: "center" } }, { text: "—", options: { align: "center" } }],
    ["Shift all sessions to best programme", { text: "54.0%", options: { align: "center" } }, { text: "+3.5 pp", options: { align: "center" } }],
    ["Stop all 1,317 invalid-date sessions", { text: "52.3%", options: { align: "center" } }, { text: "+1.8 pp", options: { align: "center" } }],
    ["Both levers combined", { text: "53.4%", options: { align: "center" } }, { text: "+2.8 pp", options: { align: "center" } }],
    [
      { text: "Remaining gap to 80%", options: { bold: true, color: CRIMSON } },
      { text: "—", options: { align: "center" } },
      { text: "26.6 pp", options: { align: "center", bold: true, color: CRIMSON } },
    ],
  ],
  {
    x: 5.15, y: 1.35, w: 4.35, colW: [2.35, 1.0, 1.0], rowH: 0.3,
    fontFace: FONT, fontSize: 8.5, color: DARK, valign: "middle",
    border: { type: "solid", color: "E3E9F4", pt: 0.5 }, fill: { color: "FFFFFF" },
  }
);
textCard(s, 5.15, 3.35, 4.35, 1.3, "The honest conclusion",
  "26.6 of the 29.4 points cannot be explained by any variable the L&D system captures. The residual " +
  "lies in factors never recorded: instructor quality, course relevance, and participant workload.",
  { headSize: 10, bodySize: 8.5, fill: TINT });

// =====================================================================
// 15 — DASHBOARD
// =====================================================================
s = pres.addSlide();
title(s, "How do we track progress?", "Training budget monitoring dashboard — Power BI");
logo(s);
s.addImage({ path: A("dashboard_mockup.png"), x: 0.5, y: 1.15, w: 6.1, h: 3.37 });
const dash = [
  ["KPI Cards", "Budget Integrity Rate, Completion Rate and Leakage Value, each against its 6-month target"],
  ["Budget Flow", "Four-way split by record integrity and completion, surfacing the $492,343 defensible core"],
  ["Programme View", "Effectiveness and spend per programme against the 80% reference line"],
  ["Trend Line", "Monthly effectiveness with target and average reference lines"],
];
dash.forEach((d, i) => {
  const y = 1.15 + i * 0.86;
  s.addText(d[0], {
    x: 6.85, y, w: 2.7, h: 0.24, fontFace: FONT, fontSize: 9.5, bold: true, color: BLUE, margin: 0, valign: "middle",
  });
  s.addText(d[1], {
    x: 6.85, y: y + 0.24, w: 2.7, h: 0.56, fontFace: FONT, fontSize: 7.5, color: DARK,
    margin: 0, valign: "top", lineSpacingMultiple: 1.14,
  });
});
s.addText(
  "Dashboard goal: make the leakage visible instead of letting a single effectiveness percentage conceal it.   |   Design mockup — Power BI build in progress.",
  { x: 0.5, y: 4.62, w: 9.0, h: 0.3, fontFace: FONT, fontSize: 7.5, color: MUTED, margin: 0 }
);

// =====================================================================
// 16 — SECTION: INSIGHT & RECOMMENDATIONS
// =====================================================================
divider(pres.addSlide(), "Insight &", "Recommendations");

// =====================================================================
// 17 — REC 1
// =====================================================================
s = pres.addSlide();
title(s, "Recommendation 1 — Enrolment Control");
logo(s);
textCard(s, 0.5, 1.05, 9.0, 0.72, "Key Finding",
  "1,029 sessions ($574,242) recorded for employees who had already left, and 288 sessions ($160,903) " +
  "for employees not yet hired. The enrolment system never checks employment status.",
  { headSize: 10, bodySize: 8.5, fill: TINT });
textCard(s, 0.5, 1.92, 4.38, 1.72, "Why This Happens",
  "•  No validation rule linking training date to the employment period\n" +
  "•  Enrolment and HRIS run as separate systems with no status handshake\n" +
  "•  Completion can be recorded by a third party without the employee",
  { headSize: 10, bodySize: 8, fill: TINT2 });
textCard(s, 0.5, 3.8, 4.38, 1.05, "Risk if Unaddressed",
  "The company keeps paying for training on behalf of people who left years ago, and every budget " +
  "figure reported to the board stays unverifiable.",
  { headSize: 10, bodySize: 8, headColor: CRIMSON, bodyColor: CRIMSON, fill: "FDF0EF" });
textCard(s, 5.12, 1.92, 4.38, 2.93, "Recommendation",
  "1.  Hard validation rule\nReject any enrolment where the training date falls outside hire-to-exit.\n" +
  "Tool: system-level constraint in the L&D platform\n\n" +
  "2.  Nightly status sync\nHRIS pushes active-employee status daily, so exits propagate within 24 hours.\n\n" +
  "Owner: Head of L&D + HRIS      Deadline: 30 days\n" +
  "Value secured: $735,145 per year (43.9% of budget)",
  { headSize: 10, bodySize: 8 });

// =====================================================================
// 18 — REC 2
// =====================================================================
s = pres.addSlide();
title(s, "Recommendation 2 — Replace the KPI");
logo(s);
textCard(s, 0.5, 1.05, 9.0, 0.72, "Key Finding",
  "Stopping all $735,145 of invalid spend raises measured effectiveness by only 1.8 percentage points. " +
  "The single largest available saving barely registers on the metric management is targeting.",
  { headSize: 10, bodySize: 8.5, fill: TINT });
textCard(s, 0.5, 1.92, 4.38, 1.5, "The Measurement Trap",
  "Bellwood could hit a good-looking effectiveness number while the leakage continues undetected. " +
  "The KPI actively conceals the problem it was meant to surface.",
  { headSize: 10, bodySize: 8, headColor: CRIMSON, bodyColor: CRIMSON, fill: "FDF0EF" });
textCard(s, 0.5, 3.55, 4.38, 1.3, "The Fix",
  "Retire the single effectiveness percentage as a target. Keep it on the report for historical " +
  "comparison, but stop setting targets against it.\n\nOwner: CFO + Head of L&D    Deadline: 30 days",
  { headSize: 10, bodySize: 8, fill: TINT2 });
s.addText("Three replacement metrics that cannot mask one another", {
  x: 5.12, y: 1.92, w: 4.38, h: 0.28, fontFace: FONT, fontSize: 10, bold: true, color: BLUE, margin: 0, valign: "middle",
});
const kpis = [
  ["Budget Integrity Rate", "56.1%", "95%", "HRIS"],
  ["Completion Rate (valid records)", "51.9%", "60%", "Head of L&D"],
  ["Leakage Value", "$735,145", "< $50,000", "CFO"],
];
kpis.forEach((k, i) => {
  const y = 2.32 + i * 0.85;
  card(s, 5.12, y, 4.38, 0.74, i % 2 ? TINT2 : TINT);
  s.addText(k[0], {
    x: 5.28, y: y + 0.07, w: 4.06, h: 0.24, fontFace: FONT, fontSize: 9, bold: true, color: DARK, margin: 0, valign: "middle",
  });
  s.addText(
    [
      { text: "now ", options: { color: GREY, fontSize: 7.5 } },
      { text: k[1], options: { color: CRIMSON, fontSize: 9.5, bold: true } },
      { text: "    →    target ", options: { color: GREY, fontSize: 7.5 } },
      { text: k[2], options: { color: GREEN, fontSize: 9.5, bold: true } },
      { text: `      owner: ${k[3]}`, options: { color: GREY, fontSize: 7.5 } },
    ],
    { x: 5.28, y: y + 0.33, w: 4.06, h: 0.3, fontFace: FONT, margin: 0, valign: "middle" }
  );
});

// =====================================================================
// 19 — REC 3 & 4
// =====================================================================
s = pres.addSlide();
title(s, "Recommendations 3 & 4 — Clean the Baseline, Fix the Weakest Programme");
logo(s);
textCard(s, 0.5, 1.18, 4.38, 1.75, "3 · Audit the 1,317 Historical Records",
  "The current baseline is calculated from data where 43.9% of records are internally inconsistent. " +
  "Any target set on top of this rests on a false foundation.\n\n" +
  "Trace all flagged records against invoices and attendance registers, classify each as recording " +
  "error or genuine payment, then restate the fiscal-year baseline.",
  { headSize: 10, bodySize: 8 });
textCard(s, 0.5, 3.08, 4.38, 1.05, "Impact",
  "Produces a defensible baseline the board can be shown.",
  { headSize: 9.5, bodySize: 8, fill: TINT2 });
s.addText("Owner: HRIS + Finance      Deadline: 60 days", {
  x: 0.66, y: 4.25, w: 4.1, h: 0.26, fontFace: FONT, fontSize: 8, bold: true, color: BLUE, margin: 0, valign: "middle",
});
textCard(s, 5.12, 1.18, 4.38, 1.75, "4 · Redesign or Retire Technical Skills",
  "Technical Skills absorbs $323,073 at 43.7% effectiveness — the lowest of five programmes and " +
  "10 points below the best performer.\n\n" +
  "Review the course design and delivery format. If it fails to reach the portfolio average across " +
  "two cycles, reallocate the budget.",
  { headSize: 10, bodySize: 8, fill: TINT2 });
textCard(s, 5.12, 3.08, 4.38, 1.05, "Stated Honestly",
  "Effect size is weak (V = 0.075). Optimising the whole portfolio adds roughly 3 points. Worth doing — but not the main lever.",
  { headSize: 9.5, bodySize: 8, headColor: CRIMSON, bodyColor: CRIMSON, fill: "FDF0EF" });
s.addText("Owner: Head of L&D  ·  90 days  ·  $33,159/year", {
  x: 5.28, y: 4.25, w: 4.1, h: 0.26, fontFace: FONT, fontSize: 8, bold: true, color: BLUE, margin: 0, valign: "middle",
});

// =====================================================================
// 20 — REC 5 & 6
// =====================================================================
s = pres.addSlide();
title(s, "Recommendations 5 & 6 — Collect What's Missing, Reset the Target");
logo(s);
textCard(s, 0.5, 1.18, 4.38, 2.05, "5 · Record the Three Missing Factors",
  "After testing every captured variable, 26.6 of the 29.4-point gap remains unexplained. Add three " +
  "mandatory fields:\n\n" +
  "1.  Standardised instructor ID — currently 2,942 unique trainer names across 3,000 sessions\n" +
  "2.  Course relevance rating from the participant at completion\n" +
  "3.  Manager approval and participant workload flag",
  { headSize: 10, bodySize: 8 });
textCard(s, 0.5, 3.38, 4.38, 0.9, "Risk if Unaddressed",
  "Next year's analysis reaches the same dead end, after another $1.6M is spent.",
  { headSize: 9.5, bodySize: 8, headColor: CRIMSON, bodyColor: CRIMSON, fill: "FDF0EF" });
s.addText("Owner: Head of L&D      Deadline: 90 days", {
  x: 0.66, y: 4.4, w: 4.1, h: 0.26, fontFace: FONT, fontSize: 8, bold: true, color: BLUE, margin: 0, valign: "middle",
});
textCard(s, 5.12, 1.18, 4.38, 1.35, "6 · Renegotiate the 80% Target",
  "Running every available lever reaches 53.4%. The 80% target has no evidenced path. An unreachable " +
  "target cascaded to L&D invites metric manipulation rather than improvement.",
  { headSize: 10, bodySize: 8, fill: TINT2 });
s.addTable(
  [
    [
      { text: "Horizon", options: { bold: true, color: "FFFFFF", fill: { color: BLUE } } },
      { text: "Staged target", options: { bold: true, color: "FFFFFF", fill: { color: BLUE } } },
      { text: "Lever", options: { bold: true, color: "FFFFFF", fill: { color: BLUE }, align: "center" } },
    ],
    ["6 months", "Budget Integrity 56.1% → 95%", { text: "R1, R3", options: { align: "center" } }],
    ["6 months", "Completion (valid) 51.9% → 60%", { text: "R4", options: { align: "center" } }],
    ["12 months", "Reset effectiveness target on new data", { text: "R5", options: { align: "center" } }],
  ],
  {
    x: 5.12, y: 2.68, w: 4.38, colW: [0.95, 2.53, 0.9], rowH: 0.34,
    fontFace: FONT, fontSize: 8, color: DARK, valign: "middle",
    border: { type: "solid", color: "E3E9F4", pt: 0.5 }, fill: { color: "FFFFFF" },
  }
);
s.addText("Owner: CFO      Deadline: 14 days", {
  x: 5.28, y: 4.4, w: 4.1, h: 0.26, fontFace: FONT, fontSize: 8, bold: true, color: BLUE, margin: 0, valign: "middle",
});

// =====================================================================
// 21 — SECTION: CONCLUSION
// =====================================================================
divider(pres.addSlide(), "Conclusion &", "Next Steps");

// =====================================================================
// 22 — CONCLUSION
// =====================================================================
s = pres.addSlide();
title(s, "Conclusion & Next Steps");
logo(s);
s.addText(
  "Bellwood cannot account for 43.9% of its training budget. Six actions address $768,304 — 45.8% of annual spend — " +
  "but the 80% target itself needs restating.",
  { x: 0.5, y: 1.05, w: 9.0, h: 0.42, fontFace: FONT, fontSize: 10.5, color: DARK, margin: 0 }
);
const concl = [
  ["01", "Fix the control", "One validation rule stops $735,145 of unaccountable spend. Largest number, lowest difficulty.", "30 days"],
  ["02", "Fix the metric", "Three KPIs replace one. The current metric hides the biggest problem.", "30 days"],
  ["03", "Fix the target", "53.4% is the evidenced ceiling. Stage the target against real levers.", "14 days"],
  ["04", "Fix the data", "26.6 points stay dark until instructor, relevance and workload are recorded.", "90 days"],
];
concl.forEach((c, i) => {
  const x = 0.5 + i * 2.32;
  card(s, x, 1.62, 2.15, 2.35, i % 2 ? TINT2 : TINT);
  s.addText(c[0], {
    x: x + 0.16, y: 1.75, w: 1.8, h: 0.38, fontFace: FONT, fontSize: 19, bold: true, color: BLUE, margin: 0, valign: "middle",
  });
  s.addText(c[1], {
    x: x + 0.16, y: 2.18, w: 1.83, h: 0.3, fontFace: FONT, fontSize: 10, bold: true, color: DARK, margin: 0, valign: "middle",
  });
  s.addText(c[2], {
    x: x + 0.16, y: 2.53, w: 1.83, h: 1.02, fontFace: FONT, fontSize: 7.5, color: DARK, margin: 0, valign: "top", lineSpacingMultiple: 1.15,
  });
  s.addText(c[3], {
    x: x + 0.16, y: 3.6, w: 1.83, h: 0.26, fontFace: FONT, fontSize: 8, bold: true, color: BLUE, margin: 0, valign: "middle",
  });
});
textCard(s, 0.5, 4.13, 9.0, 0.78, "What's the ROI?",
  "$768,304 addressed (45.8% of budget)     |     Budget Integrity 56.1% → 95%     |     " +
  "Leakage $735,145 → under $50,000     |     Monitored via Power BI",
  { headSize: 10, bodySize: 8.5, fill: TINT });

// =====================================================================
// 23 — THANK YOU
// =====================================================================
s = pres.addSlide();
s.background = { color: DARK };
s.addImage({ path: A("logo_bellwood_dark.png"), x: 3.6, y: 1.25, w: 2.8, h: 0.88 });
s.addText("THANK YOU", {
  x: 1.5, y: 2.3, w: 7.0, h: 0.95, fontFace: FONT, fontSize: 44, bold: true,
  color: "FFFFFF", align: "center", valign: "middle", margin: 0, charSpacing: 2,
});
s.addText("Training Budget Effectiveness Analysis  ·  Bellwood Networks, Inc.", {
  x: 1.5, y: 3.25, w: 7.0, h: 0.3, fontFace: FONT, fontSize: 11, color: "9DB8E0", align: "center", margin: 0,
});
const contacts = [
  ["icon_whatsapp.png", "WhatsApp & Phone", "+62 812 4154 4992", 1.55],
  ["icon_linkedin.png", "LinkedIn", "Deleonard Simanjorang", 4.15],
  ["icon_email.png", "Email", "deleonard20@gmail.com", 6.75],
];
contacts.forEach((c) => {
  s.addShape(pres.ShapeType.ellipse, {
    x: c[3], y: 4.12, w: 0.36, h: 0.36, fill: { color: "FFFFFF" },
  });
  s.addImage({ path: A(c[0]), x: c[3] + 0.05, y: 4.17, w: 0.26, h: 0.26 });
  s.addText(c[1], {
    x: c[3] + 0.46, y: 4.11, w: 1.9, h: 0.2, fontFace: FONT, fontSize: 8, bold: true, color: "FFFFFF", margin: 0, valign: "middle",
  });
  s.addText(c[2], {
    x: c[3] + 0.46, y: 4.29, w: 1.9, h: 0.2, fontFace: FONT, fontSize: 8, color: "9DB8E0", margin: 0, valign: "middle",
  });
});

// =====================================================================
// 24 — SECTION: APPENDIX
// =====================================================================
divider(pres.addSlide(), "Appendix");

// =====================================================================
// 25 — APPENDIX A
// =====================================================================
s = pres.addSlide();
title(s, "Appendix A — References & Data Source");
logo(s);
textCard(s, 0.5, 1.2, 4.38, 2.0, "Dataset",
  "HR Analytics dataset (public, Kaggle)\n\n" +
  "Files: 4 CSV — employee master, training & development, engagement survey, recruitment\n" +
  "Records: 3,000 per file, employee ID range 1001–4000\n" +
  "Fiscal window: 5 Aug 2022 – 5 Aug 2023 (365 days)\n" +
  "Coverage: full census, one training record per employee",
  { headSize: 10, bodySize: 8 });
textCard(s, 5.12, 1.2, 4.38, 2.0, "Methods Applied",
  "Chi-square test of independence with Cramér's V (categorical drivers)\n" +
  "Mann-Whitney U and point-biserial correlation (numeric drivers)\n" +
  "Linear regression on the monthly series (trend significance)\n" +
  "Temporal logic validation against employment period\n" +
  "Scenario modelling for lever sizing",
  { headSize: 10, bodySize: 8, fill: TINT2 });
textCard(s, 0.5, 3.35, 9.0, 1.35, "Excluded Fields and Why",
  "Trainer (2,942 unique values across 3,000 rows) and Location (2,738) are near-unique per row and form no analysable groups.\n" +
  "Supervisor (2,952 unique across 3,000 employees) yields no usable hierarchy.  LocationCode (2,821) behaves as a random identifier.\n" +
  "recruitment_data.csv shares the same ID range but 0 of 3,000 names and 0 of 636 job titles match — a separate population, never joined.",
  { headSize: 10, bodySize: 8 });
s.addText(
  "Disclaimer: Bellwood Networks, Inc. is a fictional company created for this portfolio project. All figures are derived from the public dataset and do not represent a real business.",
  { x: 0.5, y: 4.82, w: 9.0, h: 0.3, fontFace: FONT, fontSize: 7.5, color: MUTED, margin: 0 }
);

// =====================================================================
// 26 — APPENDIX B — SQL
// =====================================================================
s = pres.addSlide();
title(s, "Appendix B — Key SQL Queries", "PostgreSQL queries used for extraction and analysis");
logo(s);
const sqlBlocks = [
  [
    "-- Temporal logic violations",
    "SELECT CASE\n" +
    "  WHEN e.exit_date IS NOT NULL\n" +
    "   AND t.training_date > e.exit_date THEN 'after_exit'\n" +
    "  WHEN t.training_date < e.start_date THEN 'before_hire'\n" +
    "  ELSE 'valid' END AS date_validity,\n" +
    "  COUNT(*), ROUND(SUM(t.training_cost),2)\n" +
    "FROM hr.training_records t\n" +
    "JOIN hr.employees e ON e.emp_id = t.employee_id\n" +
    "GROUP BY 1;",
    0.5, 1.28, 4.38,
  ],
  [
    "-- Budget effectiveness by programme",
    "SELECT t.training_program_name,\n" +
    "  COUNT(*) AS sessions,\n" +
    "  ROUND(SUM(t.training_cost),2) AS spend,\n" +
    "  ROUND(100.0 * SUM(t.training_cost)\n" +
    "    FILTER (WHERE t.training_outcome\n" +
    "      IN ('Completed','Passed'))\n" +
    "    / SUM(t.training_cost),1) AS effectiveness\n" +
    "FROM hr.training_records t\n" +
    "GROUP BY 1 ORDER BY effectiveness;",
    5.12, 1.28, 4.38,
  ],
];
sqlBlocks.forEach((b) => {
  card(s, b[2], b[3], b[4], 2.55, TINT2);
  s.addText(b[0], {
    x: b[2] + 0.16, y: b[3] + 0.1, w: b[4] - 0.32, h: 0.24, fontFace: FONT,
    fontSize: 9, bold: true, color: BLUE, margin: 0, valign: "middle",
  });
  s.addText(b[1], {
    x: b[2] + 0.16, y: b[3] + 0.38, w: b[4] - 0.32, h: 2.05, fontFace: "Courier New",
    fontSize: 7.5, color: DARK, margin: 0, valign: "top", lineSpacingMultiple: 1.12,
  });
});
textCard(s, 0.5, 4.05, 9.0, 0.82, "Full query set",
  "Extraction, data-quality checks, budget breakdowns and KPI baselines: 04_analysis/sql/queries/   ·   " +
  "Statistical testing: 04_analysis/statistical_analysis/training_effectiveness_analysis.py",
  { headSize: 9.5, bodySize: 8 });

// =====================================================================
// 27 — APPENDIX C — ABOUT THE ANALYST
// =====================================================================
s = pres.addSlide();
title(s, "Appendix C — About the Analyst");
logo(s);
s.addImage({ path: A("analyst_photo.png"), x: 0.9, y: 1.2, w: 2.3, h: 3.09 });
s.addText("Deleonard Simanjorang", {
  x: 4.0, y: 1.2, w: 5.5, h: 0.34, fontFace: FONT, fontSize: 15, bold: true, color: BLUE, margin: 0, valign: "middle",
});
s.addText("Data Analyst  |  People & HR Analytics", {
  x: 4.0, y: 1.54, w: 5.5, h: 0.26, fontFace: FONT, fontSize: 10, bold: true, color: GREY, margin: 0, valign: "middle",
});
s.addText(
  "Background in HR and business operations, working in data analytics with a focus on workforce " +
  "analytics, people analytics and operational efficiency.",
  { x: 4.0, y: 1.86, w: 5.5, h: 0.5, fontFace: FONT, fontSize: 8.5, color: DARK, margin: 0, lineSpacingMultiple: 1.15 }
);
const about = [
  ["Technical Skills", "SQL (PostgreSQL, MySQL, BigQuery)  ·  Python  ·  Power BI  ·  Tableau  ·  Excel"],
  ["Certifications", "Business Intelligence Analyst — Digital Skola (2026)\nFull Stack Data Analytics — RevoU (2025)\nMicrosoft Excel Mastery — Digital Skola (2026)"],
  ["Links", "LinkedIn: Deleonard Simanjorang   ·   GitHub: github.com/deleonard20\nEmail: deleonard20@gmail.com"],
];
about.forEach((a, i) => {
  const y = 2.45 + i * 0.82;
  s.addText(a[0], {
    x: 4.0, y, w: 5.5, h: 0.24, fontFace: FONT, fontSize: 9.5, bold: true, color: BLUE, margin: 0, valign: "middle",
  });
  s.addText(a[1], {
    x: 4.0, y: y + 0.24, w: 5.5, h: 0.56, fontFace: FONT, fontSize: 8, color: DARK,
    margin: 0, valign: "top", lineSpacingMultiple: 1.18,
  });
});

// =====================================================================
const OUT = path.join(ROOT, "deck", "Training_Budget_Effectiveness_Analysis_Deck.pptx");
pres.writeFile({ fileName: OUT }).then(() => console.log("written:", OUT));
