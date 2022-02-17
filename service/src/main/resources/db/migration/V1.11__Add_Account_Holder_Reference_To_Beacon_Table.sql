ALTER TABLE beacon_person
    RENAME TO person;

ALTER TABLE beacon
    ADD COLUMN account_holder_id uuid REFERENCES beacon_account_holder (id);
