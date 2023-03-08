CREATE OR REPLACE VIEW duplicate_hex_ids AS

 SELECT b.hex_id, COUNT(*) as number_of_beacons
 FROM beacon b
 GROUP BY b.hex_id HAVING COUNT(b.hex_id) > 1
 UNION ALL
 SELECT l.hex_id, COUNT(*) as number_of_legacy_beacons
 FROM legacy_beacon l
 WHERE l.hex_id IS NOT NULL
 GROUP BY l.hex_id HAVING COUNT(l.hex_id) > 1;
 