CREATE OR REPLACE VIEW account_holders AS
SELECT ah.id,
       ah.full_name,
       ah.email,
       ah.last_modified_date,
       ah.created_date,
       Count(b) AS beacon_count
FROM   account_holder ah
           LEFT OUTER JOIN beacon b
                           ON ah.id = b.account_holder_id
GROUP  BY ah.id
ORDER  BY beacon_count desc;