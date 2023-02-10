-- CREATE VIEW beacon_backup as all of the code down there
-- create if not exists

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

-- 97 modern beacon cols in total
-- remember to join legacy_beacon to claim_Eent table to get teh claimed status
-- might need to select null as created_date and other cols that appear niore than once (because e.g a note has a created_Date and so does a beacon)

SELECT * FROM (
	SELECT *
	FROM beacon_owner
	RIGHT JOIN beacon ON beacon_owner.beacon_id = beacon.id
	RIGHT JOIN beacon_use ON beacon_use.beacon_id = beacon.id
	RIGHT JOIN note ON note.beacon_id = beacon.id
	RIGHT JOIN emergency_contact ON emergency_contact.beacon_id = beacon.id
	UNION ALL
	SELECT
	-- beacon_owner
	NULL as beacon_id, NULL as full_name, NULL as email, NULL as address_line_1, NULL as address_line_2, NULL as address_line_3,
	NULL as address_line_4, NULL as postcode, NULL as county, NULL as town_or_city, NULL as country,
	NULL as telephone_number, NULL as alterntive_telephone_number,
	-- beacon
	NULL as manufacturer, NULL as model, NULL manufacturer_serial_number, NULL as battery_expiry_date,
	NULL as last_serviced_date, NULL as chk_code, NULL as reference_number, NULL as account_holder_id,
	NULL as mti, NULL as svdr, NULL as csta, NULL as protocol, NULL as coding,
	-- beacon_use
	NULL as envrionment, NULL as main_use, NULL as beacon_position,NULL as activity, NULL as other_activity, NULL as call_sign,
	NULL as vhf_radio, NULL as fixed_vhf_radio, NULL as fixed_vhf_radio_value, NULL as portable_vhf_radio,
	NULL as portable_vhf_radio_value, NULL as satellite_telephone, NULL as satellite_telephone_value,
	NULL as mobile_telephone, NULL as mobile_telephone_1, NULL as mobile_telephone_2, NULL as purpose, NULL as max_capacity,
	NULL as vessel_name, NULL as homeport, NULL as area_of_operation, NULL as beacon_location, NULL as imo_number, NULL as ssr_number,
	NULL as offical_number, NULL as rig_platform_location,NULL as aircraft_manufacturer, NULL as principal_airport,
	NULL as secondary_airport, NULL as registration_mark, NULL as hex_address, NULL as cn_or_msn_number,
	NULL as dongle, NULL as working_remotely_location, NULL as working_remotely_people_count,
	NULL as windfarm_location, NULL as windfarm_people_count, NULL as other_activity_location, NULL as other_activity_people_count,
	NULL as more_details, NULL as port_letter_number, NULL as other_communication, NULL as other_communication_value,
	NULL as rss_number,
	-- note
	-- will NULL as created_date make the legacy_beacon.created_date NULL?
	NULL as text, NULL as type, NULL as created_date,
	NULL as user_id, NULL as full_name, NULL as email,
	-- emergency contact
	NULL as full_name, NULL as telephone_number, NULL as alternative_telephone_number,
	legacy_beacon.id, legacy_beacon.hex_id, legacy_beacon.data, legacy_beacon.owner_email,
	legacy_beacon.created_date, legacy_beacon.last_modified_date, legacy_beacon.beacon_status,
	legacy_beacon.owner_name, legacy_beacon.use_activities
	FROM legacy_beacon
) backup_rows
ORDER BY last_modified_date;



