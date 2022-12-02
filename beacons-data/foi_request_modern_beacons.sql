SELECT 
	hex_id, 
    UPPER(beacon_status) AS beacon_status, 
    TO_CHAR(created_date :: DATE, 'dd/mm/yyyy') AS date_first_registered,
    TO_CHAR(beacon.last_modified_date :: DATE, 'dd/mm/yyyy') AS date_lASt_modified,
	UPPER(beacon_type) AS beacon_type,
	UPPER(mti) AS mti,
	UPPER(manufacturer) AS manufacturer,
	UPPER(model) AS model
FROM beacon;