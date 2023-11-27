UPDATE beacon
SET beacon_status = 'CHANGE'
WHERE beacon_status = 'NEW'
  AND EXTRACT(EPOCH FROM (last_modified_date - created_date)) >= 60;
