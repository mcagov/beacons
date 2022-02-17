-- Update beacon tables to reflect correct models
ALTER TABLE beacons
    RENAME TO beacon;

ALTER TABLE beacon
    RENAME COLUMN battery_expiry TO battery_expiry_date;

ALTER TABLE beacon
    RENAME COLUMN last_serviced TO last_serviced_date;

ALTER TABLE beacon
    RENAME COLUMN serial_number TO manufacturer_serial_number;

CREATE INDEX beacon_hex_id_index ON beacon(hex_id);

ALTER TABLE beacon
    ALTER COLUMN beacon_type SET NOT NULL,
    ALTER COLUMN manufacturer SET NOT NULL,
    ALTER COLUMN model SET NOT NULL,
    ALTER COLUMN hex_id SET NOT NULL,
    ALTER COLUMN manufacturer_serial_number SET NOT NULL,
    ADD COLUMN chk_code text,
    ALTER COLUMN beacon_status SET DEFAULT 'NEW',
    DROP COLUMN checksum,
    DROP COLUMN coding,
    DROP COLUMN last_modified_date,
    DROP COLUMN protocol_code;

-- Update beacon use table
ALTER TABLE beacon_uses
    RENAME TO beacon_use;

ALTER TABLE beacon_use
    RENAME COLUMN use_type TO environment;

ALTER TABLE beacon_use
    ALTER COLUMN environment SET NOT NULL,
    ADD COLUMN other_environment_use text,
    ADD COLUMN activity text NOT NULL,
    ADD COLUMN other_activity text,
    ADD COLUMN call_sign text,
    ADD COLUMN vhf_radio boolean,
    ADD COLUMN fixed_vhf_radio boolean,
    ADD COLUMN fixed_vhf_radio_input text,
    ADD COLUMN portable_vhf_radio boolean,
    ADD COLUMN portable_vhf_radio_input text,
    ADD COLUMN satellite_telephone boolean,
    ADD COLUMN satellite_telephone_input text,
    ADD COLUMN mobile_telephone boolean,
    ADD COLUMN mobile_telephone_input_1 text,
    ADD COLUMN mobile_telephone_input_2 text,
    ADD COLUMN purpose text,
    ADD COLUMN max_capacity text,
    ADD COLUMN vessel_name text,
    ADD COLUMN homeport text,
    ADD COLUMN area_of_operation text,
    ADD COLUMN beacon_location text,
    ADD COLUMN imo_number text,
    ADD COLUMN ssr_number text,
    ADD COLUMN official_number text,
    ADD COLUMN rig_platform_location text,
    ADD COLUMN aircraft_manufacturer text,
    ADD COLUMN principal_airport text,
    ADD COLUMN secondary_airport text,
    ADD COLUMN registration_mark text,
    ADD COLUMN hex_address text,
    ADD COLUMN cn_or_msn_number text,
    ADD COLUMN dongle boolean,
    ADD COLUMN working_remotely_location text,
    ADD COLUMN working_remotely_people_count text,
    ADD COLUMN windfarm_location text,
    ADD COLUMN windfarm_people_count text,
    ADD COLUMN other_activity_location text,
    ADD COLUMN other_activity_people_count text,
    ADD COLUMN more_details text NOT NULL,
    DROP COLUMN last_modified_date,
    DROP COLUMN beacon_person_id,
    DROP COLUMN vessel_id;

CREATE INDEX beacon_use_activity ON beacon_use(activity);

-- Drop beacon_person table in favour of using person table
DROP TABLE beacon_person;

-- Update person table
ALTER TABLE person
    RENAME TO beacon_person;

ALTER TABLE beacon_person
    RENAME COLUMN email_address TO email;

ALTER TABLE beacon_person
    RENAME COLUMN name TO full_name;

ALTER TABLE beacon_person
    ADD COLUMN telephone text,
    ADD COLUMN beacon_id uuid REFERENCES beacon(id) NOT NULL,
    ALTER COLUMN person_type SET NOT NULL,
    DROP COLUMN last_modified_date,
    DROP COLUMN care_of;

ALTER TABLE beacon_person
    ADD CONSTRAINT beacon_owner_email_not_null_constraint
        CHECK ( NOT (email IS NULL AND person_type = 'OWNER'::text) );

-- Drop table vessel and capture all fields on the beacon_use table until we allow users to create/manage vessels/aircrafts
DROP TABLE vessel;

-- Drop unused telephone table
DROP TABLE telephone;