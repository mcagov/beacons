-- Create a trigger to refresh the beacon search materialized view on update into the legacy beacon table
CREATE TRIGGER refresh_beacon_search_on_update_into_legacy_beacons
    AFTER UPDATE
    ON legacy_beacon
    FOR EACH STATEMENT
    EXECUTE PROCEDURE refresh_beacon_search_view();

-- Create a trigger to refresh the beacon search materialized view on update into the beacon table
CREATE TRIGGER refresh_beacon_search_on_update_into_beacons
    AFTER UPDATE
    ON beacon
    FOR EACH STATEMENT
    EXECUTE PROCEDURE refresh_beacon_search_view();

-- Create a trigger to refresh the beacon search materialized view on update into the beacon use table
CREATE TRIGGER refresh_beacon_search_on_update_into_beacon_uses
    AFTER UPDATE
    ON beacon_use
    FOR EACH STATEMENT
    EXECUTE PROCEDURE refresh_beacon_search_view();

-- Create a trigger to refresh the beacon search materialized view on update into the beacon person table
CREATE TRIGGER refresh_beacon_search_on_update_into_beacon_uses
    AFTER UPDATE
    ON person
    FOR EACH STATEMENT
    EXECUTE PROCEDURE refresh_beacon_search_view();

-- Create a trigger to refresh the beacon search materialized view on delete from the legacy beacon table
CREATE TRIGGER refresh_beacon_search_on_delete_from_legacy_beacons
    AFTER DELETE
    ON legacy_beacon
    FOR EACH STATEMENT
    EXECUTE PROCEDURE refresh_beacon_search_view();

-- Create a trigger to refresh the beacon search materialized view on delete from the beacon table
CREATE TRIGGER refresh_beacon_search_on_delete_from_beacons
    AFTER DELETE
    ON beacon
    FOR EACH STATEMENT
    EXECUTE PROCEDURE refresh_beacon_search_view();

-- Create a trigger to refresh the beacon search materialized view on delete from the beacon use table
CREATE TRIGGER refresh_beacon_search_on_delete_from_beacon_uses
    AFTER DELETE
    ON beacon_use
    FOR EACH STATEMENT
    EXECUTE PROCEDURE refresh_beacon_search_view();

-- Create a trigger to refresh the beacon search materialized view on delete from the beacon person table
CREATE TRIGGER refresh_beacon_search_on_delete_from_beacon_uses
    AFTER DELETE
    ON person
    FOR EACH STATEMENT
    EXECUTE PROCEDURE refresh_beacon_search_view();