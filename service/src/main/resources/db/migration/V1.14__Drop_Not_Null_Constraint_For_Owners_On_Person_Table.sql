-- Remove NOT NULL constraint on person table when the person type is 'OWNER'
ALTER TABLE person
    DROP CONSTRAINT beacon_owner_email_not_null_constraint;