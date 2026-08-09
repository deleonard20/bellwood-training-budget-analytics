# Data Cleaning Notes — Training Budget Effectiveness Analysis

**Tool:** Python (pandas) — see `prepare_training_data.py`
**Source files:** `data/raw/training_and_development_data.csv`, `data/raw/employee_data.csv`
**Output:** `data/processed/training_spend_mart.csv` (3,000 rows × 22 columns) plus four aggregate tables

---

## Pipeline

`extract → clean → transform → aggregate`

The extraction step mirrors `04_analysis/sql/queries/` — the same column selection, join and fiscal-window filter, so the Python pipeline and the SQL query return identical result sets.

---

## Cleaning Steps Performed

### 1. Remove duplicates
Checked for exact duplicate rows and duplicate `Employee ID` values. **0 duplicates found** — the dataset holds exactly one training record per employee.

### 2. Standardise formats
- **Dates** — `Training Date`, `StartDate` and `ExitDate` parsed from `dd-Mmm-yy` text into datetime. 100% parsed successfully, no coercion failures.
- **Text** — trailing whitespace stripped from all categorical columns. `DepartmentType` carried padding (`'Production       '`) that would have split a single department into two groups in any `GROUP BY`.
- **Encoding** — `employee_data.csv` read with `utf-8-sig` to strip a byte-order mark that otherwise corrupts the first column name.
- **Numeric** — cost rounded to 2 decimals, duration cast to integer.

### 3. Handle missing values
Only `ExitDate` is missing (1,467 rows), and **it was deliberately left as null**.

A blank exit date means the employee is still employed. Imputing it — with a far-future date, the period end, or any placeholder — would silently destroy the post-exit training detection that turned out to be the central finding of this analysis. The null carries meaning and is encoded explicitly through the `has_left` and `date_validity` flags instead.

Mandatory fields (`employee_id`, `training_date`, `cost`, `outcome`, `start_date`) were checked for nulls: **0 rows dropped**.

### 4. Validate value ranges
- `Training Cost`: $100.04 – $999.97, no zero or negative amounts, no IQR outliers
- `Training Duration(Days)`: 1–5 days, no invalid values
- All 3,000 training dates fall inside the declared fiscal window — 0 rows excluded

### 5. Verify referential integrity
All 3,000 training records match an employee in the master table (100% join rate). No orphan records.

---

## Temporal Logic Validation

This is the check that a standard cleaning routine would not perform, and it produced the analysis's largest finding.

Each training date was tested against the employee's own employment period:

| Rule | Violations | Spend |
|------|-----------|-------|
| Training date **after** the employee's exit date | 1,029 | $574,242 |
| Training date **before** the employee's hire date | 288 | $160,903 |
| **Total** | **1,317 (43.9%)** | **$735,145** |

The violations are not rounding-level discrepancies. Post-exit training sits a **median of 358 days** after the exit date, with the furthest case at **1,677 days — 4.6 years**. One employee who left in November 2018 is recorded as having attended a course in July 2023 and passed it.

These rows were **retained, not deleted.** Removing them would have hidden the finding and produced a misleadingly clean baseline. They are flagged via `date_validity` so that every downstream metric can be reported both with and without them.

---

## Transformation

Ten derived fields were added to make the mart answer the business question directly rather than requiring recalculation downstream:

| Field | Purpose |
|-------|---------|
| `is_effective`, `effective_spend`, `wasted_spend` | Budget effectiveness |
| `has_left`, `spend_to_leaver` | Leakage to departing employees |
| `date_validity`, `is_valid_record` | Record integrity |
| `tenure_at_training_years`, `cost_per_day`, `training_month` | Supporting context and trend analysis |

`TerminationType` was chosen over `EmployeeStatus` as the leaver indicator. The reasoning is documented in `02_data_discovery/data_dictionary.md` — the two fields disagree on 991 records, and only `TerminationType` reconciles with `ExitDate`.

---

## Outcome

The dataset required no imputation and no deduplication — on conventional quality dimensions (completeness, uniqueness, validity of values) it passes cleanly. That is precisely why the temporal check mattered: **43.9% of records are internally inconsistent despite every standard quality check returning green.**

The prepared mart carries all 3,000 rows with integrity flags attached, feeding the statistical testing in `04_analysis/` and the Power BI dashboard in `dashboard/`.
