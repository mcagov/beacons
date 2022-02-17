-- Add additional columns to legacy_beacon table to enable searching across
ALTER TABLE legacy_beacon
    ADD COLUMN owner_name text,
    ADD COLUMN use_activities text;

UPDATE legacy_beacon SET owner_name = data->'owner'->>'ownerName';

-- Add indexes for searching across additional columns
CREATE INDEX legacy_beacon_beacon_status ON legacy_beacon(beacon_status);
CREATE INDEX legacy_beacon_use_activities ON legacy_beacon(use_activities);

DROP MATERIALIZED VIEW legacy_beacon_search CASCADE;

-- Re-create view using top level columns on legacy_beacon table.  Taken from V1.35
CREATE OR REPLACE VIEW beacon_search AS
SELECT id,
       created_date,
       last_modified_date,
       beacon_status,
       hex_id,
       owner_name,
       owner_email,
       NULL as account_holder_id,
       use_activities
FROM legacy_beacon
UNION
SELECT id,
       created_date,
       last_modified_date,
       beacon_status,
       hex_id,
       (SELECT full_name FROM person WHERE person.person_type = 'OWNER' AND person.beacon_id = beacon.id) AS owner_name,
       (SELECT email FROM person WHERE person.person_type = 'OWNER' AND person.beacon_id = beacon.id) AS owner_email,
       (SELECT id FROM account_holder WHERE account_holder.id = beacon.account_holder_id) AS account_holder_id,
       (SELECT REPLACE(string_agg(activity, ', '), '_', ' ') FROM beacon_use WHERE beacon_use.beacon_id = beacon.id) AS use_activities
FROM beacon;