-- Drop legacy beacon table triggers to speed up the migration

DROP TRIGGER IF EXISTS refresh_beacon_search_on_update_into_legacy_beacons ON legacy_beacon;

DROP TRIGGER IF EXISTS refresh_beacon_search_on_insert_into_legacy_beacons ON legacy_beacon;

-- Replicate function from V1.28 to refresh the beacon search materialized view
CREATE OR REPLACE FUNCTION refresh_beacon_search_view_schedule()
    RETURNS VOID
    LANGUAGE plpgsql
AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY beacon_search_mat;
END $$;