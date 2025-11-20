/*
  # Add isbn13 column to libraries_books table with deduplication

  1. Changes
    - Add `book_isbn13` column to `libraries_books` table
    - Populate it from the books table using book_id
    - Remove duplicate entries (keep first occurrence per library and isbn13)
    - Create unique constraint on (library_id, book_isbn13)
  
  2. Data Cleanup
    - Identifies and removes duplicate library-isbn13 combinations
    - Keeps the oldest entry (by created_at) for each combination
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'libraries_books' AND column_name = 'book_isbn13'
  ) THEN
    ALTER TABLE libraries_books ADD COLUMN book_isbn13 text;
  END IF;
END $$;

UPDATE libraries_books lb
SET book_isbn13 = b.isbn13
FROM books b
WHERE lb.book_id = b.id AND lb.book_isbn13 IS NULL;

DELETE FROM libraries_books
WHERE id NOT IN (
  SELECT DISTINCT ON (library_id, book_isbn13) id
  FROM libraries_books
  WHERE book_isbn13 IS NOT NULL
  ORDER BY library_id, book_isbn13, created_at ASC
);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'libraries_books' AND constraint_name = 'libraries_books_library_id_book_isbn13_key'
  ) THEN
    ALTER TABLE libraries_books ADD CONSTRAINT libraries_books_library_id_book_isbn13_key UNIQUE(library_id, book_isbn13);
  END IF;
END $$;
