DROP VIEW beacon_search;

CREATE OR REPLACE VIEW beacon_search AS

    SELECT l.id,
       ((l.data -> 'beacon'::text) ->> 'firstRegistrationDate'::text)::timestamp with time zone AS created_date,
        l.last_modified_date,
        COALESCE(c.beacon_status, l.beacon_status) AS beacon_status,
        l.hex_id,
        l.owner_name,
        l.owner_email,
        l.recovery_email AS legacy_beacon_recovery_email,
        NULL::uuid AS account_holder_id,
        NULL::text AS account_holder_name,
        NULL::text AS account_holder_email,
        l.use_activities,
        NULL::text AS vessel_names,
        NULL::text AS registration_marks,
        (
        SELECT COALESCE(us->>'vesselName', us->>'aircraftRegistrationMark')
        FROM jsonb_array_elements(l.data -> 'uses') AS us
        WHERE us->>'isMain' = 'true'
        LIMIT 1
        ) AS main_use_name,
        'LEGACY_BEACON'::text AS beacon_type,
        (l.data -> 'beacon'::text) ->> 'manufacturerSerialNumber'::text AS manufacturer_serial_number,
        (l.data -> 'beacon'::text) ->> 'cospasSarsatNumber'::text AS cospas_sarsat_number
    FROM legacy_beacon l
        LEFT JOIN ( SELECT legacy_beacon_claim_event.legacy_beacon_id,
        'DELETED'::text AS beacon_status
        FROM legacy_beacon_claim_event) c ON c.legacy_beacon_id = l.id
UNION ALL
    SELECT b.id,
       b.created_date,
       b.last_modified_date,
       b.beacon_status,
       b.hex_id,
       o.full_name AS owner_name,
       o.email AS owner_email,
       NULL AS legacy_beacon_recovery_email,
       a.id AS account_holder_id,
       a.full_name AS account_holder_name,
       a.email AS account_holder_email,
       u.use_activities,
       u.vessel_names,
       u.registration_marks,
       u.main_use_name,
       'BEACON'::text AS beacon_type,
        b.manufacturer_serial_number,
       NULL::text AS cospas_sarsat_number
    FROM beacon b
         LEFT JOIN (
            SELECT bo.beacon_id, bo.full_name, bo.email, bo.is_main,
                   ROW_NUMBER() OVER(PARTITION BY bo.beacon_id ORDER BY bo.is_main DESC) AS rn
            FROM beacon_owner bo
        ) o ON b.id = o.beacon_id AND o.rn = 1
         LEFT JOIN account_holder a ON a.id = b.account_holder_id
         LEFT JOIN ( SELECT beacon_use.beacon_id,
                            replace(string_agg(beacon_use.activity, ', '::text), '_'::text, ' '::text) AS use_activities,
                            string_agg(beacon_use.vessel_name, ', '::text) AS vessel_names,
                            string_agg(beacon_use.registration_mark, ', '::text) AS registration_marks,
                            COALESCE(
                                    MAX(CASE WHEN beacon_use.main_use = true THEN beacon_use.vessel_name END),
                                    MAX(CASE WHEN beacon_use.main_use = true THEN beacon_use.registration_mark END)
                            ) AS main_use_name
                     FROM beacon_use
                     GROUP BY beacon_use.beacon_id) u ON b.id = u.beacon_id;