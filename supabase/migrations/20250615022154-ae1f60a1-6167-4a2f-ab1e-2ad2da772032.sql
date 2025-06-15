
-- First delete donations that reference donors
DELETE FROM donations;

-- Then update blood_requests to remove donor_id references
UPDATE blood_requests SET donor_id = NULL WHERE donor_id IS NOT NULL;

-- Finally delete all donor data
DELETE FROM donors;
