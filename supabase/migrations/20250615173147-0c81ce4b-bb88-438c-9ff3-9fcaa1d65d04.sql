
-- Add urgency_level column to blood_requests table
ALTER TABLE blood_requests 
ADD COLUMN urgency_level TEXT DEFAULT 'normal';

-- Add a check constraint to ensure valid urgency levels
ALTER TABLE blood_requests 
ADD CONSTRAINT blood_requests_urgency_level_check 
CHECK (urgency_level IN ('normal', 'critical', 'needed_today'));
