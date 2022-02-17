-- Use a normal view for beacon records and legacy

-- Drop refresh function on materialized view table
DROP FUNCTION refresh_beacon_search_view_schedule() CASCADE;

DROP MATERIALIZED VIEW beacon_search_mat;

-- Create legacy beacon search materialized view
CREATE MATERIALIZED VIEW IF NOT EXISTS legacy_beacon_search AS
SELECT id,
       created_date,
       last_modified_date,
       beacon_status,
       hex_id,
       data->'owner'->>'ownerName' as owner_name,
       data->'owner'->>'email' as owner_email,
       (SELECT string_agg(uses->>'useType', ', ') FROM legacy_beacon AS lb, LATERAL jsonb_array_elements(data->'uses') AS uses WHERE lb.id = legacy_beacon.id GROUP BY id) AS use_activities
FROM legacy_beacon;

CREATE UNIQUE INDEX legacy_beacon_search_index ON legacy_beacon_search(id);

-- Replicate function to refresh beacon search materialized view for legacy beacons
CREATE OR REPLACE FUNCTION refresh_legacy_beacon_search_schedule()
    RETURNS VOID
    LANGUAGE plpgsql
AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY legacy_beacon_search;
END $$;

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
FROM legacy_beacon_search
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

-- Add index to improve performance on querying the view above
CREATE INDEX person_person_type ON person(person_type);