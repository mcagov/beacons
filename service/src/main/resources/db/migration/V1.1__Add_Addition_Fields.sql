ALTER TABLE beacons
    ADD COLUMN checksum text,
    ADD COLUMN created_date TIMESTAMP,
    ADD COLUMN last_modified_date TIMESTAMP,
    ADD COLUMN beacon_status text NOT NULL,
    ADD COLUMN coding text,
    ADD COLUMN protocol_code text;

ALTER TABLE person
    ADD COLUMN created_date TIMESTAMP,
    ADD COLUMN last_modified_date TIMESTAMP,
    ADD COLUMN postcode text,
    ADD COLUMN country text,
    ADD COLUMN care_of text,
    DROP COLUMN address_line_5,
    DROP COLUMN address_line_6,
    DROP COLUMN address_line_7,
    DROP COLUMN telephone;

ALTER TABLE beacon_person
    ADD COLUMN created_date TIMESTAMP,
    ADD COLUMN last_modified_date TIMESTAMP;

ALTER TABLE vessel
    ADD COLUMN created_date TIMESTAMP,
    ADD COLUMN last_modified_date TIMESTAMP,
    ADD COLUMN description text,
    DROP COLUMN mmsi,
    ADD COLUMN portable_mmsi INTEGER,
    ADD COLUMN vessel_mmsi INTEGER,
    ADD COLUMN uksr_id text,
    ADD COLUMN safetrax_id text,
    ADD COLUMN homeport text,
    ADD COLUMN area_of_use text;

ALTER TABLE vessel
    RENAME capacity TO max_capacity;

ALTER TABLE beacon_uses
    ADD COLUMN beacon_position text,
    ADD COLUMN created_date TIMESTAMP,
    ADD COLUMN last_modified_date TIMESTAMP;

CREATE TABLE IF NOT EXISTS telephone
(
    id           uuid PRIMARY KEY,
    person_id    uuid REFERENCES person (id) NOT NULL,
    telephone    text,
    relationship text
);
