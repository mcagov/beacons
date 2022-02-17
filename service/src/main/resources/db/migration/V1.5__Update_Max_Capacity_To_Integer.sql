-- Update max capacity field to match POJO type of integer

ALTER TABLE beacon_use
    ALTER COLUMN max_capacity TYPE integer USING max_capacity::integer;