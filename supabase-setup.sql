-- =============================================
-- Supabase Setup for Portfolio Work Samples
-- Run this SQL in:  Supabase Dashboard → SQL Editor
-- =============================================

-- 1. Create the folders table (work samples)
CREATE TABLE IF NOT EXISTS folders (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name         TEXT NOT NULL,
  url          TEXT DEFAULT '',
  description  TEXT DEFAULT '',
  technologies TEXT DEFAULT '',
  category     TEXT DEFAULT '',
  github_url   TEXT DEFAULT '',
  featured     BOOLEAN DEFAULT false,
  created_at   TIMESTAMPTZ DEFAULT now()
);

-- If table already exists, add new columns
ALTER TABLE folders ADD COLUMN IF NOT EXISTS description  TEXT DEFAULT '';
ALTER TABLE folders ADD COLUMN IF NOT EXISTS technologies TEXT DEFAULT '';
ALTER TABLE folders ADD COLUMN IF NOT EXISTS category     TEXT DEFAULT '';
ALTER TABLE folders ADD COLUMN IF NOT EXISTS github_url   TEXT DEFAULT '';
ALTER TABLE folders ADD COLUMN IF NOT EXISTS featured     BOOLEAN DEFAULT false;

-- 2. Create the folder_images table
CREATE TABLE IF NOT EXISTS folder_images (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  folder_id    UUID NOT NULL REFERENCES folders(id) ON DELETE CASCADE,
  image_url    TEXT NOT NULL,
  storage_path TEXT,               -- NULL if added via external URL
  position     INT DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT now()
);

-- 3. DISABLE Row Level Security so no policies are needed
--    Admin access is protected by client-side password (adham2025)
ALTER TABLE folders DISABLE ROW LEVEL SECURITY;
ALTER TABLE folder_images DISABLE ROW LEVEL SECURITY;

-- 4. Drop any existing policies (cleanup)
DROP POLICY IF EXISTS "Public read folders"       ON folders;
DROP POLICY IF EXISTS "Allow insert folders"      ON folders;
DROP POLICY IF EXISTS "Allow update folders"      ON folders;
DROP POLICY IF EXISTS "Allow delete folders"      ON folders;
DROP POLICY IF EXISTS "Public read folder_images"  ON folder_images;
DROP POLICY IF EXISTS "Allow insert folder_images" ON folder_images;
DROP POLICY IF EXISTS "Allow update folder_images" ON folder_images;
DROP POLICY IF EXISTS "Allow delete folder_images" ON folder_images;

-- 5. Create the Storage bucket for project images
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-images', 'project-images', true)
ON CONFLICT (id) DO NOTHING;

-- 6. Storage policies — drop then recreate
DROP POLICY IF EXISTS "Allow public upload" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read"   ON storage.objects;
DROP POLICY IF EXISTS "Allow public delete" ON storage.objects;
DROP POLICY IF EXISTS "Allow public update" ON storage.objects;

CREATE POLICY "Allow public upload"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'project-images');

CREATE POLICY "Allow public read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'project-images');

CREATE POLICY "Allow public update"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'project-images');

CREATE POLICY "Allow public delete"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'project-images');
