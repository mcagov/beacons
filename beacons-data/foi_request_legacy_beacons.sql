SELECT 
	hex_id,
	UPPER(beacon_status) AS beacon_status,
	TO_CHAR(TO_TIMESTAMP(data -> 'beacon' ->> 'firstRegistrationDate', 'YYYY-MM-DDXHH24:MI:SS.MS'), 'dd/mm/yyyy') AS date_first_registered, 
	TO_CHAR(last_modified_date :: DATE, 'dd/mm/yyyy') AS date_last_modified,
	UPPER(data -> 'beacon' ->> 'beaconType') AS beacon_type,
	UPPER(data -> 'beacon' ->> 'mti') AS mti,
	UPPER(data -> 'beacon' ->> 'manufacturer') AS manufacturer,
	UPPER(data -> 'beacon' ->> 'model') AS model,
	COUNT(id)
FROM legacy_beacon
	GROUP BY hex_id, beacon_status, date_first_registered, date_last_modified, beacon_type, mti, manufacturer, model;