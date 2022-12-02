SELECT 
	legacy_beacon.hex_id,
	COALESCE(UPPER('DELETED (' || claim_event_type::text || 'ED)'), UPPER(legacy_beacon.beacon_status)) AS beacon_status,
	TO_CHAR(TO_TIMESTAMP(legacy_beacon.data -> 'beacon' ->> 'firstRegistrationDate', 'YYYY-MM-DDXHH24:MI:SS.MS'), 'dd/mm/yyyy') AS date_first_registered, 
	TO_CHAR(legacy_beacon.last_modified_date :: DATE, 'dd/mm/yyyy') AS date_last_modified,
	UPPER(legacy_beacon.data -> 'beacon' ->> 'beaconType') AS beacon_type,
	UPPER(legacy_beacon.data -> 'beacon' ->> 'mti') AS mti,
	UPPER(legacy_beacon.data -> 'beacon' ->> 'manufacturer') AS manufacturer,
	UPPER(legacy_beacon.data -> 'beacon' ->> 'model') AS model
FROM legacy_beacon_claim_event
RIGHT JOIN legacy_beacon ON legacy_beacon_claim_event.legacy_beacon_id = legacy_beacon.id;