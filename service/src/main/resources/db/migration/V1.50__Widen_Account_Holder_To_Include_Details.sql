ALTER TABLE account_holder
    ADD COLUMN IF NOT EXISTS full_name text,
    ADD COLUMN IF NOT EXISTS email text,
    ADD COLUMN IF NOT EXISTS address_line_1 text,
    ADD COLUMN IF NOT EXISTS address_line_2 text,
    ADD COLUMN IF NOT EXISTS address_line_3 text,
    ADD COLUMN IF NOT EXISTS address_line_4 text,
    ADD COLUMN IF NOT EXISTS town_or_city text,
    ADD COLUMN IF NOT EXISTS postcode text,
    ADD COLUMN IF NOT EXISTS county text,
    ADD COLUMN IF NOT EXISTS country text,
    ADD COLUMN IF NOT EXISTS telephone_number text,
    ADD COLUMN IF NOT EXISTS alternative_telephone_number text,
    ADD COLUMN IF NOT EXISTS created_date timestamptz,
    ADD COLUMN IF NOT EXISTS last_modified_date timestamptz;

UPDATE account_holder
SET full_name = person.full_name,
    email = person.email,
    address_line_1 = person.address_line_1,
    address_line_2 = person.address_line_2,
    address_line_3 = person.address_line_3,
    address_line_4 = person.address_line_4,
    town_or_city = person.town_or_city,
    postcode = person.postcode,
    county = person.county,
    country = person.country,
    telephone_number = person.telephone_number,
    alternative_telephone_number = person.alternative_telephone_number,
    created_date = person.created_date,
    last_modified_date = person.last_modified_date
FROM person
WHERE account_holder.person_id = person.id;

UPDATE account_holder
SET created_date = now()
WHERE created_date is null;

UPDATE account_holder
SET last_modified_date = now()
WHERE created_date is null;

ALTER TABLE account_holder ALTER COLUMN created_date SET NOT NULL;
ALTER TABLE account_holder ALTER COLUMN last_modified_date SET NOT NULL;

ALTER TABLE account_holder ALTER COLUMN person_id DROP NOT NULL;