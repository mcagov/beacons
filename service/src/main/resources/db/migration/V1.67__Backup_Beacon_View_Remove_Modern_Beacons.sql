CREATE OR REPLACE VIEW beacon_backup AS

SELECT * FROM (
	SELECT
		legacy_beacon.id as id, legacy_beacon.hex_id as hex_id,
		COALESCE(UPPER('DELETED (' || claim_event_type::text || 'ED)'), UPPER(legacy_beacon.beacon_status)) AS beacon_status,
		'LEGACY' as category,
		legacy_beacon.created_date as created_date,
	    legacy_beacon.last_modified_date as last_modified_date,
		legacy_beacon.data,
		legacy_beacon.owner_name,
		legacy_beacon.owner_email,
		legacy_beacon.use_activities
	    FROM legacy_beacon_claim_event
	RIGHT JOIN legacy_beacon ON legacy_beacon_claim_event.legacy_beacon_id = legacy_beacon.id
	) AS beacon_backup;