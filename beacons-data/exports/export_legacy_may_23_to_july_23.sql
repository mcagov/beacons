SELECT 
	legacy_beacon.hex_id, 
	UPPER(legacy_beacon.data -> 'beacon' ->> 'departRefId')AS dept_ref, 
	COALESCE(UPPER('DELETED (' || claim_event_type::text || 'ED)'), UPPER(legacy_beacon.beacon_status)) AS beacon_status,
	TO_CHAR(TO_TIMESTAMP(legacy_beacon.data -> 'beacon' ->> 'firstRegistrationDate', 'YYYY-MM-DDXHH24:MI:SS.MS'), 'dd/mm/yyyy') AS created_date, 
	TO_CHAR(legacy_beacon.last_modified_date :: DATE, 'dd/mm/yyyy') AS last_modified_date,
	UPPER(legacy_beacon.data -> 'owner' ->> 'ownerName')AS owner_full_name,
	UPPER(legacy_beacon.data -> 'owner' ->> 'email')AS owner_email,
	UPPER(legacy_beacon.data -> 'owner' ->> 'address1')AS owner_address_line1,
	UPPER(legacy_beacon.data -> 'owner' ->> 'address2')AS owner_address_line2,
	UPPER(legacy_beacon.data -> 'owner' ->> 'address3')AS owner_address_line3,
	UPPER(legacy_beacon.data -> 'owner' ->> 'address4')AS owner_address_line4,
	UPPER(legacy_beacon.data -> 'owner' ->> 'postCode')AS owner_postcode,
	UPPER(legacy_beacon.data -> 'owner' ->> 'county')AS owner_county,
	UPPER(legacy_beacon.data -> 'owner' ->> 'townOrCity')AS owner_town_or_city,
	UPPER(legacy_beacon.data -> 'owner' ->> 'country')AS owner_country
FROM legacy_beacon_claim_event
RIGHT JOIN legacy_beacon ON legacy_beacon_claim_event.legacy_beacon_id = legacy_beacon.id
WHERE last_modified_date >= '2023/05/23';