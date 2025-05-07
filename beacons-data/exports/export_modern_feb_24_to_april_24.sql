SELECT
    beacon.hex_id,
    NULL as dept_ref,
    UPPER(beacon.beacon_status) as beacon_status,
    TO_CHAR(beacon.created_date :: DATE, 'dd/mm/yyyy') as created_date,
    TO_CHAR(beacon.last_modified_date :: DATE, 'dd/mm/yyyy') as last_modified_date,
    UPPER(beacon_owner.full_name) as owner_full_name,
    UPPER(beacon_owner.email) as owner_email,
    UPPER(beacon_owner.address_line_1) as owner_address_line_1,
    UPPER(beacon_owner.address_line_2) as owner_address_line_2,
    UPPER(beacon_owner.address_line_3) as owner_address_line_3,
    UPPER(beacon_owner.address_line_4) as owner_address_line_4,
    UPPER(beacon_owner.postcode) as owner_postcode,
    UPPER(beacon_owner.county) as owner_county,
    UPPER(beacon_owner.town_or_city) as owner_town_or_city,
    UPPER(beacon_owner.country) as owner_country
FROM beacon_owner
RIGHT JOIN beacon ON beacon_owner.beacon_id = beacon.id
WHERE beacon.last_modified_date >= '2024/02/01' AND beacon.last_modified_date < '2024/05/01';
