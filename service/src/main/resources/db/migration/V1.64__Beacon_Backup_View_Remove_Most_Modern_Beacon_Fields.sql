CREATE OR REPLACE VIEW beacon_backup AS

SELECT * FROM (
	SELECT
	    b.id, b.hex_id,
	    b.last_modified_date,
	    NULL as data, NULL as owner_email, NULL as owner_name, NULL as use_activities,
	    NULL as created_date, NULL as beacon_status,
 	    'MODERN' as category
	FROM beacon b
	UNION ALL
	SELECT
		legacy_beacon.id as id, legacy_beacon.hex_id as hex_id,
		legacy_beacon.created_date as created_date,
		COALESCE(UPPER('DELETED (' || claim_event_type::text || 'ED)'), UPPER(legacy_beacon.beacon_status)) AS beacon_status,
	    legacy_beacon.last_modified_date as last_modified_date,
		legacy_beacon.data, legacy_beacon.owner_email,
		legacy_beacon.owner_name, legacy_beacon.use_activities,
	    'LEGACY' as category
	    FROM legacy_beacon_claim_event
	RIGHT JOIN legacy_beacon ON legacy_beacon_claim_event.legacy_beacon_id = legacy_beacon.id
	) AS beacon_backup
ORDER BY beacon_backup.last_modified_date DESC, beacon_backup.hex_id ASC;