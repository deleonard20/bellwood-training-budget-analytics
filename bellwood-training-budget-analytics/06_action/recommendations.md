# Recommendations & Expected Impact — Training Budget Effectiveness Analysis

Six actions addressing **$768,304 (45.8%)** of the $1,675,886 annual training budget, ranked by value secured ÷ implementation difficulty.

---

## Recommendation 1 — Block Enrolment for Inactive Employees

**Finding:** 1,029 sessions ($574,242) are recorded for employees who had already left the company, and 288 sessions ($160,903) for employees not yet hired. The enrolment system never checks employment status.

**Why this happens:**
- No validation rule linking the training date to the employee's employment period
- Enrolment and HRIS operate as separate systems with no status handshake
- Course completion can be recorded by a third party without the employee's involvement

**Risk if unaddressed:** the company continues paying for training on behalf of people who left years ago, and every budget figure reported to the board remains unverifiable.

**Actions:**
1. **Hard validation rule** — reject any enrolment where `training_date` falls outside `hire_date` to `exit_date`. *Tool: system-level constraint in the L&D platform*
2. **Nightly status sync** — HRIS pushes active-employee status to the L&D system daily, so exits propagate within 24 hours

| | |
|---|---|
| Owner | Head of L&D + HRIS |
| Deadline | 30 days |
| Difficulty | Low — a single validation rule |
| **Value secured** | **$735,145/year (43.9% of budget)** |

> **Critical note for management.** The $735,145 has two possible explanations, and **both require action.** If the money genuinely left the company, this is real budget leakage. If it is a recording error, then the $1,675,886 reported to the board is wrong and every L&D report must be restated. The first 30 days must establish which. This analysis deliberately does not choose between them without evidence.

---

## Recommendation 2 — Replace the KPI: Separate Effectiveness from Record Integrity

**Finding:** stopping all $735,145 of invalid spend raises measured effectiveness by only **1.8 percentage points**. The single largest available saving barely registers on the metric management is targeting.

**Risk if unaddressed:** Bellwood hits a good-looking effectiveness number while the leakage continues undetected. The KPI actively conceals the problem it was meant to surface.

**Actions:** retire the single effectiveness percentage as a target. Replace with three metrics that cannot mask one another (see Business Impact below). Keep the legacy metric on the report for historical comparison, but stop setting targets against it.

| | |
|---|---|
| Owner | CFO + Head of L&D |
| Deadline | 30 days |
| Difficulty | Low — reporting definition change |
| **Impact** | Prevents the target being met on paper without real improvement |

---

## Recommendation 3 — Audit and Correct the 1,317 Historical Records

**Finding:** the current baseline is calculated from data where 43.9% of records are internally inconsistent. Any target set on top of this number rests on a false foundation.

**Risk if unaddressed:** the 6-month review compares a corrected figure against a corrupted baseline, making progress impossible to interpret.

**Actions:**
1. Trace all 1,317 flagged records against invoices and attendance registers
2. Classify each as recording error or genuine payment
3. Restate the fiscal-year baseline and notify the board if the total changes materially

| | |
|---|---|
| Owner | HRIS + Finance |
| Deadline | 60 days |
| Difficulty | Medium — requires reconciliation to source documents |
| **Impact** | Produces a defensible baseline |

---

## Recommendation 4 — Redesign or Retire the Technical Skills Programme

**Finding:** Technical Skills absorbs $323,073 at 43.7% effectiveness — the lowest of five programmes and 10 points below the best performer. Programme choice was the only driver of six tested that showed a statistically significant relationship (p = 0.002).

**Risk if unaddressed:** the weakest programme continues consuming a fifth of the budget. In a field-operations business, incomplete technical training also means crew members who cannot be dispatched.

**Actions:** review the course design and delivery format. If it fails to reach the portfolio average across two cycles, reallocate the budget to better-performing programmes.

| | |
|---|---|
| Owner | Head of L&D |
| Deadline | 90 days |
| Difficulty | Medium |
| **Value secured** | **$33,159/year** |

> **Stated honestly:** the effect size is weak (Cramér's V = 0.075). Optimising the entire programme portfolio would raise effectiveness by roughly 3 percentage points. This is worth doing, but it is not the main lever, and it should not be presented as one.

---

## Recommendation 5 — Start Recording the Three Missing Factors

**Finding:** after testing every variable the system captures — programme, delivery type, duration, cost, tenure, department — **26.6 of the 29.4-point gap remains unexplained.** The cause lies in data that was never collected.

**Risk if unaddressed:** next year's analysis reaches exactly the same dead end. The company will have spent another $1.6M without learning why half of it produces nothing.

**Actions:** add three mandatory fields to the L&D system:

1. **Standardised instructor ID** — currently 2,942 unique trainer names across 3,000 sessions, making instructor performance impossible to evaluate
2. **Course relevance rating** — 1–5 scale, captured from the participant at completion
3. **Manager approval + workload flag** — recording whether the participant was carrying a full workload during the training period

| | |
|---|---|
| Owner | Head of L&D |
| Deadline | 90 days to implement, review after 2 cycles |
| Difficulty | Medium |
| **Impact** | The only route to explaining the remaining 26.6 points |

---

## Recommendation 6 — Renegotiate the 80% Target

**Finding:** running every available lever simultaneously reaches 53.4%. The 80% target has no evidenced path from the current data.

**Risk if unaddressed:** an unreachable target is cascaded to the L&D team without the means to achieve it. The predictable outcomes are demoralisation or metric manipulation — and given how easily the current KPI can be moved without real improvement, the second is a live risk.

**Actions:** replace one aggregate target with staged targets, each tied to a specific lever.

| Horizon | Target | Lever |
|---------|--------|-------|
| 6 months | Budget Integrity Rate 56.1% → **95%** | R1, R3 |
| 6 months | Completion Rate on valid records 51.9% → **60%** | R4 |
| 12 months | Reset the effectiveness target using newly collected data | R5 |

| | |
|---|---|
| Owner | CFO |
| Deadline | 14 days |
| Difficulty | Low — a management decision |

---

## Execution Sequence

**Days 1–30 — change how it is measured:** R6 then R2. Setting targets before fixing the metric locks in the wrong incentive.
**Days 30–60 — stop the leak:** R1 then R3.
**Days 60–90 — fix the quality:** R4 and R5.

---

## ROI Summary

| Metric | Value |
|--------|-------|
| Total annual training budget | $1,675,886 |
| Currently effective spend | $847,484 (50.6%) |
| Fully defensible spend (valid record **and** completed) | $492,343 (29.4%) |
| Spend on invalid-date records — R1 | $735,145 |
| Technical Skills programme improvement — R4 | $33,159 |
| **Total value addressed** | **$768,304 (45.8% of budget)** |
| Timeline | 6 months |
| Monitoring | Power BI dashboard, three replacement KPIs |

R2, R3, R5 and R6 generate no direct saving. They are the preconditions that make the savings above measurable and durable.

---

## Business Impact — Measurement Framework

### How each recommendation is verified

| Rec | Evidence of success | Verification source |
|-----|--------------------|--------------------|
| R1 | Zero invalid-date records in the new period | Weekly validation query |
| R2 | Monthly report carries three separate metrics | L&D report format |
| R3 | All 1,317 records verified or corrected | HRIS audit log |
| R4 | Technical Skills effectiveness ≥ 52% | Quarterly L&D data |
| R5 | New fields populated on ≥ 95% of sessions | Monthly completeness check |
| R6 | Revised targets minuted with named levers | CFO decision record |

### Tracked KPIs

**Primary — chosen so that none can improve while another silently deteriorates:**

| KPI | Definition | Baseline | 6-month target | Frequency | Owner |
|-----|-----------|----------|---------------|-----------|-------|
| **Budget Integrity Rate** | % of budget on records with valid dates | **56.1%** | **95%** | Monthly | HRIS |
| **Completion Rate (valid records)** | % of valid sessions Completed or Passed | **51.9%** | **60%** | Monthly | Head of L&D |
| **Leakage Value** | Budget sitting on invalid-date records | **$735,145** | **< $50,000** | Monthly | CFO |

**Supporting:**

| KPI | Baseline | Frequency |
|-----|----------|-----------|
| Spend on employees who left within 12 months | $857,430 (51.2%) | Quarterly |
| Weakest programme effectiveness | 43.7% (Technical Skills) | Quarterly |
| New-field completeness (R5) | 0% | Monthly |
| *Legacy effectiveness metric — monitored, not targeted* | *50.6%* | *Monthly* |

### Review Points

| Timing | Review | Decision required |
|--------|--------|------------------|
| **30 days** | R1 investigation | Is $735,145 real leakage or a recording error? If the latter, restate all L&D reporting. |
| **60 days** | R3 audit complete | Approve the corrected baseline |
| **90 days** | Budget Integrity Rate | Escalate to the system owner if below 90% |
| **180 days** | All primary KPIs | Set the effectiveness target using data from R5 |

---

## Executive Summary

1. **$735,145 (43.9% of the budget) is currently unaccountable.** It is the largest number and the easiest to fix — one validation rule.
2. **The 80% target has no evidenced path.** Every available lever combined reaches 53.4%. It needs restating in stages.
3. **The current KPI hides the biggest problem** and must be replaced before any new target is set.
4. **The remaining 26.6 points require data that has never been collected.** Without R5, next year's analysis stops at exactly the same point.
