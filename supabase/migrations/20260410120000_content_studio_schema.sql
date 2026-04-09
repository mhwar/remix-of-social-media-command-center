-- ============================================================================
-- Content Studio Schema
-- Adds rich client profiles + brand guides + projects + content tasks
-- for the AI-context content management feature.
-- ============================================================================

-- Helpful trigger for maintaining updated_at timestamps
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ----------------------------------------------------------------------------
-- clients_brands — rich client profiles (separate from Lovable mock 'clients')
-- ----------------------------------------------------------------------------
create table if not exists public.clients_brands (
  id uuid primary key default gen_random_uuid(),
  name_ar text not null,
  name_en text,
  industry text,
  description text,
  website text,
  contact_email text,
  contact_phone text,
  logo_url text,
  status text not null default 'ACTIVE' check (status in ('ACTIVE','PAUSED','ARCHIVED')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists clients_brands_updated_at on public.clients_brands;
create trigger clients_brands_updated_at
before update on public.clients_brands
for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- brand_guides — one-to-one with clients_brands
-- ----------------------------------------------------------------------------
create table if not exists public.brand_guides (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null unique references public.clients_brands(id) on delete cascade,

  -- Visual identity
  primary_color text,
  secondary_color text,
  accent_colors jsonb default '[]'::jsonb,
  font_arabic text,
  font_latin text,
  logo_variants jsonb,

  -- Editorial policy
  tone_of_voice text,           -- formal | professional | friendly | casual | authoritative | inspirational
  brand_persona text,
  preferred_terms jsonb default '[]'::jsonb,
  forbidden_terms jsonb default '[]'::jsonb,
  languages jsonb default '["ar"]'::jsonb,

  -- Audience & platforms
  target_audience text,
  personas jsonb default '[]'::jsonb,
  platforms jsonb default '[]'::jsonb,
  posting_schedule jsonb,

  -- Media policy
  media_policy text,
  legal_notes text,
  hashtag_strategy text,

  -- Samples
  sample_content jsonb default '[]'::jsonb,
  reference_links jsonb default '[]'::jsonb,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists brand_guides_updated_at on public.brand_guides;
create trigger brand_guides_updated_at
before update on public.brand_guides
for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- content_projects — groups of related content tasks per client
-- ----------------------------------------------------------------------------
create table if not exists public.content_projects (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients_brands(id) on delete cascade,
  title text not null,
  description text,
  status text not null default 'PLANNING' check (status in ('PLANNING','ACTIVE','COMPLETED','ON_HOLD')),
  start_date timestamptz,
  end_date timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists content_projects_updated_at on public.content_projects;
create trigger content_projects_updated_at
before update on public.content_projects
for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- content_tasks — individual pieces of content
-- ----------------------------------------------------------------------------
create table if not exists public.content_tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.content_projects(id) on delete cascade,
  title text not null,
  description text,
  status text not null default 'IDEA' check (status in ('IDEA','WRITING','REVIEW','APPROVED','PUBLISHED')),
  priority text not null default 'MEDIUM' check (priority in ('LOW','MEDIUM','HIGH','URGENT')),
  assignee_name text,
  due_date timestamptz,
  publish_date timestamptz,
  platform text,
  content_type text,
  content_body text,
  ai_generated boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists content_tasks_updated_at on public.content_tasks;
create trigger content_tasks_updated_at
before update on public.content_tasks
for each row execute function public.set_updated_at();

create index if not exists content_tasks_project_idx on public.content_tasks (project_id);
create index if not exists content_tasks_status_idx on public.content_tasks (status);
create index if not exists content_projects_client_idx on public.content_projects (client_id);

-- ----------------------------------------------------------------------------
-- Row Level Security
-- Permissive policies to start — tighten in production based on auth.uid()
-- ----------------------------------------------------------------------------
alter table public.clients_brands enable row level security;
alter table public.brand_guides enable row level security;
alter table public.content_projects enable row level security;
alter table public.content_tasks enable row level security;

-- Public read/write (replace with auth-based policies once you add auth)
drop policy if exists "clients_brands public access" on public.clients_brands;
create policy "clients_brands public access" on public.clients_brands for all using (true) with check (true);

drop policy if exists "brand_guides public access" on public.brand_guides;
create policy "brand_guides public access" on public.brand_guides for all using (true) with check (true);

drop policy if exists "content_projects public access" on public.content_projects;
create policy "content_projects public access" on public.content_projects for all using (true) with check (true);

drop policy if exists "content_tasks public access" on public.content_tasks;
create policy "content_tasks public access" on public.content_tasks for all using (true) with check (true);

-- ----------------------------------------------------------------------------
-- Seed data — one sample client to verify the UI
-- ----------------------------------------------------------------------------
insert into public.clients_brands (id, name_ar, name_en, industry, description, website, contact_email, contact_phone, status)
values (
  '11111111-1111-1111-1111-111111111111',
  'شركة نور للتقنية',
  'Noor Tech',
  'التقنية والبرمجيات',
  'شركة متخصصة في حلول البرمجيات السحابية والذكاء الاصطناعي للشركات الصغيرة والمتوسطة.',
  'https://noor.tech',
  'hello@noor.tech',
  '+966500000000',
  'ACTIVE'
) on conflict (id) do nothing;

insert into public.brand_guides (
  client_id, primary_color, secondary_color, accent_colors,
  font_arabic, font_latin, tone_of_voice, brand_persona,
  preferred_terms, forbidden_terms, languages,
  target_audience, platforms, posting_schedule,
  media_policy, legal_notes, hashtag_strategy,
  sample_content, reference_links
) values (
  '11111111-1111-1111-1111-111111111111',
  '#0F766E',
  '#F59E0B',
  '["#1E293B","#F1F5F9"]'::jsonb,
  'IBM Plex Sans Arabic',
  'Inter',
  'professional',
  'نتحدث كخبير تقني ودود يبسّط المفاهيم المعقدة للمستخدم غير التقني.',
  '["الحلول السحابية","الأتمتة الذكية","تجربة المستخدم","التحول الرقمي"]'::jsonb,
  '["رخيص","بسيط جداً","مشكلة"]'::jsonb,
  '["ar","en"]'::jsonb,
  'أصحاب ومدراء الشركات الصغيرة والمتوسطة في السعودية والخليج، أعمارهم 28-50.',
  '["twitter","linkedin","instagram"]'::jsonb,
  '{"twitter":"9:00 ص، 1:00 م، 8:00 م","linkedin":"10:00 ص، 5:00 م"}'::jsonb,
  'الالتزام بالمصداقية، عدم المبالغة في الإعلانات، عدم ذكر المنافسين بأسمائهم. مراعاة القيم المحلية.',
  'عدم ذكر عملاء دون إذن كتابي. عدم استخدام صور غير مرخصة.',
  'هاشتاقات موحدة: #نور_للتقنية #التحول_الرقمي #الذكاء_الاصطناعي — 3 إلى 5 لكل منشور.',
  '["اكتشف كيف تُمكّن الأتمتة الذكية فريقك من التركيز على ما يهم حقاً — نمو أعمالك. #نور_للتقنية","التحول الرقمي لم يعد خياراً، بل ضرورة. نحن هنا لنرافقك في كل خطوة."]'::jsonb,
  '["https://noor.tech/blog","https://noor.tech/case-studies"]'::jsonb
) on conflict (client_id) do nothing;
