CREATE TABLE IF NOT EXISTS legacy_registrations (
    id uuid PRIMARY KEY,
    "value" jsonb NOT NULL,
    hex_id text NOT NULL,
    owner_email text,
    created_date timestamp NOT NULL,
    last_modified timestamp NOT NULL
)
