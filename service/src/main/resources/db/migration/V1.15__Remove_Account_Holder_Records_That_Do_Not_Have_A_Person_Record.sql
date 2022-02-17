-- Remove orphaned account holders from account_holder table
DELETE FROM account_holder WHERE person_id IS NULL;

ALTER TABLE account_holder
    ALTER COLUMN person_id SET NOT NULL;