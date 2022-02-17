-- Change all timestamp types to timestamp with time zone
-- This should fix issues in the back office application where the time appears
-- to off by one hour

-- Drop beacon_search_mat otherwise we can't change columns referenced in view.
DROP MATERIALIZED VIEW beacon_search_mat;

ALTER TABLE beacon
    ALTER COLUMN created_date TYPE timestamp with time zone,
    ALTER COLUMN last_modified_date TYPE timestamp with time zone;
    
ALTER TABLE beacon_use
    ALTER COLUMN created_date TYPE timestamp with time zone;

ALTER TABLE legacy_beacon
    ALTER COLUMN created_date TYPE timestamp with time zone,
    ALTER COLUMN last_modified_date TYPE timestamp with time zone;

ALTER TABLE note
    ALTER COLUMN created_date TYPE timestamp with time zone;

ALTER TABLE person
    ALTER COLUMN created_date TYPE timestamp with time zone,
    ALTER COLUMN last_modified_date TYPE timestamp with time zone;

-- Recreate beacon_search_mat from migration V1.28
CREATE MATERIALIZED VIEW IF NOT EXISTS beacon_search_mat AS
    SELECT id,
           last_modified_date,
           beacon_status,
           hex_id,
           (SELECT full_name FROM person WHERE person.person_type = 'OWNER' AND person.beacon_id = beacon.id) AS owner_name,
           (SELECT string_agg(activity, ', ') FROM beacon_use WHERE beacon_use.beacon_id = beacon.id) AS use_activities
    FROM beacon
        UNION
    SELECT id,
           last_modified_date,
           beacon_status,
           hex_id,
           data->'owner'->>'ownerName' as owner_name,
           (SELECT string_agg(uses->>'useType', ', ') FROM legacy_beacon AS lb, LATERAL jsonb_array_elements(data->'uses') AS uses WHERE lb.id = legacy_beacon.id GROUP BY id) AS use_activities
    FROM legacy_beacon;

CREATE UNIQUE INDEX IF NOT EXISTS beacon_search_mat_id ON beacon_search_mat(id);
