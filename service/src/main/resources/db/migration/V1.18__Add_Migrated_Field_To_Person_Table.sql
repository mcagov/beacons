-- Adds migrated column to person table
ALTER TABLE person
    ADD COLUMN migrated boolean;