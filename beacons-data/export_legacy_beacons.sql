SELECT 
	hex_id, 
	UPPER(data -> 'beacon' ->> 'departRefId')as dept_ref, 
	UPPER(beacon_status),
	TO_CHAR(created_date :: DATE, 'dd/mm/yyyy') as created_date, 
	TO_CHAR(last_modified_date :: DATE, 'dd/mm/yyyy') as last_modified_date,
	UPPER(data -> 'owner' ->> 'ownerName')as owner_name,
	UPPER(data -> 'owner' ->> 'email')as owner_email,
	UPPER(data -> 'owner' ->> 'address1')as owner_address_line1,
	UPPER(data -> 'owner' ->> 'address2')as owner_address_line2,
	UPPER(data -> 'owner' ->> 'address3')as owner_address_line3,
	UPPER(data -> 'owner' ->> 'address4')as owner_address_line4,
	UPPER(data -> 'owner' ->> 'postCode')as owner_postcode,
	UPPER(data -> 'owner' ->> 'country')as owner_country
FROM legacy_beacon;




