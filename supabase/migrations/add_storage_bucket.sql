-- ============================================
-- Storage Bucket für Bild-Uploads
-- ============================================

-- Create uploads bucket for user images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'uploads',
  'uploads',
  true,  -- Public access for displaying images
  5242880,  -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

-- ============================================
-- Storage Policies
-- ============================================

-- Allow anyone to read images (public bucket)
CREATE POLICY "Public read access for uploads"
ON storage.objects FOR SELECT
USING (bucket_id = 'uploads');

-- Allow authenticated users to upload their own images
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'uploads'
  AND (storage.foldername(name))[1] IN ('carousel-images', 'backgrounds')
);

-- Allow users to update their own images
CREATE POLICY "Users can update own images"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'uploads'
  AND owner = auth.uid()
);

-- Allow users to delete their own images
CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'uploads'
  AND owner = auth.uid()
);

-- Allow anonymous uploads (stored under 'anonymous' folder)
CREATE POLICY "Anonymous users can upload to anonymous folder"
ON storage.objects FOR INSERT
TO anon
WITH CHECK (
  bucket_id = 'uploads'
  AND (storage.foldername(name))[2] = 'anonymous'
);
