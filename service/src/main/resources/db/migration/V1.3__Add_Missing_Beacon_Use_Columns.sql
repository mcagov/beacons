-- Adds missing beacon use and person columns

ALTER TABLE beacon_use
    ADD COLUMN port_letter_number text;

ALTER TABLE beacon_use
    RENAME COLUMN mobile_telephone_input_1 TO mobile_telephone_1;

ALTER TABLE beacon_use
    RENAME COLUMN mobile_telephone_input_2 TO mobile_telephone_2;

ALTER TABLE beacon_use
    RENAME COLUMN fixed_vhf_radio_input TO fixed_vhf_radio_value;

ALTER TABLE beacon_use
    RENAME COLUMN portable_vhf_radio_input TO portable_vhf_radio_value;

ALTER TABLE beacon_use
    RENAME COLUMN satellite_telephone_input TO satellite_telephone_value;

ALTER TABLE beacon_use
    RENAME COLUMN other_environment_use TO other_environment;

ALTER TABLE beacon_person
    RENAME COLUMN country TO county;

ALTER TABLE beacon_person
    RENAME COLUMN telephone TO telephone_number;

ALTER TABLE beacon_person
    ADD COLUMN alternative_telephone_number text,
    ADD COLUMN town_or_city text;

-- Add reference to beacon table
ALTER TABLE beacon
    ADD COLUMN reference_number text;