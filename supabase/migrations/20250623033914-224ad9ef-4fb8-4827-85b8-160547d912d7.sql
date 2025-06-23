
-- Add last_donation_date column to donors table
ALTER TABLE donors ADD COLUMN last_donation_date timestamp with time zone;
