CREATE OR REPLACE VIEW beacon_search AS
SELECT
    id,
    created_date,
    last_modified_date,
    COALESCE(c.beacon_status, l.beacon_status) AS beacon_status,
    hex_id,
    owner_name,
    owner_email,
    NULL as account_holder_id,
    use_activities,
    'LEGACY_BEACON' AS beacon_type,
    data -> 'beacon' ->> 'manufacturerSerialNumber' AS manufacturer_serial_number,
    data -> 'beacon' ->> 'cospasSarsatNumber' AS cospas_sarsat_number
FROM
    legacy_beacon l
        LEFT JOIN
    (
        SELECT
            legacy_beacon_id,
            'DELETED' as beacon_status
        FROM
            legacy_beacon_claim_event
    )
        c
    ON c.legacy_beacon_id = l.id
UNION ALL
SELECT
    b.id,
    b.created_date,
    b.last_modified_date,
    b.beacon_status,
    b.hex_id,
    p.full_name as owner_name,
    p.email as owner_email,
    a.id as account_holder_id,
    u.use_activities,
    'BEACON' AS beacon_type,
    manufacturer_serial_number,
    NULL as cospas_sarsat_number
FROM
    beacon b
        LEFT JOIN
    person p
    ON b.id = p.beacon_id
        AND p.person_type = 'OWNER'
        LEFT JOIN
    account_holder a
    ON a.id = b.account_holder_id
        LEFT JOIN
    (
        SELECT
            beacon_id,
            REPLACE(string_agg(activity, ', '), '_', ' ') as use_activities
        FROM
            beacon_use
        GROUP BY
            beacon_id
    )
        u
    ON b.id = u.beacon_id;