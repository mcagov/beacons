-- Add other communication columns

ALTER TABLE beacon_use
    ADD COLUMN other_communication boolean;

ALTER TABLE beacon_use
    ADD COLUMN other_communication_value text;
