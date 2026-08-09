# Business Brief — Training Budget Effectiveness Analysis

## Company Context

Bellwood Networks, Inc. ("Bellwood") is a telecommunications infrastructure contractor headquartered in Massachusetts, USA. The company builds and maintains fiber, cable and wireless networks — aerial and underground construction, splicing, CATV, and wireless site work — for carrier and municipal clients across the northeast United States.

Bellwood employs 3,000 people, two-thirds of them in field production roles. In a business where crews work on live utility infrastructure, training is not a development perk: certification currency and technical competence determine whether a crew can legally be dispatched to a job site at all. Every incomplete training course is a crew member who cannot be deployed.

## Business Problem

Bellwood spent **$1,675,886** on training across 3,000 sessions in fiscal year August 2022 – August 2023. Only **50.6% ($847,484)** of that budget resulted in a completed course. The remaining **$828,402** ended in *Failed* or *Incomplete* status.

Management has set a target of **80% budget effectiveness within 6 months**. No one can currently explain where the money goes, which programmes underperform, or which levers would move the number. Next year's budget is due for approval.

Root of the problem (identified through analysis):
- **43.9% of all training records ($735,145) carry dates that are impossible** against the employee's own employment period — 1,029 sessions booked after the employee had already left, 288 before they were hired
- **$857,430 (51.2%) of the budget went to employees who subsequently left** the company
- **Programme choice is the only measurable driver**, and its effect is small: the best programme reaches 54.0%, the worst 43.7%

## SMART Objective

To identify where the training budget is lost and determine which levers can raise budget effectiveness from **50.6% toward the 80% target within 6 months**, measured through a Power BI monitoring dashboard.

| Element | Definition |
|---------|-----------|
| **S**pecific | Trace all $1,675,886 of training spend to programme, outcome and record validity |
| **M**easurable | Three tracked KPIs — Budget Integrity Rate, Completion Rate (valid records), Leakage Value |
| **A**chievable | Levers tested against data before being recommended; unreachable portions of the target reported honestly rather than assumed away |
| **R**elevant | Directly addresses $828,402 in non-completed spend and $735,145 in unaccountable spend |
| **T**ime-bound | 6 months, reviewed at day 30, 60, 90 and 180 |

> **Note on the target.** The 80% figure was set by management, not derived from data. Testing whether it is reachable is part of this analysis. The finding is that it is not — see `04_analysis/` and Recommendation 6 in `06_action/`.

## Stakeholders

| Stakeholder | Interest |
|-------------|----------|
| CFO | Budget owner; approves next year's L&D allocation and tracks realised savings |
| Head of L&D | Programme owner; accountable for the 80% effectiveness target |
| HR Director | Reports L&D performance to the executive committee |
| HRIS / People Ops | Owns the enrolment system where the data integrity failure originates |
| Department Managers | Approve which crew members are sent to training |

## Scope

**In scope:** 3,000 training records (August 2022 – August 2023) from `training_and_development_data.csv`, joined to `employee_data.csv` for employment status and date validation. Analysis covers spend allocation, completion outcomes, record integrity, and driver testing across programme, delivery type, tenure, duration, cost and department.

**Out of scope:** training ROI against job performance — the system records cost and completion status only, with no before/after performance measurement. Engagement survey and recruitment datasets are excluded as they carry no relationship to training outcomes.

## Deliverables

1. Cleaned analytical mart with derived integrity and effectiveness flags
2. SQL extraction and analysis queries
3. Statistical driver testing across six hypotheses
4. Power BI budget monitoring dashboard with three replacement KPIs
5. Six prioritised recommendations with owners, deadlines and quantified value
6. Stakeholder presentation deck

## Disclaimer

Bellwood Networks, Inc. is a **fictional company** created for this portfolio project, built on a public HR analytics dataset (Kaggle, 3,000 employee records across four files). All figures are derived from this dataset and do not represent a real business.
