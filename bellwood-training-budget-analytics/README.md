# 💰 Training Budget Effectiveness Analysis
### People Analytics Project — Bellwood Networks, Inc.

![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white)
![PowerBI](https://img.shields.io/badge/Power%20BI-F2C811?style=flat&logo=powerbi&logoColor=black)
![Statistical Testing](https://img.shields.io/badge/Statistical%20Testing-Chi--square%20%7C%20Mann--Whitney-6A5ACD)
![Status](https://img.shields.io/badge/Status-In%20Progress-yellow)

---

## 📌 Project Overview

This project analyzes **$1,675,886** of training spend across **3,000 sessions** at **Bellwood Networks, Inc.**, a telecommunications infrastructure contractor operating across Massachusetts and the northeast United States with 3,000 employees, two-thirds of them in field production roles.

The CFO asked a single question: *how do we raise training budget effectiveness from 50.6% to 80% within 6 months?*

The answer is that they cannot — and establishing **why** is the value of this analysis. Six candidate drivers were tested; only programme choice showed a real effect, and it is small. Meanwhile a temporal validation check that no standard data-quality routine performs revealed that **43.9% of all training records ($735,145) carry dates that are impossible** against the employee's own employment period — including 1,029 sessions booked for people who had already left, one of them 4.6 years after their exit.

This analysis delivers six prioritized recommendations addressing **$768,304 (45.8%)** of the annual budget, a replacement KPI set, and a formal challenge to the 80% target backed by quantified lever sizing.

---

## ❓ Problem Statement

Bellwood Networks spent $1,675,886 on training in FY Aug 2022 – Aug 2023, but only 50.6% of that budget resulted in a completed course. Management lacks visibility into where the money goes, which programmes underperform, and which levers would move the number — while next year's budget is due for approval.

---

## 🎯 SMART Objective

To identify where the training budget is lost, test which levers can raise budget effectiveness from **50.6% toward the 80% target within 6 months**, and quantify the recoverable value — monitored via a Power BI dashboard tracking three replacement KPIs.

---

## 🔍 Key Findings

| # | Finding | Impact |
|---|---------|--------|
| 1 | **43.9% of training records ($735,145) have impossible dates** — 1,029 sessions booked after the employee left (median 358 days, max 4.6 years), 288 before they were hired | Largest single recoverable amount; fixable with one validation rule |
| 2 | **Only $492,343 (29.4%) of the budget is fully defensible** — plausibly recorded *and* completed | The headline 50.6% effectiveness rate overstates what can actually be justified |
| 3 | **Five of six candidate drivers show no effect** (p = 0.10–0.48) — cost, duration, tenure, department and delivery type are all unrelated to completion | Rules out every intuitive explanation; the failure is systemic, not segment-specific |
| 4 | **All available levers combined close only 2.8 of 29.4 points** (50.6% → 53.4%) | The 80% target has no evidenced path — 26.6 points trace to factors never recorded |
| 5 | **The KPI itself hides the problem** — stopping $735,145 of invalid spend moves measured effectiveness by just 1.8 pp | The largest available saving is nearly invisible in the metric being targeted |

---

## 💡 Recommendations

**1. Enrolment Control — Secures $735,145**
- Hard validation rule rejecting any training date outside the employee's hire-to-exit window
- Nightly HRIS status sync so exits propagate to the L&D system within 24 hours
- *Owner: Head of L&D + HRIS · 30 days*

**2. Replace the KPI — Prevents the target being met on paper**
- Retire the single effectiveness percentage as a target
- Adopt three metrics that cannot mask one another: Budget Integrity Rate, Completion Rate (valid records), Leakage Value
- *Owner: CFO + Head of L&D · 30 days*

**3. Audit the 1,317 Historical Records — Produces a defensible baseline**
- Trace flagged records against invoices and attendance registers
- Classify each as recording error or genuine payment, then restate the fiscal-year baseline
- *Owner: HRIS + Finance · 60 days*

**4. Redesign or Retire Technical Skills — Recovers $33,159**
- Lowest performer at 43.7% while absorbing $323,073
- Reallocate the budget if it fails to reach portfolio average across two cycles
- *Owner: Head of L&D · 90 days*

**5. Record the Three Missing Factors — Unlocks the remaining 26.6 pp**
- Standardized instructor ID (currently 2,942 unique trainer names across 3,000 sessions)
- Course relevance rating captured from the participant at completion
- Manager approval and participant workload flag
- *Owner: Head of L&D · 90 days*

**6. Renegotiate the 80% Target — Replaces one unreachable number with staged targets**
- 6 months: Budget Integrity 56.1% → 95% · Completion (valid) 51.9% → 60%
- 12 months: reset the effectiveness target using newly collected data
- *Owner: CFO · 14 days*

---

## 💰 Business Impact

| Metric | Value |
|--------|-------|
| Total Annual Training Budget | $1,675,886 |
| Training Sessions Analyzed | 3,000 |
| Current Budget Effectiveness | 50.6% ($847,484) |
| Non-Completed Spend | $828,402 (49.4%) |
| **Fully Defensible Spend** | **$492,343 (29.4%)** |
| Spend on Invalid-Date Records | $735,145 (43.9%) |
| Spend on Employees Who Left | $857,430 (51.2%) |
| **Estimated Total Recovery Potential** | **$768,304 annually (45.8% of budget)** |

*(Recovery assumes: enrolment control eliminates the $735,145 of invalid-date spend + Technical Skills reaches portfolio-best effectiveness)*

---

## 🛠 Tools & Methodology

| Stage | Tool | Activity |
|-------|------|----------|
| Business Problem Definition | — | Problem statement, SMART objective, stakeholder mapping |
| Data Discovery | Python (pandas) | Source profiling, join-integrity checks, field fitness assessment |
| Schema Design | PostgreSQL | DDL for `hr` schema: 2 tables, FK constraints, indexes, validation trigger |
| Data Preparation | Python (pandas) | Deduplication, format standardization, temporal logic validation, 10 derived fields |
| Data Analysis | PostgreSQL | Budget breakdowns by programme, department, integrity and leakage |
| Statistical Testing | Python (scipy) | Chi-square + Cramér's V, Mann-Whitney U, point-biserial correlation, trend regression |
| Lever Sizing | Python (pandas) | Scenario modelling — how far each fix closes the 29.4-point gap |
| Visualization | Python (matplotlib) | Five stakeholder figures with conclusion-led titles |
| Dashboard | Power BI | KPI cards, budget flow, programme breakdown, integrity exception table |
| Insight & Recommendation | — | Six recommendations with owners, deadlines and quantified value |

---

## 📊 Analysis Deep Dive

### Layer 1 — Budget Allocation Analysis

| Metric | Value |
|--------|-------|
| Total Budget (12 months) | $1,675,886 |
| Effective Spend (Completed + Passed) | $847,484 |
| Budget Effectiveness | 50.6% |
| Sessions | 3,000 (full census, one per employee) |
| Top Spending Department | Production ($1,130,181 — 67.4% of budget) |
| Best Programme | Communication Skills (54.0% effectiveness) |
| Worst Programme | Technical Skills (43.7%, $323,073 spend) |

**Critical Insight:** Monthly effectiveness ranged from 44.3% to 58.9% across twelve consecutive months, with no statistically significant trend (p = 0.087). This is a stable state, not a decline — meaning there is no incident, vendor change or quarter to point at, and no one-off remediation will fix it.

---

### Layer 2 — Record Integrity Analysis

Every training date was validated against the employee's own employment period — a check no conventional data-quality routine performs.

| Validation Rule | Violations | Spend |
|-----------------|-----------|-------|
| Training date **after** the employee's exit date | 1,029 | $574,242 |
| Training date **before** the employee's hire date | 288 | $160,903 |
| **Total violations** | **1,317 (43.9%)** | **$735,145** |

Post-exit training sits a **median of 358 days** after the exit date, with the furthest case at **1,677 days (4.6 years)**. One employee who left in November 2018 is recorded as attending a course in July 2023 — and passing it.

**Critical Insight:** The dataset passes every conventional quality check — zero missing values, zero duplicates, 100% join integrity, no cost outliers. The failure is invisible until dates are cross-referenced against employment status, which is exactly why the enrolment system never caught it.

---

### Layer 3 — Driver Testing

Six hypotheses tested against the full census (n = 3,000). Chi-square with Cramér's V for categorical drivers, Mann-Whitney U with point-biserial correlation for numeric.

| Hypothesis | p-value | Effect Size | Verdict |
|-----------|---------|-------------|---------|
| Programme drives completion | **0.002** | V = 0.075 | **Supported** |
| Budget leaks to departing employees | **0.008** | $857,430 | **Supported** |
| External training is less effective | 0.101 | V = 0.030 | Rejected |
| Shorter tenure lowers completion | 0.123 | r = −0.027 | Rejected |
| Longer courses are less completed | 0.445 | r = 0.014 | Rejected |
| Costlier training is more completed | 0.480 | r = 0.011 | Rejected |

**Critical Insight:** Programme choice is statistically significant but the effect is weak (V = 0.075) — at n = 3,000 even trivial differences reach significance. Reporting the p-value without the effect size would have overstated a lever worth 3 points and sent the CFO in the wrong direction.

---

### Layer 4 — Lever Sizing

Each supported finding was converted into a scenario to test how much of the 29.4-point gap it could actually close.

```
Baseline today                                    50.6%
  (+) Shift every session to the best programme   54.0%   (+3.5 pp)
  (+) Stop all 1,317 invalid-date sessions        52.3%   (+1.8 pp)
  (=) Both levers combined                        53.4%   (+2.8 pp)

  Management target                               80.0%
  Remaining gap, unexplained by any captured data 26.6 pp
```

**Critical Insight:** 26.6 of the 29.4 points cannot be explained by any variable the L&D system captures. The residual lies in factors never recorded — instructor quality, course relevance, and participant workload. This is a data-collection recommendation, not an analytical failure.

---

### Layer 5 — The Measurement Trap

Stopping $735,145 of spend booked against people who were not employed raises measured effectiveness by only **1.8 percentage points**.

The single largest available saving barely registers on the metric management is targeting. Pursuing "80% effectiveness" would leave the leakage invisible — Bellwood could report a good-looking number while continuing to pay for training on behalf of people who left years ago.

| Replacement KPI | Baseline | 6-Month Target | Owner |
|-----------------|----------|---------------|-------|
| Budget Integrity Rate | 56.1% | **95%** | HRIS |
| Completion Rate (valid records) | 51.9% | **60%** | Head of L&D |
| Leakage Value | $735,145 | **< $50,000** | CFO |
| *Legacy effectiveness metric* | *50.6%* | *monitored, not targeted* | *Head of L&D* |

---

## 📊 Dashboard Preview

### Training Budget Monitoring — Design Mockup

![Dashboard Mockup](05_communication/screenshots/01_dashboard_mockup.png)

**Dashboard Components:**
- **KPI Cards** — Budget Integrity Rate, Completion Rate (valid records) and Leakage Value, each against its 6-month target
- **Budget Flow** — four-way split by record integrity × completion, surfacing the $492,343 defensible core
- **Programme View** — effectiveness and spend per programme against the 80% reference line
- **Trend Line** — monthly effectiveness with target and average reference lines
- **Integrity Exception Table** — drillable list of invalid-date records for the HRIS audit in Recommendation 3

**Dashboard Goal:** make the leakage visible instead of letting a single effectiveness percentage conceal it.

> ⚠️ Power BI build in progress. The image above is the design mockup generated from the analytical mart; screenshots of the live dashboard will replace it once the `.pbix` is complete.

---

## 📈 Analysis Figures

| Figure | Message |
|--------|---------|
| ![Gap to target](05_communication/figures/01_gap_to_target.png) | The 80% target is unreachable with the levers we have |
| ![Budget flow](05_communication/figures/02_budget_flow.png) | Where the $1,675,886 training budget actually went |
| ![Post-exit anomaly](05_communication/figures/05_post_exit_anomaly.png) | 1,029 sessions booked for employees who had already left |

---

## 📁 Data Model

**Source Model — 1 Fact Table + 1 Master Table → Analytical Mart**

```
hr.employees        ──┐
   (3,000 rows)       ├──  training_spend_mart  (3,000 rows × 22 cols)
hr.training_records ──┘
   (3,000 rows)
```

| Table | Rows | Description |
|-------|------|-------------|
| `hr.training_records` | 3,000 | Session-level: date, programme, type, outcome, duration, cost |
| `hr.employees` | 3,000 | Employee master: hire/exit dates, termination type, department, status |
| `training_spend_mart` | 3,000 | Analytical mart with 10 derived fields (integrity flags, effectiveness splits) |

**Derived Fields in the Mart**

| Field | Definition |
|-------|-----------|
| `is_effective` · `effective_spend` · `wasted_spend` | Budget effectiveness split |
| `has_left` · `spend_to_leaver` | Leakage to departing employees |
| `date_validity` · `is_valid_record` | Record integrity — `valid` / `after_exit` / `before_hire` |
| `tenure_at_training_years` · `cost_per_day` · `training_month` | Supporting context and trend bucketing |

**Data Period:** 5 Aug 2022 – 5 Aug 2023 (365 days)
**Coverage:** Full census — one training record per employee, not a sample

**Fields Deliberately Excluded**

| Field | Distinct Values | Reason |
|-------|----------------|--------|
| `trainer` | 2,942 / 3,000 rows | Near-unique per row — no analysable groups |
| `location` | 2,738 / 3,000 rows | Near-unique per row |
| `supervisor` | 2,952 / 3,000 employees | No usable org hierarchy |
| `location_code` | 2,821 | Behaves as a random identifier |

> ⚠️ `recruitment_data.csv` shares the same ID range (1001–4000) as the employee master, but **0 of 3,000 names match** and **0 of its 636 job titles overlap**. It is a separate population of external applicants and must never be joined on `emp_id`.

---

## 🔑 SQL Techniques Used

| Technique | Applied In |
|-----------|-----------|
| `FILTER (WHERE ...)` conditional aggregation | Effective vs wasted spend in a single pass |
| `CASE WHEN` classification in `GROUP BY` | Date-validity bucketing (valid / after_exit / before_hire) |
| `SUM(SUM(...)) OVER ()` window function | Percent-of-total budget share without a self-join |
| `PERCENTILE_CONT` | Median days between exit date and training date |
| Multi-step CTE | KPI baseline pipeline (integrity, completion, leakage) |
| `DATE_TRUNC` | Monthly effectiveness trend |
| `NULLIF` | Safe division guarding against empty valid-record sets |
| `LEFT JOIN` + `IS NULL` | Orphan-record detection for referential integrity |
| PL/pgSQL trigger function | The enrolment validation rule proposed in Recommendation 1 |

---

## 📁 Project Structure

```
bellwood-training-budget-analytics/
├── 01_define/
│   └── business_brief.md
├── 02_data_discovery/
│   └── data_dictionary.md
├── 03_data_preparation/
│   ├── data_cleaning_notes.md
│   └── prepare_training_data.py
├── 04_analysis/
│   ├── sql/
│   │   ├── schema/
│   │   │   └── 01_create_tables.sql
│   │   └── queries/
│   │       ├── 01_extraction.sql
│   │       ├── 02_data_quality.sql
│   │       ├── 03_budget_breakdown.sql
│   │       └── 04_kpi_baselines.sql
│   └── statistical_analysis/
│       ├── training_effectiveness_analysis.py
│       └── analysis_summary.md
├── 05_communication/
│   ├── README.md
│   ├── build_figures.py
│   ├── figures/
│   └── screenshots/
├── 06_action/
│   └── recommendations.md
├── data/
│   ├── raw/
│   └── processed/
├── dashboard/
├── deck/
│   ├── build_deck.js
│   └── Training_Budget_Effectiveness_Analysis_Deck.pptx
├── requirements.txt
└── README.md
```

---

## ▶️ Reproducing the Analysis

```bash
pip install -r requirements.txt

python 03_data_preparation/prepare_training_data.py
python 04_analysis/statistical_analysis/training_effectiveness_analysis.py
python 05_communication/build_figures.py
```

Every figure quoted in this repository is printed by these scripts and traceable to `data/raw/`.

To run the SQL against a local PostgreSQL instance:

```bash
psql -f 04_analysis/sql/schema/01_create_tables.sql
# load data/raw/ via the \COPY commands at the bottom of that file
psql -f 04_analysis/sql/queries/02_data_quality.sql
```

---

## 🎯 6-Month Implementation Roadmap

**Phase 1: Fix the Measurement (Day 1–30)**
- Renegotiate the 80% target into staged, lever-backed targets (R6)
- Replace the single effectiveness KPI with three non-masking metrics (R2)
- *Setting targets before fixing the metric locks in the wrong incentive*

**Phase 2: Stop the Leak (Day 30–60)**
- Deploy the enrolment validation rule and nightly HRIS status sync (R1)
- Complete the audit of 1,317 historical records and restate the baseline (R3)
- **Day 30 decision point:** is the $735,145 real leakage or a recording error? If the latter, all L&D reporting must be restated.

**Phase 3: Fix the Quality (Day 60–90)**
- Review or retire the Technical Skills programme (R4)
- Implement the three new mandatory data fields (R5)
- **Day 90 checkpoint:** escalate to the system owner if Budget Integrity Rate is below 90%

**Phase 4: Evaluate (Day 90–180)**
- Measure recovery against the $768,304 target
- **Day 180:** set the effectiveness target using data collected under R5
- Report ROI to the CFO

---

## 🧭 What Makes This Analysis Different

**The scope was allowed to change when the data said so.** The original brief asked which programmes to fix. The data showed that programme choice explains almost nothing, and that the real issue is an enrolment control gap. Reporting that — instead of producing a tidy programme-ranking deck — is the deliverable.

**Effect sizes are reported alongside p-values.** Programme choice is significant at p = 0.002, but Cramér's V = 0.075. Quoting the p-value alone would have overstated a lever worth 3 points.

**Negative results are reported as findings.** Five of six hypotheses were rejected. That is what rules out the intuitive explanations and redirects attention to the control gap.

**The target is challenged, not accepted.** Rather than assuming 80% is reachable, every lever was sized. The honest answer — 53.4% — is stated plainly.

---

## ⚠️ Disclaimer

Bellwood Networks, Inc. is a **fictional company** created for this portfolio project, built on a public HR analytics dataset (Kaggle — 3,000 employee records across four files). All figures are derived from this dataset and do not represent a real business.

---

## 🔗 Connect

**Deleonard Simanjorang**
Data Analyst | People & HR Analytics

📧 deleonard20@gmail.com
💼 [LinkedIn](https://www.linkedin.com/in/deleonard-simanjorang)
📱 WhatsApp: +62 812 4154 4992
🐙 [GitHub](https://github.com/deleonard20)

---

**⭐ If you found this analysis helpful, please consider starring this repository!**
