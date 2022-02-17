-- Change column name, note.text feels better than note.note
ALTER TABLE note
    RENAME COLUMN note TO text;