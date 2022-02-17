-- Create a single view of beacons from the beacon and legacy_beacon tables
CREATE MATERIALIZED VIEW beacon_search_mat AS
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

CREATE UNIQUE INDEX beacon_search_mat_id ON beacon_search_mat(id);

-- Create function to refresh the beacon search materialized view
CREATE OR REPLACE FUNCTION refresh_beacon_search_view()
    RETURNS TRIGGER
    LANGUAGE plpgsql
AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY beacon_search_mat;
    RETURN NULL;
END $$;

-- Create a trigger to refresh the beacon search materialized view on inserts into the legacy beacon table
CREATE TRIGGER refresh_beacon_search_on_insert_into_legacy_beacons
    AFTER INSERT
    ON legacy_beacon
    FOR EACH STATEMENT
    EXECUTE PROCEDURE refresh_beacon_search_view();

-- Create a trigger to refresh the beacon search materialized view on inserts into the beacon table
CREATE TRIGGER refresh_beacon_search_on_insert_into_beacons
    AFTER INSERT
    ON beacon
    FOR EACH STATEMENT
    EXECUTE PROCEDURE refresh_beacon_search_view();

-- Create a trigger to refresh the beacon search materialized view on inserts into the beacon use table
CREATE TRIGGER refresh_beacon_search_on_insert_into_beacon_uses
    AFTER INSERT
    ON beacon_use
    FOR EACH STATEMENT
    EXECUTE PROCEDURE refresh_beacon_search_view();

-- Create a trigger to refresh the beacon search materialized view on inserts into the beacon person table
CREATE TRIGGER refresh_beacon_search_on_insert_into_beacon_uses
    AFTER INSERT
    ON person
    FOR EACH STATEMENT
    EXECUTE PROCEDURE refresh_beacon_search_view();