-- Revert Changes from v1.84
UPDATE beacon
SET beacon_status = 'NEW'
WHERE beacon_status = 'CHANGE';

-- Apply Updated Logic 1 Day Time Threshold
UPDATE beacon
SET beacon_status = 'CHANGE'
WHERE beacon_status = 'NEW'
  AND (last_modified_date - created_date) >= INTERVAL '1 day';