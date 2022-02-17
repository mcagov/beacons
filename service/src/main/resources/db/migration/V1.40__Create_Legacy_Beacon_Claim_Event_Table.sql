CREATE TYPE permitted_claim_events AS ENUM ('claim', 'reject');

CREATE TABLE IF NOT EXISTS legacy_beacon_claim_event
(
    id                UUID PRIMARY KEY,
    claim_event_type  permitted_claim_events                                NOT NULL,
    legacy_beacon_id  UUID REFERENCES legacy_beacon (id) ON DELETE CASCADE  NOT NULL,
    account_holder_id UUID REFERENCES account_holder (id) ON DELETE CASCADE NOT NULL,
    when_happened     TIMESTAMP WITH TIME ZONE                              NOT NULL,
    reason            VARCHAR(500)
)