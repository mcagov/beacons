CREATE OR REPLACE VIEW duplicate_hex_ids AS

SELECT hex_id, COUNT(*) as number_of_beacons
FROM beacon GROUP BY hex_id HAVING COUNT(hex_id) > 1;