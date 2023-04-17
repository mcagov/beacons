 CREATE OR REPLACE VIEW beacon_backup AS

SELECT * FROM (
	SELECT
	    b.id, b.hex_id,
		b.beacon_status,
		'MODERN' as category,
		b.created_date,
	    b.last_modified_date,
		-- legacy beacons only
	    NULL as data, NULL as owner_name, NULL as owner_email, NULL as use_activities,
		-- modern beacons only
	    b.manufacturer, b.model, b.manufacturer_serial_number,
	    b.battery_expiry_date, b.last_serviced_date,
	    b.chk_code, b.reference_number, b.account_holder_id,
	    b.mti, b.svdr, b.csta, b.beacon_type,
	    b.protocol, b.coding
	FROM beacon b
	UNION ALL
	SELECT
		legacy_beacon.id as id, legacy_beacon.hex_id as hex_id,
		COALESCE(UPPER('DELETED (' || claim_event_type::text || 'ED)'), UPPER(legacy_beacon.beacon_status)) AS beacon_status,
		'LEGACY' as category,
		legacy_beacon.created_date,
	    legacy_beacon.last_modified_date,
		legacy_beacon.data,
		legacy_beacon.owner_name,
		legacy_beacon.owner_email,
		legacy_beacon.use_activities,
			-- modern beacons only
	    NULL AS manufacturer, NULL AS model, NULL AS manufacturer_serial_number,
	    NULL AS battery_expiry_date, NULL AS last_serviced_date,
	    NULL AS chk_code, NULL AS reference_number, NULL AS account_holder_id,
	    NULL AS mti, NULL AS svdr, NULL AS csta, NULL AS beacon_type,
	    NULL AS protocol, NULL AS coding
	    FROM legacy_beacon_claim_event
	RIGHT JOIN legacy_beacon ON legacy_beacon_claim_event.legacy_beacon_id = legacy_beacon.id
	) AS beacon_backup
	ORDER BY beacon_backup.last_modified_date DESC, beacon_backup.hex_id ASC;