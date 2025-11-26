/*
  # Create libraries_books junction table

  1. New Tables
    - `libraries_books`
      - `id` (uuid, primary key)
      - `library_id` (uuid, foreign key to libraries)
      - `book_id` (uuid, foreign key to books)
      - `created_at` (timestamp)
      - `unique constraint` on (library_id, book_id) to enforce one-to-one relationship

  2. Security
    - Enable RLS on `libraries_books` table
    - Add public read policy for all users to view library-book relationships

  3. Relationships
    - Each library can have multiple books
    - Each book can belong to multiple libraries
    - The unique constraint on (library_id, book_id) ensures a book appears only once per library
*/

CREATE TABLE IF NOT EXISTS libraries_books (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  library_id uuid NOT NULL REFERENCES libraries(id) ON DELETE CASCADE,
  book_id uuid NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(library_id, book_id)
);

ALTER TABLE libraries_books ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view library-book relationships"
  ON libraries_books
  FOR SELECT
  TO public
  USING (true);