ALTER TABLE legacy_registrations RENAME TO legacy_beacon;

ALTER TABLE legacy_beacon RENAME COLUMN value TO data;