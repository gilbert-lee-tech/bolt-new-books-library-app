/*
  # Create libraries table for library profiles

  1. New Tables
    - `libraries`
      - `id` (uuid, primary key)
      - `country` (text, required)
      - `city` (text, required)
      - `area` (text, required)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `libraries` table
    - Add public read policy for all users to view libraries
*/

CREATE TABLE IF NOT EXISTS libraries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  country text NOT NULL,
  city text NOT NULL,
  area text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE libraries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view libraries"
  ON libraries
  FOR SELECT
  TO public
  USING (true);