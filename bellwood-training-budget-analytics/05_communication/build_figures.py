"""
Stage 05 - Communication | Data Visualization
Bellwood Networks | Training Budget Effectiveness Analysis

Builds the five stakeholder-facing figures. Every chart carries one
message, and the title states the conclusion rather than the axis.

Run:     python 05_communication/build_figures.py
Outputs: 05_communication/figures/*.png
"""
from pathlib import Path

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.ticker as mticker
import pandas as pd

ROOT = Path(__file__).resolve().parents[1]
FIG = ROOT / "05_communication" / "figures"
FIG.mkdir(parents=True, exist_ok=True)

df = pd.read_csv(ROOT / "data" / "processed" / "training_spend_mart.csv",
                 parse_dates=["training_date", "start_date", "exit_date"])

# Colour is used as meaning: red = problem, amber = caution, green = target
RED, AMBER, BLUE, GREEN = "#C0392B", "#E67E22", "#2E5F8A", "#1E8449"
TARGET = 80.0

plt.rcParams.update({
    "font.size": 10, "axes.titlesize": 13, "axes.titleweight": "bold",
    "axes.spines.top": False, "axes.spines.right": False,
    "figure.facecolor": "white", "axes.facecolor": "white",
})

total = df["cost"].sum()
baseline = 100 * df["effective_spend"].sum() / total


def save(fig, name):
    fig.tight_layout()
    fig.savefig(FIG / name, dpi=150, bbox_inches="tight")
    plt.close(fig)
    print(f"  saved: 05_communication/figures/{name}")


# ---------------------------------------------------------------- 1
def fig_gap_to_target():
    """How far the available levers actually get us."""
    best = df[df["is_valid_record"] & (df["program"] != "Technical Skills")]
    eff_best = 100 * best["effective_spend"].sum() / best["cost"].sum()

    labels = ["Current", "After every\navailable fix", "Management\ntarget"]
    vals = [baseline, eff_best, TARGET]

    fig, ax = plt.subplots(figsize=(8.5, 5))
    bars = ax.bar(labels, vals, color=[RED, AMBER, GREEN], width=0.55)
    for b, v in zip(bars, vals):
        ax.text(b.get_x() + b.get_width() / 2, v + 1.8, f"{v:.1f}%",
                ha="center", fontweight="bold", fontsize=13)

    xgap = 1.5
    ax.annotate("", xy=(xgap, eff_best), xytext=(xgap, TARGET),
                arrowprops=dict(arrowstyle="<->", color=RED, lw=2))
    ax.text(xgap - 0.06, (eff_best + TARGET) / 2,
            f"{TARGET - eff_best:.1f} pp\nunexplained by\nany available data",
            color=RED, fontweight="bold", va="center", ha="right", fontsize=10)

    ax.set_ylim(0, 95)
    ax.set_ylabel("Training budget effectiveness (%)")
    ax.set_title("The 80% target is unreachable with the levers we have")
    ax.yaxis.set_major_formatter(mticker.PercentFormatter())
    save(fig, "01_gap_to_target.png")


# ---------------------------------------------------------------- 2
def fig_budget_flow():
    """Non-overlapping split of every dollar spent."""
    g = df.groupby(["is_valid_record", "is_effective"])["cost"].sum()
    seg = {
        "Plausible record &\ncompleted": g.get((True, True), 0),
        "Plausible record &\nnot completed": g.get((True, False), 0),
        "Implausible date &\ncompleted": g.get((False, True), 0),
        "Implausible date &\nnot completed": g.get((False, False), 0),
    }
    colors = [GREEN, AMBER, RED, RED]

    fig, ax = plt.subplots(figsize=(9.5, 5))
    bars = ax.barh(list(seg.keys())[::-1], list(seg.values())[::-1],
                   color=colors[::-1], height=0.6)
    for b, v in zip(bars, list(seg.values())[::-1]):
        ax.text(v + 12000, b.get_y() + b.get_height() / 2,
                f"${v:,.0f}  ({100*v/total:.1f}%)", va="center", fontweight="bold")

    ax.set_xlim(0, max(seg.values()) * 1.35)
    ax.set_xlabel("Budget (USD)")
    ax.set_title(f"Where the ${total:,.0f} training budget actually went")
    ax.xaxis.set_major_formatter(mticker.FuncFormatter(lambda x, _: f"${x/1000:,.0f}K"))
    save(fig, "02_budget_flow.png")


# ---------------------------------------------------------------- 3
def fig_effectiveness_by_program():
    """Even the best programme falls far short."""
    p = (df.groupby("program")
           .apply(lambda x: pd.Series({
               "eff": 100 * x["effective_spend"].sum() / x["cost"].sum(),
               "spend": x["cost"].sum()}), include_groups=False)
           .sort_values("eff"))

    fig, ax = plt.subplots(figsize=(9.5, 5))
    colors = [RED if v < 50 else AMBER for v in p["eff"]]
    bars = ax.barh(p.index, p["eff"], color=colors, height=0.6)
    for b, (_, row) in zip(bars, p.iterrows()):
        ax.text(row["eff"] + 1, b.get_y() + b.get_height() / 2,
                f"{row['eff']:.1f}%   (${row['spend']:,.0f})", va="center", fontweight="bold")

    ax.axvline(TARGET, color=GREEN, ls="--", lw=2)
    # label sits under the line, inside the axes, so it cannot collide with the title
    ax.set_ylim(-0.95, len(p) - 0.45)
    ax.text(TARGET, -0.62, f"target {TARGET:.0f}%", color=GREEN,
            fontweight="bold", ha="center", va="center")
    ax.set_xlim(0, 100)
    ax.set_xlabel("Budget effectiveness (%)")
    ax.set_title("Even the best programme sits 26 points below target")
    ax.xaxis.set_major_formatter(mticker.PercentFormatter())
    save(fig, "03_effectiveness_by_program.png")


# ---------------------------------------------------------------- 4
def fig_monthly_trend():
    """Chronic, not incidental."""
    m = df[df["training_month"] < "2023-08"].groupby("training_month").apply(
        lambda x: 100 * x["effective_spend"].sum() / x["cost"].sum(), include_groups=False)

    fig, ax = plt.subplots(figsize=(10, 5))
    ax.plot(m.index, m.values, marker="o", color=BLUE, lw=2, markersize=6)
    ax.axhline(TARGET, color=GREEN, ls="--", lw=2)
    ax.text(0, TARGET + 1.5, f"target {TARGET:.0f}%", color=GREEN, fontweight="bold")
    ax.axhline(m.mean(), color=RED, ls=":", lw=2)
    ax.text(0, m.mean() - 4, f"average {m.mean():.1f}%", color=RED, fontweight="bold")
    ax.fill_between(m.index, m.values, TARGET, color=RED, alpha=0.07)

    ax.set_ylim(30, 90)
    ax.set_ylabel("Budget effectiveness (%)")
    ax.set_title("Across 12 months, never once close to target")
    ax.tick_params(axis="x", rotation=45)
    ax.yaxis.set_major_formatter(mticker.PercentFormatter())
    save(fig, "04_monthly_trend.png")


# ---------------------------------------------------------------- 5
def fig_post_exit_anomaly():
    """Training booked for people who had already left."""
    a = df[df["date_validity"] == "after_exit"].copy()
    a["days"] = (a["training_date"] - a["exit_date"]).dt.days

    fig, ax = plt.subplots(figsize=(10, 5))
    ax.hist(a["days"], bins=40, color=RED, alpha=0.8, edgecolor="white")
    ax.axvline(a["days"].median(), color="black", ls="--", lw=2)
    ax.text(a["days"].median() + 30, ax.get_ylim()[1] * 0.9,
            f"median {a['days'].median():.0f} days", fontweight="bold")
    ax.annotate(f"furthest case: {a['days'].max():.0f} days\n"
                f"(~{a['days'].max()/365:.1f} years after leaving)",
                xy=(a["days"].max(), 3),
                xytext=(a["days"].max() - 640, ax.get_ylim()[1] * 0.55),
                arrowprops=dict(arrowstyle="->", color="black", lw=1.5),
                fontweight="bold", color=RED)

    ax.set_xlabel("Days between training date and the employee's exit date")
    ax.set_ylabel("Number of records")
    ax.set_title(f"{len(a):,} training sessions booked for employees who had already left "
                 f"(${a['cost'].sum():,.0f})")
    save(fig, "05_post_exit_anomaly.png")


if __name__ == "__main__":
    print("Building Stage 05 figures...")
    fig_gap_to_target()
    fig_budget_flow()
    fig_effectiveness_by_program()
    fig_monthly_trend()
    fig_post_exit_anomaly()
    print(f"\nDone - 5 figures in {FIG.relative_to(ROOT)}/")
