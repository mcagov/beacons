ALTER TABLE account_holder
    --  Remove columns duplicated from the beacon_person table
    DROP COLUMN email,
    DROP COLUMN full_name,
    DROP COLUMN telephone_number,
    DROP COLUMN alternative_telephone_number,
    DROP COLUMN address_line_1,
    DROP COLUMN address_line_2,
    DROP COLUMN address_line_3,
    DROP COLUMN address_line_4,
    DROP COLUMN town_or_city,
    DROP COLUMN postcode,
    DROP COLUMN county,
    --  Create foreign key column with constraint
    ADD COLUMN person_id uuid,
    ADD FOREIGN KEY (person_id) REFERENCES person (id);


ALTER TABLE person
    -- Remove NOT NULL constraint on beacon_id so that an account holder can be created without an associated beacon
    -- being necessary
    ALTER COLUMN beacon_id DROP NOT NULL;