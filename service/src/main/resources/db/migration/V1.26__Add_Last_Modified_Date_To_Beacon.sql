ALTER TABLE beacon
    ADD COLUMN last_modified_date timestamp;

UPDATE beacon
    SET last_modified_date = created_date;

ALTER TABLE beacon
    ALTER COLUMN last_modified_date SET NOT NULL;