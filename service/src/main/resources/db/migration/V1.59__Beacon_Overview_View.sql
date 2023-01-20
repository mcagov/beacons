CREATE OR REPLACE VIEW beacon_overview AS
SELECT
    l.id,
    l.hex_id,
    l.last_modified_date
FROM
    legacy_beacon l
UNION ALL
SELECT
    b.id,
    b.hex_id,
    b.last_modified_date
FROM
    beacon b
