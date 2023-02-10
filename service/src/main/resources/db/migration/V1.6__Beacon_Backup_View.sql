SELECT
b.id, b.hex_id, b.manufacturer, b.model, b.manufacturer_serial_number,
b.battery_expiry_date, b.last_serviced_date, b.created_date,
b.beacon_status, b.chk_code, b.reference_number, b.account_holder_id,
b.last_modified_date, b.mti, b.svdr, b.csta, b.beacon_type,
b.protocol, b.coding,
NULL as data, NULL as owner_email, NULL as owner_name, NULL as use_activities
FROM beacon b
UNION ALL
SELECT
	legacy_beacon.id as id,
	legacy_beacon.hex_id as hex_id,
	legacy_beacon.beacon_status as beacon_status,
	NULL as beacon_type,
	NULL as manufacturer, NULL as model, NULL manufacturer_serial_number, NULL as battery_expiry_date,
	NULL as last_serviced_date, TO_CHAR(legacy_beacon.created_date, 'dd/mm/yyyy') as created_date, TO_CHAR(legacy_beacon.last_modified_date, 'dd/mm/yyyy') as last_modified_date,
	NULL as chk_code, NULL as reference_number, NULL as account_holder_id,
	NULL as mti, NULL as svdr, NULL as csta, NULL as protocol, NULL as coding,
	legacy_beacon.data, legacy_beacon.owner_email,
	legacy_beacon.owner_name, legacy_beacon.use_activities
	FROM legacy_beacon
