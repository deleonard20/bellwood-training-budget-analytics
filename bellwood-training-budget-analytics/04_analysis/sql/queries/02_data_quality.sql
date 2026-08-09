-- =====================================================================
-- Bellwood Networks | Training Budget Effectiveness Analysis
-- Query 2 — Data quality & integrity checks
-- Row counts, leaver-field reconciliation, and the temporal logic violations.
-- Schema: hr (see ../schema/01_create_tables.sql)
-- =====================================================================

-- 2.1 Row count, duplicate and join integrity
SELECT
    COUNT(*)                                   AS total_records,
    COUNT(DISTINCT t.employee_id)              AS distinct_employees,
    COUNT(*) - COUNT(DISTINCT t.employee_id)   AS duplicate_records,
    SUM(CASE WHEN e.emp_id IS NULL THEN 1 ELSE 0 END) AS orphan_records
FROM hr.training_records AS t
LEFT JOIN hr.employees AS e ON e.emp_id = t.employee_id
WHERE t.training_date BETWEEN DATE '2022-08-05' AND DATE '2023-08-05';


-- 2.2 Which field should define "has left"?
-- Three fields disagree. This query quantifies the disagreement.
SELECT
    COUNT(*) FILTER (WHERE e.employee_status IN
        ('Voluntarily Terminated', 'Terminated for Cause'))      AS leavers_by_status,
    COUNT(*) FILTER (WHERE e.termination_type <> 'Unk')          AS leavers_by_term_type,
    COUNT(*) FILTER (WHERE e.exit_date IS NOT NULL)              AS leavers_by_exit_date,
    COUNT(*) FILTER (WHERE e.employee_status = 'Active'
                       AND e.exit_date IS NOT NULL)              AS active_but_has_exit_date
FROM hr.employees AS e;
-- Result: 387 / 1,533 / 1,533 / 991
-- termination_type reconciles exactly with exit_date, so it is adopted.


-- 2.3 Temporal logic violations - the core integrity failure
SELECT
    CASE
        WHEN e.exit_date IS NOT NULL
             AND t.training_date > e.exit_date  THEN 'after_exit'
        WHEN t.training_date < e.start_date     THEN 'before_hire'
        ELSE 'valid'
    END                                        AS date_validity,
    COUNT(*)                                   AS records,
    ROUND(SUM(t.training_cost), 2)             AS spend,
    ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 1) AS pct_of_records
FROM hr.training_records AS t
INNER JOIN hr.employees AS e ON e.emp_id = t.employee_id
WHERE t.training_date BETWEEN DATE '2022-08-05' AND DATE '2023-08-05'
GROUP BY 1
ORDER BY records DESC;
-- Result: valid 1,683 | after_exit 1,029 ($574,242) | before_hire 288 ($160,903)


-- 2.4 How far past the exit date does post-exit training sit?
SELECT
    COUNT(*)                                                  AS records,
    ROUND(AVG(t.training_date - e.exit_date))                 AS avg_days_after_exit,
    PERCENTILE_CONT(0.5) WITHIN GROUP
        (ORDER BY t.training_date - e.exit_date)               AS median_days_after_exit,
    MAX(t.training_date - e.exit_date)                        AS max_days_after_exit
FROM hr.training_records AS t
INNER JOIN hr.employees AS e ON e.emp_id = t.employee_id
WHERE e.exit_date IS NOT NULL
  AND t.training_date > e.exit_date
  AND t.training_date BETWEEN DATE '2022-08-05' AND DATE '2023-08-05';
-- Result: 1,029 records | median 358 days | max 1,677 days (4.6 years)
