
-- Make email, weight, and address columns nullable in the donors table
ALTER TABLE donors 
ALTER COLUMN email DROP NOT NULL,
ALTER COLUMN weight DROP NOT NULL,
ALTER COLUMN address DROP NOT NULL;
