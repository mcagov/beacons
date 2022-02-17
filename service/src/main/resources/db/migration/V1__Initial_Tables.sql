CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE IF NOT EXISTS beacons (
    id uuid PRIMARY KEY,
    beacon_type text,
    hex_id text,
    manufacturer text,
    model text,
    serial_number text,
    battery_expiry TIMESTAMP,
    last_serviced TIMESTAMP
);
CREATE TABLE IF NOT EXISTS person (
    id uuid PRIMARY KEY,
    person_type text,
    name text,
    telephone text,
    email_address text,
    address_line_1 text,
    address_line_2 text,
    address_line_3 text,
    address_line_4 text,
    address_line_5 text,
    address_line_6 text,
    address_line_7 text
);
CREATE TABLE IF NOT EXISTS beacon_person (
    id uuid PRIMARY KEY,
    beacon_id uuid REFERENCES beacons (id) NOT NULL,
    person_id uuid REFERENCES person (id) NOT NULL
);
CREATE TABLE IF NOT EXISTS vessel (
    id uuid PRIMARY KEY,
    mmsi text,
    name text,
    callsign text,
    radio_comms text,
    capacity INTEGER,
    vessel_type text
);
CREATE TABLE IF NOT EXISTS beacon_uses (
    id uuid PRIMARY KEY,
    beacon_id uuid REFERENCES beacons (id) NOT NULL,
    use_type text,
    main_use boolean NOT NULL DEFAULT false,
    beacon_person_id uuid REFERENCES beacon_person (id),
    vessel_id uuid REFERENCES vessel (id)
);