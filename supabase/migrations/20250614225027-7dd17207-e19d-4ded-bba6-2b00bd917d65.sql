
-- Enable RLS for all main tables.
ALTER TABLE donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE blood_requests ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------
-- DONORS TABLE POLICIES
-- -----------------------------------------

-- Allow donors to view their own data, and admins all data
CREATE POLICY donors_select ON donors
  FOR SELECT
  USING (
    user_id = auth.uid() OR
    auth.jwt() ->> 'email' = 'usamaweb246@gmail.com'
  );

-- Allow donors to insert their own row (app code must set user_id to auth.uid())
CREATE POLICY donors_insert ON donors
  FOR INSERT
  WITH CHECK (
    user_id = auth.uid() OR
    auth.jwt() ->> 'email' = 'usamaweb246@gmail.com'
  );

-- Allow donors to update their own row, admins all
CREATE POLICY donors_update ON donors
  FOR UPDATE
  USING (
    user_id = auth.uid() OR
    auth.jwt() ->> 'email' = 'usamaweb246@gmail.com'
  );

-- Allow only admin to delete
CREATE POLICY donors_delete ON donors
  FOR DELETE
  USING (
    auth.jwt() ->> 'email' = 'usamaweb246@gmail.com'
  );

-- -----------------------------------------
-- DONATIONS TABLE POLICIES
-- -----------------------------------------

-- Allow select for:
-- - the donating user (by donor_id with user_id matching auth.uid())
-- - admin
CREATE POLICY donations_select ON donations
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM donors d
      WHERE d.id = donor_id AND (d.user_id = auth.uid())
    ) OR
    auth.jwt() ->> 'email' = 'usamaweb246@gmail.com'
  );

-- Allow insert for:
-- - admin: any
-- - normal user: if donor_id belongs to their donor profile
CREATE POLICY donations_insert ON donations
  FOR INSERT
  WITH CHECK (
    (EXISTS (
      SELECT 1 FROM donors d
      WHERE d.id = donor_id AND d.user_id = auth.uid()
    ))
    OR
    auth.jwt() ->> 'email' = 'usamaweb246@gmail.com'
  );

-- Allow update for donations:
-- - admin or actual owner
CREATE POLICY donations_update ON donations
  FOR UPDATE
  USING (
    (EXISTS (
      SELECT 1 FROM donors d
      WHERE d.id = donor_id AND d.user_id = auth.uid()
    ))
    OR
    auth.jwt() ->> 'email' = 'usamaweb246@gmail.com'
  );

-- Allow only admin to delete
CREATE POLICY donations_delete ON donations
  FOR DELETE
  USING (
    auth.jwt() ->> 'email' = 'usamaweb246@gmail.com'
  );

-- -----------------------------------------
-- BLOOD_REQUESTS TABLE POLICIES
-- -----------------------------------------

-- Allow user to view only their own (as requester)
-- OR requests where they are donor (receiver)
-- OR all for admin
CREATE POLICY br_select ON blood_requests
  FOR SELECT
  USING (
    requester_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM donors d WHERE d.id = donor_id AND d.user_id = auth.uid()
    )
    OR auth.jwt() ->> 'email' = 'usamaweb246@gmail.com'
  );

-- Allow user to insert request as themselves, or admin any
CREATE POLICY br_insert ON blood_requests
  FOR INSERT
  WITH CHECK (
    requester_id = auth.uid() OR
    auth.jwt() ->> 'email' = 'usamaweb246@gmail.com'
  );

-- Allow to update if owner or admin
CREATE POLICY br_update ON blood_requests
  FOR UPDATE
  USING (
    requester_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM donors d WHERE d.id = donor_id AND d.user_id = auth.uid()
    )
    OR auth.jwt() ->> 'email' = 'usamaweb246@gmail.com'
  );

-- Allow only admin to delete
CREATE POLICY br_delete ON blood_requests
  FOR DELETE
  USING (
    auth.jwt() ->> 'email' = 'usamaweb246@gmail.com'
  );
