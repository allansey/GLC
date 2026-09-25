-- Add delete policy for contact_submissions table
DROP POLICY IF EXISTS "Authenticated users can delete submissions" ON contact_submissions;
CREATE POLICY "Authenticated users can delete submissions"
  ON contact_submissions
  FOR DELETE
  TO authenticated
  USING (true);
