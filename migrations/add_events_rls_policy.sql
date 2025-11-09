-- RLS Policy for Events Table
-- Run this in your Supabase SQL Editor

-- Create policy to allow admins to manage events
CREATE POLICY "Admins can manage events"
ON public.events
FOR ALL
TO authenticated
USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin' 
  OR 
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'super_admin'
);

-- Verify the policy was created
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE tablename = 'events';

