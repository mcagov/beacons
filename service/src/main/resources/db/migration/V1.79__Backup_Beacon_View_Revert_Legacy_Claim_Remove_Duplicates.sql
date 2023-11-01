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
      UNION
      SELECT
          lb.id as id, lb.hex_id as hex_id,
          COALESCE(claim_events.claim_status,UPPER(lb.beacon_status)) AS beacon_status,
          'LEGACY' as category,
          lb.created_date,
          lb.last_modified_date,
          -- legacy only
          lb.data,
          lb.owner_name,
          lb.owner_email,
          lb.use_activities,
          lb.recovery_email as recovery_email,

          -- legacy beacon data fields
          (lb.data->'beacon'->>'cospasSarsatNumber') as cospas_sarsat_number,
          (lb.data->'beacon'->>'manufacturer') as manufacturer,
          (lb.data->'beacon'->>'model') as model,
          (lb.data->'beacon'->>'manufacturerSerialNumber') as manufacturer_serial_number,
          NULL as battery_expiry_date,
          NULL as last_serviced_date,
          (lb.data->'beacon'->>'chk_code') as chk_code,
          (lb.data->'beacon'->>'reference_number') as reference_number,
          (lb.data->'beacon'->>'mti') as mti,
          NULL as svdr,
          (lb.data->'beacon'->>'csta') as csta,
          (lb.data->'beacon'->>'beaconType') as beacon_type,
          (lb.data->'beacon'->>'protocol') as protocol,
          (lb.data->'beacon'->>'coding') as coding,

          -- modern beacons only
          NULL AS account_holder_id
      FROM legacy_beacon lb
               LEFT JOIN (
          SELECT legacy_beacon_id, STRING_AGG(UPPER('DELETED (' || claim_event_type::text || 'ED)'), ', ') AS claim_status
          FROM legacy_beacon_claim_event
          GROUP BY legacy_beacon_id
      ) claim_events ON lb.id = claim_events.legacy_beacon_id
) AS beacon_backup
ORDER BY beacon_backup.last_modified_date DESC, beacon_backup.hex_id ASC;