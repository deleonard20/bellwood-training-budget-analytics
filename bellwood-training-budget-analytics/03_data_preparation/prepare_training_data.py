"""
Stage 03 - Data Preparation
Bellwood Networks | Training Budget Effectiveness Analysis

Business question: how do we raise training budget effectiveness
from 50.6% to 80% within 6 months?

Pipeline: extract -> clean -> transform -> aggregate

Run:     python 03_data_preparation/prepare_training_data.py
Outputs: data/processed/training_spend_mart.csv
         data/processed/agg_by_program.csv
         data/processed/agg_by_type.csv
         data/processed/agg_by_department.csv
         data/processed/kpi_summary.csv
"""
from pathlib import Path

import pandas as pd

ROOT = Path(__file__).resolve().parents[1]
RAW = ROOT / "data" / "raw"
OUT = ROOT / "data" / "processed"

# Outcomes that count as a completed investment
EFFECTIVE_OUTCOMES = ["Completed", "Passed"]

# Fiscal window under analysis (mirrors 04_analysis/sql/queries/)
PERIOD_START = pd.Timestamp("2022-08-05")
PERIOD_END = pd.Timestamp("2023-08-05")


# ---------------------------------------------------------------------
# 1. EXTRACTION - mirrors the SQL query in 04_analysis/sql/
# ---------------------------------------------------------------------
def extract() -> pd.DataFrame:
    """Pull only the columns and period the analysis needs, then join."""
    training = pd.read_csv(RAW / "training_and_development_data.csv")
    employee = pd.read_csv(RAW / "employee_data.csv", encoding="utf-8-sig")

    training = training[[
        "Employee ID", "Training Date", "Training Program Name",
        "Training Type", "Training Outcome",
        "Training Duration(Days)", "Training Cost",
    ]]
    employee = employee[[
        "EmpID", "StartDate", "ExitDate",
        "TerminationType", "EmployeeStatus", "DepartmentType",
    ]]

    df = training.merge(employee, left_on="Employee ID", right_on="EmpID", how="inner")

    df = df.rename(columns={
        "Employee ID": "employee_id",
        "Training Date": "training_date",
        "Training Program Name": "program",
        "Training Type": "training_type",
        "Training Outcome": "outcome",
        "Training Duration(Days)": "duration_days",
        "Training Cost": "cost",
        "StartDate": "start_date",
        "ExitDate": "exit_date",
        "TerminationType": "termination_type",
        "EmployeeStatus": "employee_status",
        "DepartmentType": "department",
    }).drop(columns=["EmpID"])

    print(f"[extract]   {len(df):,} rows retrieved")
    return df


# ---------------------------------------------------------------------
# 2. CLEANING
# ---------------------------------------------------------------------
def clean(df: pd.DataFrame) -> pd.DataFrame:
    """Remove duplicates, handle missing values, standardise formats."""

    # --- 2a. Remove duplicates ---------------------------------------
    before = len(df)
    df = df.drop_duplicates()
    df = df.drop_duplicates(subset=["employee_id"], keep="first")
    print(f"[clean]     duplicates removed: {before - len(df)}")

    # --- 2b. Standardise formats -------------------------------------
    # Dates: 'dd-Mmm-yy' text -> datetime
    for col in ["training_date", "start_date", "exit_date"]:
        df[col] = pd.to_datetime(df[col], format="%d-%b-%y", errors="coerce")

    # Text: strip trailing whitespace (e.g. 'Production       ')
    for col in ["program", "training_type", "outcome",
                "department", "termination_type", "employee_status"]:
        df[col] = df[col].str.strip()

    # Numeric: round cost to 2 decimals, cast duration to integer
    df["cost"] = df["cost"].round(2)
    df["duration_days"] = df["duration_days"].astype("int16")
    print("[clean]     date, text and numeric formats standardised")

    # --- 2c. Handle missing values -----------------------------------
    # A blank exit_date means the employee is still active. That is
    # information, not a defect, so it is NOT imputed - imputing it would
    # destroy the post-exit training detection in transform().
    missing = df.isna().sum()
    missing = missing[missing > 0]
    for col, n in missing.items():
        note = "expected - employee still active" if col == "exit_date" else "NEEDS REVIEW"
        print(f"[clean]     missing {col}: {n} ({note})")

    # Mandatory columns must not be null
    required = ["employee_id", "training_date", "cost", "outcome", "start_date"]
    dropped = df[required].isna().any(axis=1).sum()
    df = df.dropna(subset=required)
    print(f"[clean]     rows dropped for missing mandatory fields: {dropped}")

    # Records outside the fiscal window
    outside = ~df["training_date"].between(PERIOD_START, PERIOD_END)
    print(f"[clean]     rows outside fiscal window: {outside.sum()}")
    df = df[~outside]

    return df.reset_index(drop=True)


# ---------------------------------------------------------------------
# 3. TRANSFORMATION
# ---------------------------------------------------------------------
def transform(df: pd.DataFrame) -> pd.DataFrame:
    """Derive the fields that answer the business question directly."""

    # Budget effectiveness
    df["is_effective"] = df["outcome"].isin(EFFECTIVE_OUTCOMES)
    df["effective_spend"] = df["cost"].where(df["is_effective"], 0).round(2)
    df["wasted_spend"] = df["cost"].where(~df["is_effective"], 0).round(2)

    # Employment status. TerminationType is used rather than EmployeeStatus
    # because it reconciles exactly with ExitDate (1,533 = 1,533), whereas
    # EmployeeStatus contradicts it on 991 records.
    df["has_left"] = df["termination_type"] != "Unk"
    df["spend_to_leaver"] = df["cost"].where(df["has_left"], 0).round(2)

    # Is the training date plausible against the employment period?
    def flag_validity(row):
        if pd.notna(row["exit_date"]) and row["training_date"] > row["exit_date"]:
            return "after_exit"
        if row["training_date"] < row["start_date"]:
            return "before_hire"
        return "valid"

    df["date_validity"] = df.apply(flag_validity, axis=1)
    df["is_valid_record"] = df["date_validity"] == "valid"

    # Supporting context
    df["tenure_at_training_years"] = (
        (df["training_date"] - df["start_date"]).dt.days / 365.25
    ).round(2)
    df["cost_per_day"] = (df["cost"] / df["duration_days"]).round(2)
    df["training_month"] = df["training_date"].dt.to_period("M").astype(str)

    print(f"[transform] {df.shape[1]} analysis-ready columns")
    return df


# ---------------------------------------------------------------------
# 4. AGGREGATION
# ---------------------------------------------------------------------
def _agg(df: pd.DataFrame, by: str) -> pd.DataFrame:
    out = df.groupby(by).agg(
        sessions=("employee_id", "size"),
        total_spend=("cost", "sum"),
        effective_spend=("effective_spend", "sum"),
        wasted_spend=("wasted_spend", "sum"),
        spend_to_leaver=("spend_to_leaver", "sum"),
        invalid_records=("is_valid_record", lambda s: (~s).sum()),
    ).round(2)
    out["effectiveness_pct"] = (100 * out["effective_spend"] / out["total_spend"]).round(1)
    out["avg_cost"] = (out["total_spend"] / out["sessions"]).round(2)
    return out.sort_values("wasted_spend", ascending=False).reset_index()


def summarise(df: pd.DataFrame) -> pd.DataFrame:
    total = df["cost"].sum()
    effectiveness = 100 * df["effective_spend"].sum() / total
    rows = [
        ("Total training budget", round(total, 2), "USD"),
        ("Effective spend", round(df["effective_spend"].sum(), 2), "USD"),
        ("Non-completed spend", round(df["wasted_spend"].sum(), 2), "USD"),
        ("Budget effectiveness", round(effectiveness, 1), "%"),
        ("Target effectiveness", 80.0, "%"),
        ("Gap to target", round(80 - effectiveness, 1), "pp"),
        ("Spend on employees who left", round(df["spend_to_leaver"].sum(), 2), "USD"),
        ("Training sessions", len(df), "sessions"),
        ("Invalid-date records", int((~df["is_valid_record"]).sum()), "records"),
        ("Invalid-date records", round(100 * (~df["is_valid_record"]).mean(), 1), "%"),
        ("Spend on invalid-date records", round(df.loc[~df["is_valid_record"], "cost"].sum(), 2), "USD"),
    ]
    return pd.DataFrame(rows, columns=["metric", "value", "unit"])


# ---------------------------------------------------------------------
def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)

    df = transform(clean(extract()))

    df.to_csv(OUT / "training_spend_mart.csv", index=False)
    _agg(df, "program").to_csv(OUT / "agg_by_program.csv", index=False)
    _agg(df, "training_type").to_csv(OUT / "agg_by_type.csv", index=False)
    _agg(df, "department").to_csv(OUT / "agg_by_department.csv", index=False)
    summarise(df).to_csv(OUT / "kpi_summary.csv", index=False)

    print(f"\n[output]    5 files written to {OUT.relative_to(ROOT)}/")
    print("\n" + summarise(df).to_string(index=False))


if __name__ == "__main__":
    main()
