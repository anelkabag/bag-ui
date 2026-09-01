-- =========================================================
-- 1. Table
-- =========================================================

create table if not exists public.component_downloads (
    id uuid primary key default gen_random_uuid(),
    component text not null,
    project_id uuid not null,
    user_id uuid null references auth.users(id),
    cli_version text,
    os text,
    created_at timestamptz not null default now()
);


-- =========================================================
-- 2. Index
-- =========================================================

create index if not exists component_downloads_component_idx
    on public.component_downloads (component);

create index if not exists component_downloads_project_id_idx
    on public.component_downloads (project_id);

create index if not exists component_downloads_created_at_idx
    on public.component_downloads (created_at);

create index if not exists component_downloads_user_id_idx
    on public.component_downloads (user_id);


-- =========================================================
-- 3. Activer RLS
-- =========================================================

alter table public.component_downloads enable row level security;


-- =========================================================
-- 4. Policies
-- =========================================================

-- Supprime les policies existantes si elles existent
drop policy if exists "Anyone can record component downloads"
    on public.component_downloads;

drop policy if exists "Users can view their own downloads"
    on public.component_downloads;


-- Permet aux utilisateurs connectés ET anonymes
-- d'enregistrer un téléchargement.
create policy "Anyone can record component downloads"
on public.component_downloads
for insert
to anon, authenticated
with check (
    user_id is null
    or user_id = auth.uid()
);


-- Un utilisateur connecté peut uniquement consulter
-- ses propres téléchargements.
create policy "Users can view their own downloads"
on public.component_downloads
for select
to authenticated
using (
    user_id = auth.uid()
);
