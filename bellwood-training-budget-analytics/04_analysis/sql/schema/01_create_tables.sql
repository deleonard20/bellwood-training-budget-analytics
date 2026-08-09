-- =====================================================================
-- Bellwood Networks | Training Budget Effectiveness Analysis
-- Schema DDL — PostgreSQL
--
-- Source system model. The analysis reads two tables from the HR data
-- warehouse: an employee master and a training fact table. This script
-- recreates that model so the queries in ../queries/ can be run against
-- a local database loaded from data/raw/.
-- =====================================================================

DROP SCHEMA IF EXISTS hr CASCADE;
CREATE SCHEMA hr;


-- ---------------------------------------------------------------------
-- hr.employees — employee master (3,000 rows)
-- ---------------------------------------------------------------------
CREATE TABLE hr.employees (
    emp_id              INTEGER      PRIMARY KEY,
    first_name          VARCHAR(50),
    last_name           VARCHAR(50),
    start_date          DATE         NOT NULL,
    exit_date           DATE,                    -- NULL = still employed
    title               VARCHAR(80),
    business_unit       VARCHAR(10),
    employee_status     VARCHAR(30),
    employee_type       VARCHAR(20),
    pay_zone            VARCHAR(10),
    termination_type    VARCHAR(20),             -- 'Unk' = still employed
    department_type     VARCHAR(40),
    division            VARCHAR(40),
    date_of_birth       DATE,
    state               CHAR(2),
    gender_code         VARCHAR(10),
    race_desc           VARCHAR(20),
    marital_desc        VARCHAR(20),
    performance_score   VARCHAR(20),
    employee_rating     SMALLINT,

    -- an exit can never precede a hire
    CONSTRAINT chk_employment_period
        CHECK (exit_date IS NULL OR exit_date >= start_date)
);

COMMENT ON COLUMN hr.employees.termination_type IS
    'System of record for leaver status. Reconciles exactly with exit_date '
    '(1,533 = 1,533), whereas employee_status contradicts it on 991 rows.';


-- ---------------------------------------------------------------------
-- hr.training_records — training fact table (3,000 rows)
-- ---------------------------------------------------------------------
CREATE TABLE hr.training_records (
    training_id            SERIAL       PRIMARY KEY,
    employee_id            INTEGER      NOT NULL,
    training_date          DATE         NOT NULL,
    training_program_name  VARCHAR(60)  NOT NULL,
    training_type          VARCHAR(20)  NOT NULL,   -- Internal | External
    training_outcome       VARCHAR(20)  NOT NULL,   -- Completed | Passed | Failed | Incomplete
    training_duration_days SMALLINT     NOT NULL,
    training_cost          NUMERIC(10,2) NOT NULL,
    trainer                VARCHAR(80),             -- excluded from analysis: 2,942 distinct / 3,000 rows
    location               VARCHAR(80),             -- excluded from analysis: 2,738 distinct / 3,000 rows

    CONSTRAINT fk_training_employee
        FOREIGN KEY (employee_id) REFERENCES hr.employees (emp_id),
    CONSTRAINT chk_training_cost     CHECK (training_cost > 0),
    CONSTRAINT chk_training_duration CHECK (training_duration_days BETWEEN 1 AND 30),
    CONSTRAINT chk_training_outcome
        CHECK (training_outcome IN ('Completed', 'Passed', 'Failed', 'Incomplete'))
);


-- ---------------------------------------------------------------------
-- Indexes — supporting the join and the fiscal-window filter
-- ---------------------------------------------------------------------
CREATE INDEX idx_training_employee  ON hr.training_records (employee_id);
CREATE INDEX idx_training_date      ON hr.training_records (training_date);
CREATE INDEX idx_training_program   ON hr.training_records (training_program_name);
CREATE INDEX idx_training_outcome   ON hr.training_records (training_outcome);
CREATE INDEX idx_employees_dates    ON hr.employees (start_date, exit_date);
CREATE INDEX idx_employees_dept     ON hr.employees (department_type);


-- =====================================================================
-- THE CONSTRAINT THAT DOES NOT EXIST IN THE SOURCE SYSTEM
-- ---------------------------------------------------------------------
-- The production enrolment system has no rule tying the training date to
-- the employee's employment period. That single omission is the root
-- cause identified by this analysis: 1,317 records (43.9%, $735,145)
-- fall outside the employee's own hire-to-exit window.
--
-- Recommendation 1 in 06_action/recommendations.md is, in database
-- terms, this constraint:
-- =====================================================================

-- ALTER TABLE hr.training_records
--     ADD CONSTRAINT chk_training_within_employment
--     CHECK (
--         training_date >= (SELECT start_date FROM hr.employees
--                            WHERE emp_id = employee_id)
--         AND (
--             (SELECT exit_date FROM hr.employees WHERE emp_id = employee_id) IS NULL
--             OR training_date <= (SELECT exit_date FROM hr.employees
--                                   WHERE emp_id = employee_id)
--         )
--     );

-- PostgreSQL does not allow subqueries inside CHECK constraints, so in
-- practice this is enforced by a BEFORE INSERT OR UPDATE trigger:

CREATE OR REPLACE FUNCTION hr.validate_training_within_employment()
RETURNS TRIGGER AS $$
DECLARE
    v_start DATE;
    v_exit  DATE;
BEGIN
    SELECT start_date, exit_date INTO v_start, v_exit
    FROM hr.employees WHERE emp_id = NEW.employee_id;

    IF NEW.training_date < v_start THEN
        RAISE EXCEPTION
            'Training date % precedes hire date % for employee %',
            NEW.training_date, v_start, NEW.employee_id;
    END IF;

    IF v_exit IS NOT NULL AND NEW.training_date > v_exit THEN
        RAISE EXCEPTION
            'Training date % follows exit date % for employee %',
            NEW.training_date, v_exit, NEW.employee_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Enable once the historical audit in Recommendation 3 is complete:
-- CREATE TRIGGER trg_validate_training_period
--     BEFORE INSERT OR UPDATE ON hr.training_records
--     FOR EACH ROW EXECUTE FUNCTION hr.validate_training_within_employment();


-- ---------------------------------------------------------------------
-- Loading from data/raw/
-- ---------------------------------------------------------------------
-- \COPY hr.employees FROM 'data/raw/employee_data.csv' CSV HEADER;
-- \COPY hr.training_records FROM 'data/raw/training_and_development_data.csv' CSV HEADER;
--
-- Row count verification:
--   SELECT COUNT(*) FROM hr.employees;         -- expect 3,000
--   SELECT COUNT(*) FROM hr.training_records;  -- expect 3,000
--
-- FK integrity check:
--   SELECT COUNT(*) FROM hr.training_records t
--   LEFT JOIN hr.employees e ON e.emp_id = t.employee_id
--   WHERE e.emp_id IS NULL;                    -- expect 0
