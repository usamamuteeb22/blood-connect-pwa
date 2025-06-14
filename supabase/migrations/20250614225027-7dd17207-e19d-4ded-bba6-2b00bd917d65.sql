-- Enable RLS for all main tables.
ALTER TABLE donors ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE blood_requests ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------
-- DONORS TABLE POLICIES
-- -----------------------------------------

DROP POLICY IF EXISTS "Users can view all donors" ON donors;
DROP POLICY IF EXISTS "Users can update all donors" ON donors;
DROP POLICY IF EXISTS "Users can insert all donors" ON donors;
DROP POLICY IF EXISTS "Users can delete all donors" ON donors;

-- ONLY keep restrictive donors policies below:
CREATE POLICY donors_select ON donors
  FOR SELECT
  USING (
    user_id = auth.uid() OR
    auth.jwt() ->> 'email' = 'usamaweb246@gmail.com'
  );
CREATE POLICY donors_insert ON donors
  FOR INSERT
  WITH CHECK (
    user_id = auth.uid() OR
    auth.jwt() ->> 'email' = 'usamaweb246@gmail.com'
  );
CREATE POLICY donors_update ON donors
  FOR UPDATE
  USING (
    user_id = auth.uid() OR
    auth.jwt() ->> 'email' = 'usamaweb246@gmail.com'
  );
CREATE POLICY donors_delete ON donors
  FOR DELETE
  USING (
    auth.jwt() ->> 'email' = 'usamaweb246@gmail.com'
  );

-- -----------------------------------------
-- DONATIONS TABLE POLICIES
-- -----------------------------------------

DROP POLICY IF EXISTS "Users can view all donations" ON donations;
DROP POLICY IF EXISTS "Users can insert all donations" ON donations;
DROP POLICY IF EXISTS "Users can update all donations" ON donations;
DROP POLICY IF EXISTS "Users can delete all donations" ON donations;

-- ONLY keep restrictive donations policies below:
CREATE POLICY donations_select ON donations
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM donors d
      WHERE d.id = donor_id AND (d.user_id = auth.uid())
    ) OR
    auth.jwt() ->> 'email' = 'usamaweb246@gmail.com'
  );
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
CREATE POLICY donations_delete ON donations
  FOR DELETE
  USING (
    auth.jwt() ->> 'email' = 'usamaweb246@gmail.com'
  );

-- -----------------------------------------
-- BLOOD_REQUESTS TABLE POLICIES
-- -----------------------------------------

DROP POLICY IF EXISTS "Users can view all blood requests" ON blood_requests;
DROP POLICY IF EXISTS "Users can insert all blood requests" ON blood_requests;
DROP POLICY IF EXISTS "Users can update all blood requests" ON blood_requests;
DROP POLICY IF EXISTS "Users can delete all blood requests" ON blood_requests;

-- ONLY keep restrictive blood_requests policies below:
CREATE POLICY br_select ON blood_requests
  FOR SELECT
  USING (
    requester_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM donors d WHERE d.id = donor_id AND d.user_id = auth.uid()
    )
    OR auth.jwt() ->> 'email' = 'usamaweb246@gmail.com'
  );
CREATE POLICY br_insert ON blood_requests
  FOR INSERT
  WITH CHECK (
    requester_id = auth.uid() OR
    auth.jwt() ->> 'email' = 'usamaweb246@gmail.com'
  );
CREATE POLICY br_update ON blood_requests
  FOR UPDATE
  USING (
    requester_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM donors d WHERE d.id = donor_id AND d.user_id = auth.uid()
    )
    OR auth.jwt() ->> 'email' = 'usamaweb246@gmail.com'
  );
CREATE POLICY br_delete ON blood_requests
  FOR DELETE
  USING (
    auth.jwt() ->> 'email' = 'usamaweb246@gmail.com'
  );
