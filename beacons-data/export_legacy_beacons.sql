SELECT 
	hex_id, 
	UPPER(data -> 'beacon' ->> 'departRefId')AS dept_ref, 
	UPPER(beacon_status) AS beacon_status,
	TO_CHAR(TO_TIMESTAMP(data -> 'beacon' ->> 'firstRegistrationDate', 'YYYY-MM-DDXHH24:MI:SS.MS'), 'dd/mm/yyyy') AS created_date, 
	TO_CHAR(last_modified_date :: DATE, 'dd/mm/yyyy') AS last_modified_date,
	UPPER(data -> 'owner' ->> 'ownerName')AS owner_full_name,
	UPPER(data -> 'owner' ->> 'email')AS owner_email,
	UPPER(data -> 'owner' ->> 'address1')AS owner_address_line1,
	UPPER(data -> 'owner' ->> 'address2')AS owner_address_line2,
	UPPER(data -> 'owner' ->> 'address3')AS owner_address_line3,
	UPPER(data -> 'owner' ->> 'address4')AS owner_address_line4,
	UPPER(data -> 'owner' ->> 'postCode')AS owner_postcode,
	UPPER(data -> 'owner' ->> 'county')AS owner_county,
	UPPER(data -> 'owner' ->> 'townOrCity')AS owner_town_or_city,
	UPPER(data -> 'owner' ->> 'country')AS owner_country
FROM legacy_beacon
WHERE last_modified_date >= '2013/01/01';