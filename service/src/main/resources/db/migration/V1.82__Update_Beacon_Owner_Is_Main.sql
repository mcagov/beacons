ALTER TABLE beacon_owner ADD COLUMN is_main boolean DEFAULT false;

UPDATE beacon_owner SET is_main = true;