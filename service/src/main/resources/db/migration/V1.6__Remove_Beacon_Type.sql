-- Remove beacon type column as type can be determined by the hex id

ALTER TABLE beacon
    DROP COLUMN beacon_type;