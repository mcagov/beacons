UPDATE beacon_use
SET main_use = false
WHERE main_use = true
  AND id NOT IN (
    SELECT DISTINCT ON (beacon_id) id
    FROM beacon_use
    WHERE main_use = true
    ORDER BY beacon_id, created_date, id
  );

UPDATE beacon_use
SET main_use = true
WHERE id IN (
    SELECT DISTINCT ON (beacon_id) id
    FROM beacon_use
    WHERE beacon_id NOT IN (
      SELECT beacon_id
      FROM beacon_use
      WHERE main_use = true
    )
    ORDER BY beacon_id, created_date, id
  );
