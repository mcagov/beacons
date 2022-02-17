-- Removes unused other_environment column from beacon_use table

ALTER TABLE beacon_use
    DROP COLUMN other_environment;