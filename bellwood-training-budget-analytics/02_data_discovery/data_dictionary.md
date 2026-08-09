# Data Dictionary — Training Budget Effectiveness Analysis

**Source:** public HR analytics dataset (Kaggle) — four CSV files
**Records:** 3,000 rows per file, employee ID range 1001–4000
**Fiscal window analysed:** 5 August 2022 – 5 August 2023 (365 days)

---

## Source Files

| File | Content | Key | Role in this analysis |
|------|---------|-----|----------------------|
| `training_and_development_data.csv` | 3,000 training sessions, 9 columns | `Employee ID` | **Primary** |
| `employee_data.csv` | 3,000 employee master records, 26 columns | `EmpID` | **Supporting** — employment status and date validation |
| `employee_engagement_survey_data.csv` | Engagement, satisfaction, work-life balance scores | `Employee ID` | Not used |
| `recruitment_data.csv` | 3,000 job applicants, 18 columns | `Applicant ID` | Not used |

> **Join warning.** `recruitment_data.csv` shares the same ID range (1001–4000) as the employee master, but **0 of 3,000 names match** and **0 of its 636 job titles overlap** with employee job titles. It is a separate population of external applicants and must never be joined on `EmpID`.

---

## Primary Table — `training_and_development_data.csv`

| Column | Type | Description | Used |
|--------|------|-------------|------|
| Employee ID | INT (FK) | Links to `employee_data.EmpID` — 3,000/3,000 match | Yes |
| Training Date | DATE (dd-Mmm-yy) | Date the session took place | Yes |
| Training Program Name | VARCHAR | One of 5 programmes (see reference table below) | Yes |
| Training Type | VARCHAR | Internal or External delivery | Yes |
| Training Outcome | VARCHAR | Completed, Passed, Failed, Incomplete | Yes |
| Training Duration(Days) | INT | 1–5 days | Yes |
| Training Cost | DECIMAL | $100.04 – $999.97 per session | Yes |
| Trainer | VARCHAR | **Excluded** — 2,942 unique values across 3,000 rows | No |
| Location | VARCHAR | **Excluded** — 2,738 unique values across 3,000 rows | No |

`Trainer` and `Location` are near-unique per row. They form no analysable groups, so trainer effectiveness and venue effectiveness cannot be measured with this data.

## Supporting Table — `employee_data.csv`

| Column | Type | Description | Used |
|--------|------|-------------|------|
| EmpID | INT (PK) | Unique employee identifier, no duplicates, no gaps | Yes |
| StartDate | DATE | Hire date — used to flag training booked before hire | Yes |
| ExitDate | DATE | Exit date, NULL for active employees — used to flag post-exit training | Yes |
| TerminationType | VARCHAR | Unk / Voluntary / Involuntary / Resignation / Retirement | Yes |
| EmployeeStatus | VARCHAR | Active / Voluntarily Terminated / Leave of Absence / Future Start / Terminated for Cause | Yes |
| DepartmentType | VARCHAR | 6 departments — note trailing whitespace requires stripping | Yes |
| Division, Title, JobFunctionDescription | VARCHAR | Organisational detail | Context |
| Supervisor | VARCHAR | **Excluded** — 2,952 unique values across 3,000 employees; no usable hierarchy | No |
| LocationCode | INT | **Excluded** — 2,821 unique values; behaves as a random identifier | No |
| GenderCode, RaceDesc, MaritalDesc, DOB, State | Mixed | Demographic fields, outside scope | No |
| Performance Score, Current Employee Rating | Mixed | Performance fields, no before/after training measurement | No |

### Choosing the employment-status field

Three fields claim to indicate whether an employee has left, and they disagree:

| Field | Leavers identified | Rate |
|-------|-------------------|------|
| `EmployeeStatus` (terminated values) | 387 | 12.9% |
| `TerminationType` ≠ 'Unk' | 1,533 | 51.1% |
| `ExitDate` is not null | 1,533 | 51.1% |

`TerminationType` reconciles **exactly** with `ExitDate` (1,533 = 1,533), while `EmployeeStatus` contradicts `ExitDate` on **991 records** — employees flagged Active who nonetheless carry an exit date. `TerminationType` is therefore adopted as the system of record for this analysis, and the choice is documented rather than assumed.

---

## Derived Fields — `data/processed/training_spend_mart.csv`

Created in `03_data_preparation/prepare_training_data.py`.

| Column | Definition |
|--------|-----------|
| `is_effective` | Outcome is Completed or Passed |
| `effective_spend` | Cost where `is_effective`, else 0 |
| `wasted_spend` | Cost where not `is_effective`, else 0 |
| `has_left` | `TerminationType` ≠ 'Unk' |
| `spend_to_leaver` | Cost where `has_left`, else 0 |
| `date_validity` | `valid` / `after_exit` / `before_hire` |
| `is_valid_record` | `date_validity` = 'valid' |
| `tenure_at_training_years` | Years between hire date and training date |
| `cost_per_day` | Cost ÷ duration |
| `training_month` | Year-month bucket for trend analysis |

---

## Segment Reference — Budget Effectiveness by Dimension

| Dimension | Segment | Sessions | Spend | Effectiveness |
|-----------|---------|----------|-------|---------------|
| Programme | Communication Skills | 673 | $365,023 | **54.0%** |
| Programme | Customer Service | 565 | $320,575 | 53.9% |
| Programme | Leadership Development | 574 | $323,902 | 52.3% |
| Programme | Project Management | 609 | $343,313 | 48.5% |
| Programme | Technical Skills | 579 | $323,073 | **43.7%** |
| Type | Internal | 1,509 | $845,670 | 52.0% |
| Type | External | 1,491 | $830,216 | 49.1% |
| Department | Sales | 331 | $177,668 | 52.4% |
| Department | IT/IS | 430 | $242,360 | 51.6% |
| Department | Production | 2,020 | $1,130,181 | 50.2% |
| Department | Software Engineering | 115 | $68,622 | 48.6% |
| **Company-wide** | — | **3,000** | **$1,675,886** | **50.6%** |

---

## Data Availability & Access

| Item | Status |
|------|--------|
| Format | CSV, local read access |
| Completeness | 0 missing values in the training file; `ExitDate` nulls are expected (active employees) |
| Join integrity | 3,000 / 3,000 training records match an employee record |
| Date parsing | 100% parsed successfully across all date columns |
| Coverage | Full census — one training record per employee, not a sample |
| **Limitation** | No access to the finance system, so the $1,675,886 figure cannot be reconciled against the general ledger or invoices. All cost figures are taken as reported by the L&D system. |

---

## Data Quality Checks Performed

- Row and column count verification (3,000 × 9 training, 3,000 × 26 employee)
- Duplicate scan on full row and on `Employee ID` — none found
- Missing value scan across all columns — training file complete; employee file missing only `ExitDate` and `TerminationDescription`, both expected for active staff
- Referential integrity check — 100% join rate to the employee master
- Value range validation — cost $100.04–$999.97 with no zero or negative amounts; duration 1–5 days
- Categorical consistency audit — trailing whitespace detected in `DepartmentType` (e.g. `'Production       '`)
- Cardinality audit — flagged `Trainer`, `Location`, `Supervisor` and `LocationCode` as unusable
- **Temporal logic validation** — 1,317 records (43.9%) violate the employee's own employment period

**Tools used:** Python (pandas, scipy) for preparation and statistical testing, SQL for extraction, Power BI for dashboarding.
