-- Add RSS number field to Beacon use, as it will be needed for fishing vessels

ALTER TABLE beacon_use
    ADD COLUMN rss_number text;