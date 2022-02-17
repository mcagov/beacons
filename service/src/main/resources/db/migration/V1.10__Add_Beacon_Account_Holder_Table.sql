CREATE TABLE IF NOT EXISTS beacon_account_holder (
                                             id uuid PRIMARY KEY,
                                             auth_id text UNIQUE,
                                             email text,
                                             full_name text,
                                             telephone_number text,
                                             alternative_telephone_number text,
                                             address_line_1 text,
                                             address_line_2 text,
                                             address_line_3 text,
                                             address_line_4 text,
                                             town_or_city text,
                                             postcode text,
                                             county text
);

CREATE INDEX account_holder_auth_id_id_index ON beacon_account_holder(auth_id);