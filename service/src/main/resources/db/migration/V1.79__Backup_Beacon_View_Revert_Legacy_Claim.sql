DROP VIEW beacon_backup;
CREATE OR REPLACE VIEW beacon_backup AS

SELECT * FROM (
      SELECT
          b.id, b.hex_id,
          b.beacon_status,
          'MODERN' as category,
          b.created_date,
          b.last_modified_date,
          -- legacy beacons only
          NULL as data,
          NULL as owner_name,
          NULL as owner_email,
          NULL as use_activities,
          NULL as recovery_email,
          NULL as cospas_sarsat_number,
          -- modern beacons only
          b.manufacturer,
          b.model,
          b.manufacturer_serial_number,
          b.battery_expiry_date,
          b.last_serviced_date,
          b.chk_code,
          b.reference_number,
          b.mti,
          b.svdr,
          b.csta,
          b.beacon_type,
          b.protocol,
          b.coding,
          b.account_holder_id
      FROM beacon b
      UNION ALL
      SELECT
          legacy_beacon.id as id, legacy_beacon.hex_id as hex_id,
          COALESCE(UPPER('DELETED (' || claim_event_type::text || 'ED)'), UPPER(legacy_beacon.beacon_status)) AS beacon_status,
          'LEGACY' as category,
          legacy_beacon.created_date,
          legacy_beacon.last_modified_date,
          -- legacy only
          legacy_beacon.data,
          legacy_beacon.owner_name,
          legacy_beacon.owner_email,
          legacy_beacon.use_activities,
          legacy_beacon.recovery_email as recovery_email,

          -- legacy beacon data fields
          (legacy_beacon.data->'beacon'->>'cospasSarsatNumber') as cospas_sarsat_number,
          (legacy_beacon.data->'beacon'->>'manufacturer') as manufacturer,
          (legacy_beacon.data->'beacon'->>'model') as model,
          (legacy_beacon.data->'beacon'->>'manufacturerSerialNumber') as manufacturer_serial_number,
          NULL as battery_expiry_date,
          NULL as last_serviced_date,
          (legacy_beacon.data->'beacon'->>'chk_code') as chk_code,
          (legacy_beacon.data->'beacon'->>'reference_number') as reference_number,
          (legacy_beacon.data->'beacon'->>'mti') as mti,
          NULL as svdr,
          (legacy_beacon.data->'beacon'->>'csta') as csta,
          (legacy_beacon.data->'beacon'->>'beaconType') as beacon_type,
          (legacy_beacon.data->'beacon'->>'protocol') as protocol,
          (legacy_beacon.data->'beacon'->>'coding') as coding,

          -- modern beacons only
          NULL AS account_holder_id
      FROM legacy_beacon_claim_event
               RIGHT JOIN legacy_beacon ON legacy_beacon_claim_event.legacy_beacon_id = legacy_beacon.id
    ) AS beacon_backup
ORDER BY beacon_backup.last_modified_date DESC, beacon_backup.hex_id ASC;
