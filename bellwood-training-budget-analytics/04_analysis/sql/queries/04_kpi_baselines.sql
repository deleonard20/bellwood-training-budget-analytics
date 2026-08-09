-- =====================================================================
-- Bellwood Networks | Training Budget Effectiveness Analysis
-- Query 4 — Replacement KPI baselines
-- Budget Integrity Rate, Completion Rate on valid records, and Leakage Value.
-- Schema: hr (see ../schema/01_create_tables.sql)
-- =====================================================================

WITH scoped AS (
    SELECT t.training_cost,
           t.training_outcome,
           CASE
               WHEN e.exit_date IS NOT NULL AND t.training_date > e.exit_date THEN FALSE
               WHEN t.training_date < e.start_date                            THEN FALSE
               ELSE TRUE
           END AS is_valid_record
    FROM hr.training_records AS t
    INNER JOIN hr.employees AS e ON e.emp_id = t.employee_id
    WHERE t.training_date BETWEEN DATE '2022-08-05' AND DATE '2023-08-05'
)
SELECT
    ROUND(100.0 * SUM(training_cost) FILTER (WHERE is_valid_record)
          / SUM(training_cost), 1)                              AS budget_integrity_rate_pct,
    ROUND(100.0 * COUNT(*) FILTER (WHERE is_valid_record
              AND training_outcome IN ('Completed', 'Passed'))
          / NULLIF(COUNT(*) FILTER (WHERE is_valid_record), 0), 1)
                                                                AS completion_rate_valid_pct,
    ROUND(SUM(training_cost) FILTER (WHERE NOT is_valid_record), 2)
                                                                AS leakage_value_usd
FROM scoped;
-- Baseline: 56.1% | 51.9% | $735,145
-- Target  : 95%   | 60%   | < $50,000
