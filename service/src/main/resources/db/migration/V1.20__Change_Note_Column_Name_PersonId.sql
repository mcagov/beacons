-- Change column name, personId to userId - less confusing as it's not the id of a Person
ALTER TABLE note
    RENAME COLUMN person_id TO user_id;