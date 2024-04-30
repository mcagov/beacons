SELECT
    hex_id AS hex_id,
    call_sign AS call_sign,
    use_type AS use_type,
    mmsi_number AS mmsi_number,
    vessel_name AS vessel_name,
    vessel_type AS vessel_type,
    fishing_vessel_pln AS fishing_vessel_pln,
    owner_name AS owner_name,
    owner_email AS owner_email,
    type AS type
FROM
    (
        SELECT
            lb.data - > 'beacon' - > > 'hexId' AS hex_id,
            us - > > 'callSign' AS call_sign,
            us - > > 'useType' AS use_type,
            us - > > 'mmsiNumber' AS mmsi_number,
            us - > > 'vesselName' AS vessel_name,
            us - > > 'vesselType' AS vessel_type,
            us - > > 'fishingVesselPln' AS fishing_vessel_pln,
            lb.data - > 'owner' - > > 'ownerName' AS owner_name,
            lb.data - > 'owner' - > > 'email' AS owner_email,
            'LEGACY' AS type
        FROM
            legacy_beacon lb,
            jsonb_array_elements (lb.data - > 'uses') AS us
        UNION ALL
        SELECT
            b.hex_id AS hex_id,
            bu.callSign AS call_sign,
            bu.useType AS use_type,
            bu.mmsiNumber AS mmsi_number,
            bu.vesselName AS vessel_name,
            bu.vesselType AS vessel_type,
            bu.fishingVesselPln AS fishing_vessel_pln,
            o.full_name AS owner_name,
            o.email AS owner_email,
            'MODERN' AS type
        FROM
            beacon b
            LEFT JOIN beacon_owner o ON b.id = o.beacon_id
            LEFT JOIN (
                SELECT
                    beacon_id,
                    call_sign AS callSign,
                    activity AS useType,
                    fixed_vhf_radio_value AS mmsiNumber,
                    port_letter_number AS fishingVesselPln,
                    vessel_name AS vesselName,
                    purpose AS vesselType
                FROM
                    beacon_use
            ) AS bu ON b.id = bu.beacon_id
    ) AS combined_data
WHERE
    use_type ILIKE '%FISH%'
    OR vessel_type ILIKE '%FISH%';
