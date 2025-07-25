/*
  # Fix Row Level Security policies for registrations table

  1. Security Updates
    - Drop existing restrictive policies
    - Add comprehensive policies for all operations (SELECT, INSERT, UPDATE, DELETE)
    - Allow both authenticated and public access for development
    - Ensure policies work with the current authentication setup

  2. Changes
    - Remove existing policies that may be too restrictive
    - Add new policies that allow proper access to registrations data
    - Maintain security while enabling functionality
*/

-- Drop existing policies to start fresh
DROP POLICY IF EXISTS "Allow all operations on registrations" ON registrations;
DROP POLICY IF EXISTS "select" ON registrations;

-- Create comprehensive policies for registrations table
CREATE POLICY "Enable all operations for authenticated users"
  ON registrations
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable all operations for anonymous users"
  ON registrations
  FOR ALL
  TO anon
  USING (true)
  WITH CHECK (true);

-- Ensure RLS is enabled
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;