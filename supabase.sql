-- Bright Bassey Portfolio CMS schema
-- Run this once in Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.site_admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_site_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.site_admins where user_id = auth.uid());
$$;

create table if not exists public.profile (
  id int primary key default 1,
  name text not null,
  title text not null,
  intro text not null,
  about_lead text not null,
  about_body text not null,
  availability text default 'Available',
  status_text text default 'OPEN TO REMOTE',
  location text,
  email text,
  phone text,
  linkedin text,
  updated_at timestamptz not null default now()
);
create table if not exists public.stats (id uuid primary key default gen_random_uuid(), value text not null, label text not null, sort_order int default 0);
create table if not exists public.chips (id uuid primary key default gen_random_uuid(), name text not null, sort_order int default 0);
create table if not exists public.experience (id uuid primary key default gen_random_uuid(), role text not null, company text not null, period text, bullets jsonb default '[]'::jsonb, sort_order int default 0);
create table if not exists public.skills (id uuid primary key default gen_random_uuid(), category text not null, tags text, icon text, sort_order int default 0);
create table if not exists public.projects (id uuid primary key default gen_random_uuid(), name text not null, category text, description text, url text, tech text, sort_order int default 0);
create table if not exists public.education (id uuid primary key default gen_random_uuid(), title text not null, body text, type text default 'Education', sort_order int default 0);
create table if not exists public.resume (id uuid primary key default gen_random_uuid(), type text unique not null, name text not null, url text not null, storage_path text, sort_order int default 0);

alter table public.profile enable row level security;
alter table public.stats enable row level security;
alter table public.chips enable row level security;
alter table public.experience enable row level security;
alter table public.skills enable row level security;
alter table public.projects enable row level security;
alter table public.education enable row level security;
alter table public.resume enable row level security;
alter table public.site_admins enable row level security;

do $$ begin
  create policy "public read profile" on public.profile for select using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "public read stats" on public.stats for select using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "public read chips" on public.chips for select using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "public read experience" on public.experience for select using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "public read skills" on public.skills for select using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "public read projects" on public.projects for select using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "public read education" on public.education for select using (true);
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "public read resume" on public.resume for select using (true);
exception when duplicate_object then null; end $$;

do $$ begin
  create policy "admin manage profile" on public.profile for all using (public.is_site_admin()) with check (public.is_site_admin());
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "admin manage stats" on public.stats for all using (public.is_site_admin()) with check (public.is_site_admin());
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "admin manage chips" on public.chips for all using (public.is_site_admin()) with check (public.is_site_admin());
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "admin manage experience" on public.experience for all using (public.is_site_admin()) with check (public.is_site_admin());
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "admin manage skills" on public.skills for all using (public.is_site_admin()) with check (public.is_site_admin());
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "admin manage projects" on public.projects for all using (public.is_site_admin()) with check (public.is_site_admin());
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "admin manage education" on public.education for all using (public.is_site_admin()) with check (public.is_site_admin());
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "admin manage resume" on public.resume for all using (public.is_site_admin()) with check (public.is_site_admin());
exception when duplicate_object then null; end $$;

insert into public.profile (id,name,title,intro,about_lead,about_body,availability,status_text,location,email,phone,linkedin)
values (1,'Bright Bassey','Virtual Assistant · Administrative Assistant · Operations Support Specialist',
'I optimize complex operations by providing proactive administrative, research, documentation, and coordination support, enabling organizations to increase efficiency and achieve key objectives.',
'I bring clarity, structure, and reliable support to busy people and growing businesses.',
'I have remote experience in administration, customer support, research, documentation, and workflow coordination. From managing communications and schedules to organizing information, maintaining systems, and coordinating day-to-day operations, I help turn busy workflows into organized, efficient processes. I don’t just manage tasks. I create the structure that helps work move forward.',
'Available','OPEN TO REMOTE','Lagos · Open to Remote','brightbekanem@gmail.com','+2349060228340','')
on conflict (id) do update set name=excluded.name,title=excluded.title,intro=excluded.intro,about_lead=excluded.about_lead,about_body=excluded.about_body,availability=excluded.availability,status_text=excluded.status_text,location=excluded.location,email=excluded.email,phone=excluded.phone,linkedin=excluded.linkedin,updated_at=now();

insert into public.stats(value,label,sort_order) values ('5+','Years Experience',1),('80%','Response Turnaround',2),('10+','Tools & Platforms',3),('Multi-Channel','Support',4);
insert into public.chips(name,sort_order) values ('Administrative Support',1),('Calendar & Inbox Management',2),('Data Entry',3),('Client Communication',4),('Team Coordination',5),('AI-Assisted Productivity',6),('Workflow Automation',7),('Reporting & Documentation',8);
insert into public.experience(role,company,period,bullets,sort_order) values
('Remote Data Entry Specialist','Conduent · New Jersey, US','Feb. 2024 – Jun. 2026','["Entered and updated information accurately across spreadsheets and databases.","Reviewed data for accuracy, identifying and correcting errors to maintain data integrity.","Maintained and organized digital records, ensuring information remained accessible and up to date.","Managed customer and administrative information, supporting recordkeeping across departments.","Researched and verified information as needed to ensure completeness and accuracy of records.","Used Microsoft Excel and Google Sheets to organize, track, and maintain large volumes of data."]'::jsonb,1),
('Remote Customer Service Representative','Alorica · California, US','Sep. 2022 – Jan. 2024','["Responded to customer inquiries through email, chat, and other digital channels.","Resolved customer concerns and escalated issues when necessary to maintain service quality.","Maintained accurate records of customer interactions and account information using CRM and helpdesk systems.","Followed up on customer requests to ensure timely resolution and a positive experience.","Managed multiple customer inquiries simultaneously while maintaining professionalism and accuracy.","Used Zoho CRM, Freshdesk, and Zendesk to track and respond to customer interactions."]'::jsonb,2),
('Virtual Assistant','Codekago · Uyo, Nigeria','May. 2021 – Jul. 2022','["Provided administrative support including calendar management, email correspondence and document preparation.","Managed scheduling and coordinated tasks across multiple priorities.","Conducted internet research and organized findings into clear, usable documents.","Created professional documents and presentations using Microsoft Office and Google Workspace.","Designed visual content with Canva, Photoshop and Illustrator.","Supported workflow automation using Zapier and Make.com."]'::jsonb,3);
insert into public.skills(category,tags,icon,sort_order) values
('Administrative & Operations','Task Coordination · Project Coordination · Workflow Management','◌',1),('Data & Research','Data Entry · Data Management · Spreadsheet Management · Research','⌁',2),('Productivity Platforms','Microsoft 365 · Google Workspace','◫',3),('Project Management','Asana · Trello · Notion · ClickUp','✦',4),('Communication & Scheduling','Slack · Zoom · Microsoft Teams · Calendly','⌁',5),('CRM Platforms','Contact Management · CRM Data Entry · Helpdesk','◎',6),('Automation','Zapier · Make.com · n8n · App Integrations','↯',7),('Design & Visuals','Canva · Adobe Photoshop · Presentation Design','◒',8),('AI & Digital Tools','ChatGPT · Claude · Gemini · AI-Assisted Research','✧',9);
insert into public.projects(name,category,description,url,tech,sort_order) values
('Inbox Management','Operations Sample','A before-and-after sample showing how I organize and manage a busy inbox so priority emails are handled first.','https://app.notion.com/p/Inbox-Management-Sample-8bfaba617b278212b1a08171f591b629?source=copy_link','Inbox triage · Prioritization · Documentation',1),
('Calendar Management','Coordination Sample','A weekly calendar workflow covering scheduling, focus time, conflict resolution and coordination across multiple time zones.','https://app.notion.com/p/Calendar-Management-Sample-8d2aba617b278251addb81a2da4251ef?source=copy_link','Scheduling · Time zones · Coordination',2),
('Travel Itinerary','Research Sample','Detailed travel planning covering flights, accommodation, ground transport and meeting schedules for domestic and international trips.','https://app.notion.com/p/Travel-Itinerary-Sample-372aba617b2783b2b3ec8141c81024e1?source=copy_link','Research · Logistics · Documentation',3),
('Report / Presentation','Executive Support Sample','Reports and presentations including executive summaries, competitor analysis and operational reporting.','https://app.notion.com/p/Report-Presentation-Sample-02faba617b27828e878001ee58e3f2d5?source=copy_link','Reporting · Analysis · Presentation',4);
insert into public.education(title,body,type,sort_order) values ('Bachelor of Science (B.Sc.)','University of Uyo · 2024','Education',1);

insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types)
values ('resumes','resumes',true,52428800,array['application/pdf','application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
on conflict (id) do nothing;

do $$ begin
  create policy "public read resumes" on storage.objects for select using (bucket_id='resumes');
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "admins insert resumes" on storage.objects for insert with check (bucket_id='resumes' and public.is_site_admin());
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "admins update resumes" on storage.objects for update using (bucket_id='resumes' and public.is_site_admin()) with check (bucket_id='resumes' and public.is_site_admin());
exception when duplicate_object then null; end $$;
do $$ begin
  create policy "admins delete resumes" on storage.objects for delete using (bucket_id='resumes' and public.is_site_admin());
exception when duplicate_object then null; end $$;

-- After creating your admin user in Authentication > Users, add their UUID:
-- insert into public.site_admins(user_id) values ('YOUR-AUTH-USER-UUID');
