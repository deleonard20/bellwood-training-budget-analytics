-- =====================================================================
-- Bellwood Networks | Training Budget Effectiveness Analysis
-- Query 1 — Extraction
-- Pulls the FY Aug 2022 - Aug 2023 training budget from ~1.2M historical rows.
-- Schema: hr (see ../schema/01_create_tables.sql)
-- =====================================================================

SELECT
    -- identity
    t.employee_id,

    -- training facts
    t.training_date,
    t.training_program_name,
    t.training_type,
    t.training_outcome,
    t.training_duration_days,
    t.training_cost,

    -- employee attributes, for status and date validation
    e.start_date,
    e.exit_date,
    e.termination_type,
    e.employee_status,
    e.department_type

FROM hr.training_records AS t
INNER JOIN hr.employees AS e
        ON e.emp_id = t.employee_id

WHERE t.training_date BETWEEN DATE '2022-08-05' AND DATE '2023-08-05'
  AND t.training_cost IS NOT NULL
  AND t.training_cost > 0

ORDER BY t.employee_id;

-- Columns deliberately excluded:
--   t.trainer   -> 2,942 distinct values across 3,000 rows
--   t.location  -> 2,738 distinct values across 3,000 rows
-- Both are near-unique per row and form no analysable groups.
--
-- e.exit_date is included despite being frequently NULL, because it is
-- the field used to detect training booked after an employee had left.
