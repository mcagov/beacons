-- Change timestamp types on battery_expiry and last_serviced to date
-- The underlying data is a date type; this migration removes time information, resulting in greater accuracy and
-- avoids off-by-one errors where the time is incorrectly interpreted

ALTER TABLE beacon
    ALTER COLUMN battery_expiry_date TYPE date,
    ALTER COLUMN last_serviced_date TYPE date;
