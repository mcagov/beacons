-- Add additional columns required for the data migration
ALTER TABLE person
    ADD COLUMN alternative_telephone_number_2 text,
    ADD COLUMN telephone_number_2 text,
    ADD COLUMN last_modified_date timestamp,
    ADD COLUMN country text,
    ADD COLUMN company_name text,
    ADD COLUMN care_of text,
    ADD COLUMN fax text,
    ADD COLUMN is_main text,
    ADD COLUMN create_user_id integer,
    ADD COLUMN update_user_id integer,
    ADD COLUMN versioning integer;

ALTER TABLE person ALTER COLUMN created_date SET NOT NULL;

UPDATE person SET last_modified_date = created_date;

ALTER TABLE person ALTER COLUMN last_modified_date SET NOT NULL;