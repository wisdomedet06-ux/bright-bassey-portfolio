-- Allow authenticated admins to read files in the resume bucket.
-- This is useful for Storage operations and does not expose anything beyond the public resume bucket.
create policy "admins read resumes"
on storage.objects
for select
using (
  bucket_id = 'resumes'
  and public.is_site_admin()
);
