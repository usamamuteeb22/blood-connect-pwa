
-- Migration: Make 'request_id' nullable in the donations table
ALTER TABLE donations
ALTER COLUMN request_id DROP NOT NULL;
