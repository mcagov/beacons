-- Add note table to store notes against beacon records
CREATE TABLE IF NOT EXISTS note (
    id uuid PRIMARY KEY,
    beacon_id uuid REFERENCES beacon (id),
    note text,
    type text,
    created_date timestamp,
    person_id uuid,
    full_name text,
    email text
)