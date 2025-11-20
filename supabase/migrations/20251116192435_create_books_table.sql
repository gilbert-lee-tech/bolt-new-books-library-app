/*
  # Create books table for library inventory

  1. New Tables
    - `books`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `author` (text, required)
      - `isbn13` (text)
      - `language` (text)
      - `format` (text, one of: 'hard cover', 'paperback', 'ebook')
      - `genre` (text, one of: 'fiction', 'non-fiction', 'biography')
      - `status` (text, one of: 'available', 'checked-out', 'in-transit')
      - `image_url` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `books` table
    - Add public read policy for all users to view books
*/

CREATE TABLE IF NOT EXISTS books (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  author text NOT NULL,
  isbn13 text,
  language text,
  format text CHECK (format IN ('hard cover', 'paperback', 'ebook')),
  genre text CHECK (genre IN ('fiction', 'non-fiction', 'biography')),
  status text DEFAULT 'available' CHECK (status IN ('available', 'checked-out', 'in-transit')),
  image_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE books ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view books"
  ON books
  FOR SELECT
  TO public
  USING (true);