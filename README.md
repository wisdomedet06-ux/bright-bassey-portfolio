# Bright Bassey Portfolio + Supabase CMS

This is a static Netlify-ready portfolio with a Supabase-backed CMS.

## 1. Supabase setup
1. Open the Supabase project.
2. Go to SQL Editor.
3. Paste `supabase.sql` and run it.
4. Go to Authentication > Users and create Bright's admin login.
5. Copy that user's UUID.
6. In SQL Editor run:
   `insert into public.site_admins(user_id) values ('PASTE-UUID-HERE');`

## 2. Netlify
This project uses plain HTML/CSS/JavaScript and can be deployed as a static site. Upload the contents of this folder to Netlify or put the folder in GitHub and connect the repository.

`index.html` is the public website.
`admin.html` is the CMS.

## 3. Resume files
The site includes Bright's current PDF and DOCX as local fallback files. Once the Supabase schema is live, sign in at `/admin.html` and upload the PDF/DOCX into the Resume Manager. The public site will then use the Supabase copies.

## 4. Supabase config
`supabase-config.js` contains the project URL and publishable key supplied during setup. The publishable key is intended for use in browser-side code. Never replace it with a Supabase service-role/secret key.

## 5. CMS scope
Profile, experience, skills, projects, education, resumes, login and resume delete/replace are wired. The content tables are public-read and admin-write through RLS.
