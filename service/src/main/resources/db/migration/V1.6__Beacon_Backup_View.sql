-- CREATE VIEW beacon_backup as SELECT * FROM beacon;

-- SELECT * FROM beacon

-- SELECT
--     *
-- FROM
--     legacy_beacon l
-- UNION ALL
-- SELECT
--     *
-- FROM
--     beacon b


SELECT SUM(19 + 16 + 47 + 7 + 8);

SELECT * FROM (
	SELECT *
	FROM beacon_owner
	RIGHT JOIN beacon ON beacon_owner.beacon_id = beacon.id
	RIGHT JOIN beacon_use ON beacon_use.beacon_id = beacon.id
	RIGHT JOIN note ON note.beacon_id = beacon.id
	RIGHT JOIN emergency_contact ON emergency_contact.beacon_id = beacon.id
	UNION ALL
	SELECT NULL, NULL, NULL, NUll, NULL, NULL, NULL, NULL,
	NULL, NULL, NULL, NUll, NULL, NULL, NULL, NULL,
	NULL, NULL, NULL, NUll, NULL, NULL, NULL, NULL,
	NULL, NULL, NULL, NUll, NULL, NULL, NULL, NULL,
	NULL, NULL, NULL, NUll, NULL, NULL, NULL, NULL,
	NULL, NULL, NULL, NUll, NULL, NULL, NULL, NULL,
	NULL, NULL, NULL, NUll, NULL, NULL, NULL, NULL,
	NULL, NULL, NULL, NUll, NULL, NULL, NULL, NULL,
	NULL, NULL, NULL, NUll, NULL, NULL, NULL, NULL,
	NULL, NULL, NULL, NUll, NULL, NULL, NULL, NULL,
	NULL, NULL, NULL, NUll, NULL, NULL, NULL, NULL,
	NULL, NULL, NULL, NUll, NULL, NULL, NULL, NULL, NULL,
	legacy_beacon.id, legacy_beacon.hex_id, legacy_beacon.data, legacy_beacon.owner_email,
	legacy_beacon.created_date, legacy_beacon.last_modified_date, legacy_beacon.beacon_status,
	legacy_beacon.owner_name, legacy_beacon.use_activities
	FROM legacy_beacon
) backup_rows
ORDER BY last_modified_date;
-- DROP VIEW beacon_backup;



-- SELECT * FROM legacy_beacon;

-- id,
--     hex_id
--     manufacturer,
--     model,
--     manufacturer_serial_number,
--     battery_expiry_date,
--     last_serviced_date,
--     created_date,
--     beacon_status,
--     chk_code,
--     reference_number,
--     account_holder_id,
--     last_modified_date,
--     mti,
--     svdr,
--     csta,
--     beacon_type,
--     protocol,
--     coding