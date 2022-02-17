-- Add extra columns onto materialized view for enabling account holder to view beacons/legacy beacons

DROP MATERIALIZED VIEW beacon_search_mat;

-- Recreate beacon_search_mat from migration V1.31
CREATE MATERIALIZED VIEW IF NOT EXISTS beacon_search_mat AS
SELECT id,
       created_date,
       last_modified_date,
       beacon_status,
       hex_id,
       (SELECT full_name FROM person WHERE person.person_type = 'OWNER' AND person.beacon_id = beacon.id) AS owner_name,
       (SELECT email FROM person WHERE person.person_type = 'OWNER' AND person.beacon_id = beacon.id) AS owner_email,
       (SELECT id FROM account_holder WHERE account_holder.id = beacon.account_holder_id) AS account_holder_id,
       (SELECT REPLACE(string_agg(activity, ', '), '_', ' ') FROM beacon_use WHERE beacon_use.beacon_id = beacon.id) AS use_activities
FROM beacon
UNION
SELECT id,
       created_date,
       last_modified_date,
       beacon_status,
       hex_id,
       data->'owner'->>'ownerName' as owner_name,
       data->'owner'->>'email' as owner_email,
       NULL as account_holder_id,
       (SELECT string_agg(uses->>'useType', ', ') FROM legacy_beacon AS lb, LATERAL jsonb_array_elements(data->'uses') AS uses WHERE lb.id = legacy_beacon.id GROUP BY id) AS use_activities
FROM legacy_beacon;

CREATE UNIQUE INDEX IF NOT EXISTS beacon_search_mat_id ON beacon_search_mat(id);