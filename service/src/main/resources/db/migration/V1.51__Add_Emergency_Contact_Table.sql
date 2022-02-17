CREATE TABLE IF NOT EXISTS emergency_contact
(
    id                           uuid PRIMARY KEY,
    beacon_id                    uuid REFERENCES beacon (id),
    created_date                 timestamp with time zone,
    last_modified_date           timestamp with time zone,
    full_name                    text,
    telephone_number             text,
    alternative_telephone_number text
);

INSERT INTO emergency_contact
(
     id,
     full_name,
     telephone_number,
     alternative_telephone_number,
     created_date,
     last_modified_date,
     beacon_id
)
SELECT
       id,
       full_name,
       telephone_number,
       alternative_telephone_number,
       created_date,
       last_modified_date,
       beacon_id
FROM person
WHERE person.person_type = 'EMERGENCY_CONTACT';


UPDATE emergency_contact
SET created_date = now()
WHERE created_date is null;

UPDATE emergency_contact
SET last_modified_date = now()
WHERE created_date is null;

ALTER TABLE emergency_contact
    ALTER COLUMN created_date SET NOT NULL;
ALTER TABLE emergency_contact
    ALTER COLUMN last_modified_date SET NOT NULL;