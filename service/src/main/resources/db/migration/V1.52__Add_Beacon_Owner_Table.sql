CREATE TABLE IF NOT EXISTS beacon_owner (
    id uuid PRIMARY KEY,
    beacon_id uuid REFERENCES beacon (id),
    created_date timestamp with time zone,
    last_modified_date timestamp with time zone,
    full_name text,
    email text,
    address_line_1 text,
    address_line_2 text,
    address_line_3 text,
    address_line_4 text,
    postcode text,
    county text,
    town_or_city text,
    country text,
    telephone_number text,
    alternative_telephone_number text
);

INSERT INTO beacon_owner (
    id,
    beacon_id,
    created_date,
    last_modified_date,
    full_name,
    email,
    address_line_1,
    address_line_2,
    address_line_3,
    address_line_4,
    postcode,
    county,
    town_or_city,
    country,
    telephone_number,
    alternative_telephone_number
)
SELECT
    id,
    beacon_id,
    created_date,
    last_modified_date,
    full_name,
    email,
    address_line_1,
    address_line_2,
    address_line_3,
    address_line_4,
    postcode,
    county,
    town_or_city,
    country,
    telephone_number,
    alternative_telephone_number
FROM person
WHERE person.beacon_id is not null and person.person_type = 'OWNER';

UPDATE beacon_owner
SET created_date = now()
WHERE created_date is null;

UPDATE beacon_owner
SET last_modified_date = now()
WHERE created_date is null;

ALTER TABLE beacon_owner ALTER COLUMN created_date SET NOT NULL;
ALTER TABLE beacon_owner ALTER COLUMN last_modified_date SET NOT NULL;