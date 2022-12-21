DROP VIEW beacon_search;
CREATE OR REPLACE VIEW beacon_search AS
SELECT
    id,
    CAST(data -> 'beacon' ->> 'firstRegistrationDate' AS TIMESTAMPTZ) AS created_date,
    last_modified_date,
    COALESCE(c.beacon_status, l.beacon_status) AS beacon_status,
    hex_id,
    owner_name,
    owner_email,
    NULL as account_holder_id,
    NULL as account_holder_name,
    NULL as account_holder_email,
    use_activities,
    NULL as vessel_names,
    NULL as registration_marks,
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
    o.full_name as owner_name,
    o.email as owner_email,
    a.id as account_holder_id,
    a.full_name as account_holder_name,
    a.email as account_holder_email,
    u.use_activities,
    u.vessel_names,
    u.registration_marks,
    'BEACON' AS beacon_type,
    manufacturer_serial_number,
    NULL as cospas_sarsat_number
FROM
    beacon b
        LEFT JOIN
    beacon_owner o
    ON b.id = o.beacon_id
        LEFT JOIN
    account_holder a
    ON a.id = b.account_holder_id
        LEFT JOIN
    (
        SELECT
            beacon_id,
            REPLACE(string_agg(activity, ', '), '_', ' ') as use_activities,
            string_agg(vessel_name, ', ')  as vessel_names,
            string_agg(registration_mark, ', ')  as registration_marks
        FROM
            beacon_use
        GROUP BY
            beacon_id
    )
        u
    ON b.id = u.beacon_id;
