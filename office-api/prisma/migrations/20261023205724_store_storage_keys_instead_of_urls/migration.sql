-- Files are now referenced by their storage key instead of the full S3 URL.
-- Turn "https://<bucket>.s3.<region>.amazonaws.com/<key>" into "<key>".
UPDATE `ProjectFile`
SET `path` = SUBSTRING_INDEX(`path`, 'amazonaws.com/', -1)
WHERE `path` LIKE '%amazonaws.com/%';

UPDATE `Office`
SET `logo` = SUBSTRING_INDEX(`logo`, 'amazonaws.com/', -1)
WHERE `logo` LIKE '%amazonaws.com/%';

UPDATE `Client`
SET `logo` = SUBSTRING_INDEX(`logo`, 'amazonaws.com/', -1)
WHERE `logo` LIKE '%amazonaws.com/%';

UPDATE `Employee`
SET `avatar` = SUBSTRING_INDEX(`avatar`, 'amazonaws.com/', -1)
WHERE `avatar` LIKE '%amazonaws.com/%';
