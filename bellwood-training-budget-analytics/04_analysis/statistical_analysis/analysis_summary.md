# Statistical Analysis — Summary

**Script:** `training_effectiveness_analysis.py`
**Extends:** the descriptive SQL breakdowns in `../sql/queries/03_budget_breakdown.sql`

## Why This Exists

The SQL analysis answers *"where did the money go?"* — spend by programme, department and record integrity. This step answers a harder question: **"which of these differences are real, and how much of the 29.4-point gap can each one actually close?"**

Without it, a plausible-sounding recommendation such as *"replace the underperforming programmes"* would go to the CFO with no indication that it moves the target by roughly 3 points out of 29.

---

## 1. Exploratory Data Analysis

### 1.1 Trend — chronic, not incidental

Monthly effectiveness ranges from **44.3% to 58.9%** across the 12-month window. Linear regression on the monthly series returns a slope of −0.51 pp/month at **p = 0.087** — not statistically significant. A single spike appears in September 2022 (|z| > 2) and does not repeat.

Invalid-record share trends upward at +0.67 pp/month (p = 0.053), close to the significance threshold and worth monitoring, but not yet conclusive.

**Implication:** there is no incident, vendor change or quarter to point at. The problem has been steady-state for at least a year, which rules out a one-off remediation.

### 1.2 Anomalies

| Category | Finding |
|----------|---------|
| **Date validity** | 1,029 sessions after exit, 288 before hire — $735,145 (43.9%) |
| **Distance from exit** | Median 358 days, maximum 1,677 days (~4.6 years) |
| **Most extreme case** | Employee 2995: left Nov 2018, recorded as attending training Jul 2023, outcome *Passed* |
| **Cost** | 0 IQR outliers — cost is evenly distributed, no evidence of inflated invoices |
| **Status conflict** | 991 employees flagged `Active` while holding an exit date |
| **Leakage** | $857,430 (51.2%) spent on employees who subsequently left |

The absence of cost outliers matters as much as the presence of date violations: this is **not** a case of a few oversized invoices. The problem is volume-based and systemic.

### 1.3 Hypotheses Generated

| Code | Hypothesis |
|------|-----------|
| H1 | Effectiveness is low because certain programmes perform far worse |
| H2 | External training is less effective than internal training |
| H3 | Budget leaks to employees who have left or are about to leave |
| H4 | Shorter-tenure employees are less likely to complete |
| H5 | Longer courses are less likely to be completed |
| H6 | More expensive training is more likely to be completed |

---

## 2. Statistical Analysis

### 2.1 Assumption Validation

| Assumption | Result |
|-----------|--------|
| Sample size | 3,000 — full census, not a sample, so no sampling error applies |
| Key-field completeness | Pass — no nulls in cost, outcome or programme |
| Chi-square expected counts | Minimum 281 (requirement ≥ 5) — pass |
| Cost distribution | Skewness −0.07, near symmetric |
| Independence | One record per employee, 0 duplicates — pass |

Non-parametric tests (Mann-Whitney) were used for numeric comparisons despite the symmetric distribution, as the more conservative choice.

### 2.2 Results

| Code | Hypothesis | p-value | Effect size | Verdict |
|------|-----------|---------|-------------|---------|
| **H1** | Programme vs effectiveness | **0.002** | Cramér's V = 0.075 | **Supported** |
| **H3** | Leakage to leavers | **0.008** | $857,430 | **Supported** |
| H2 | Training type (internal/external) | 0.101 | V = 0.030 | Rejected |
| H4 | Tenure at training | 0.123 | r = −0.027 | Rejected |
| H5 | Duration | 0.445 | r = 0.014 | Rejected |
| H6 | Cost | 0.480 | r = 0.011 | Rejected |

**Reading H1 honestly.** The programme effect is statistically significant but the effect size is weak (V = 0.075). At n = 3,000, even trivial differences reach significance. The practical spread runs from Technical Skills at 43.7% to Communication Skills at 54.0% — real, but small. Reporting the p-value without the effect size would overstate this finding, which is why both are shown.

**Reading H3.** Employees who left completed at 47.9% versus 52.8% for those who stayed — a statistically significant but modest difference. H3 is accepted on **materiality** rather than effect size: $857,430 of budget is involved regardless of how similar the completion rates are.

**What the rejections mean.** Four of six hypotheses found nothing. Expensive training is not completed more often than cheap training. Five-day courses fare no worse than one-day courses. New hires complete at the same rate as veterans. External vendors perform no worse than internal trainers. Every intuitive explanation for the low completion rate was tested and failed.

### 2.3 Lever Sizing

The decisive step. Each supported finding was converted into a scenario to test how much of the 29.4-point gap it could close.

| Lever | Resulting effectiveness | Gap closed |
|-------|------------------------|-----------|
| Baseline | 50.6% | — |
| Shift every session to the best programme | 54.0% | **+3.5 pp** |
| Stop all 1,317 invalid-date sessions | 52.3% | +1.8 pp |
| Both combined | 53.4% | +2.8 pp |
| **Remaining gap to 80%** | | **26.6 pp** |

**Conclusion: 26.6 of the 29.4 points cannot be explained by any variable the L&D system currently captures.** The residual almost certainly lies in factors that were never recorded — instructor quality, course relevance to the job, and participant workload during the training period. This is a data-collection recommendation, not an analytical failure.

### 2.4 A Warning About the KPI Itself

Stopping $735,145 of spend booked against people who were not employed raises measured effectiveness by only **1.8 percentage points**.

The single largest available saving barely registers on the metric management is targeting. Pursuing "80% effectiveness" would leave the leakage invisible — Bellwood could hit a good-looking number while continuing to pay for training on behalf of people who left years ago.

This drives Recommendation 2: replace the single metric with three that cannot mask one another.

| New KPI | Baseline | 6-month target |
|---------|----------|---------------|
| Budget Integrity Rate | 56.1% | 95% |
| Completion Rate (valid records only) | 51.9% | 60% |
| Leakage Value | $735,145 | < $50,000 |
| *Legacy effectiveness metric* | *50.6%* | *monitored, not targeted* |

---

## Business Application

1. Recommendations are ranked by **value secured ÷ implementation difficulty**, using the lever sizing above rather than by which finding sounds most compelling
2. The 80% target is formally challenged with quantified evidence rather than accepted and cascaded down to the L&D team
3. Three replacement KPIs are proposed with baselines already computed, ready to be wired into the Power BI dashboard

See `../../06_action/recommendations.md`.
