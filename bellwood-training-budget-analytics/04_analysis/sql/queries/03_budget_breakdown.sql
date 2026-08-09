-- =====================================================================
-- Bellwood Networks | Training Budget Effectiveness Analysis
-- Query 3 — Budget breakdowns
-- Effectiveness overall, by programme, by type/department, leakage and trend.
-- Schema: hr (see ../schema/01_create_tables.sql)
-- =====================================================================

-- 3.1 Headline: overall budget effectiveness
SELECT
    ROUND(SUM(t.training_cost), 2)                                     AS total_budget,
    ROUND(SUM(t.training_cost) FILTER (WHERE t.training_outcome
          IN ('Completed', 'Passed')), 2)                              AS effective_spend,
    ROUND(SUM(t.training_cost) FILTER (WHERE t.training_outcome
          IN ('Failed', 'Incomplete')), 2)                             AS wasted_spend,
    ROUND(100.0 * SUM(t.training_cost) FILTER (WHERE t.training_outcome
          IN ('Completed', 'Passed')) / SUM(t.training_cost), 1)       AS effectiveness_pct
FROM hr.training_records AS t
WHERE t.training_date BETWEEN DATE '2022-08-05' AND DATE '2023-08-05';
-- Result: $1,675,886 | $847,484 | $828,402 | 50.6%


-- 3.2 Effectiveness by programme - the only significant driver found
SELECT
    t.training_program_name                                            AS programme,
    COUNT(*)                                                           AS sessions,
    ROUND(SUM(t.training_cost), 2)                                     AS spend,
    ROUND(100.0 * SUM(t.training_cost) FILTER (WHERE t.training_outcome
          IN ('Completed', 'Passed')) / SUM(t.training_cost), 1)       AS effectiveness_pct
FROM hr.training_records AS t
WHERE t.training_date BETWEEN DATE '2022-08-05' AND DATE '2023-08-05'
GROUP BY 1
ORDER BY effectiveness_pct;
-- Result: Technical Skills 43.7% ... Communication Skills 54.0%


-- 3.3 Effectiveness by delivery type and by department
SELECT t.training_type AS dimension_value, 'training_type' AS dimension,
       COUNT(*) AS sessions, ROUND(SUM(t.training_cost), 2) AS spend,
       ROUND(100.0 * SUM(t.training_cost) FILTER (WHERE t.training_outcome
             IN ('Completed', 'Passed')) / SUM(t.training_cost), 1) AS effectiveness_pct
FROM hr.training_records AS t
WHERE t.training_date BETWEEN DATE '2022-08-05' AND DATE '2023-08-05'
GROUP BY 1

UNION ALL

SELECT TRIM(e.department_type), 'department',
       COUNT(*), ROUND(SUM(t.training_cost), 2),
       ROUND(100.0 * SUM(t.training_cost) FILTER (WHERE t.training_outcome
             IN ('Completed', 'Passed')) / SUM(t.training_cost), 1)
FROM hr.training_records AS t
INNER JOIN hr.employees AS e ON e.emp_id = t.employee_id
WHERE t.training_date BETWEEN DATE '2022-08-05' AND DATE '2023-08-05'
GROUP BY 1

ORDER BY dimension, effectiveness_pct;


-- 3.4 Leakage: budget spent on employees who subsequently left
SELECT
    CASE WHEN e.termination_type <> 'Unk' THEN 'left' ELSE 'stayed' END AS employee_status,
    COUNT(*)                                                            AS sessions,
    ROUND(SUM(t.training_cost), 2)                                      AS spend,
    ROUND(100.0 * SUM(t.training_cost) / SUM(SUM(t.training_cost)) OVER (), 1) AS pct_of_budget
FROM hr.training_records AS t
INNER JOIN hr.employees AS e ON e.emp_id = t.employee_id
WHERE t.training_date BETWEEN DATE '2022-08-05' AND DATE '2023-08-05'
GROUP BY 1;
-- Result: left $857,430 (51.2%) | stayed $818,456 (48.8%)


-- 3.5 The headline slide: budget split by integrity AND completion
-- Four non-overlapping segments. Only the first is fully defensible.
SELECT
    CASE
        WHEN e.exit_date IS NOT NULL AND t.training_date > e.exit_date THEN 'implausible_date'
        WHEN t.training_date < e.start_date                            THEN 'implausible_date'
        ELSE 'plausible_date'
    END                                                                 AS record_integrity,
    CASE WHEN t.training_outcome IN ('Completed', 'Passed')
         THEN 'completed' ELSE 'not_completed' END                      AS completion,
    COUNT(*)                                                            AS sessions,
    ROUND(SUM(t.training_cost), 2)                                      AS spend,
    ROUND(100.0 * SUM(t.training_cost) / SUM(SUM(t.training_cost)) OVER (), 1) AS pct_of_budget
FROM hr.training_records AS t
INNER JOIN hr.employees AS e ON e.emp_id = t.employee_id
WHERE t.training_date BETWEEN DATE '2022-08-05' AND DATE '2023-08-05'
GROUP BY 1, 2
ORDER BY spend DESC;
-- Result: only $492,343 (29.4%) is both plausibly recorded AND completed


-- 3.6 Monthly trend - is this chronic or a recent spike?
SELECT
    DATE_TRUNC('month', t.training_date)::DATE                          AS month,
    COUNT(*)                                                            AS sessions,
    ROUND(SUM(t.training_cost), 2)                                      AS spend,
    ROUND(100.0 * SUM(t.training_cost) FILTER (WHERE t.training_outcome
          IN ('Completed', 'Passed')) / SUM(t.training_cost), 1)        AS effectiveness_pct
FROM hr.training_records AS t
WHERE t.training_date BETWEEN DATE '2022-08-05' AND DATE '2023-08-05'
GROUP BY 1
ORDER BY 1;
-- Result: 44.3% - 58.9% across 12 months, no significant trend (p=0.087)
