create table if not exists public.component_downloads (
    id uuid primary key default gen_random_uuid(),
    component text not null,
    project_id uuid not null,
    user_id uuid null references auth.users(id),
    cli_version text,
    os text,
    created_at timestamptz default now()
);

create index if not exists component_downloads_component_idx on public.component_downloads (component);
create index if not exists component_downloads_project_id_idx on public.component_downloads (project_id);
create index if not exists component_downloads_created_at_idx on public.component_downloads (created_at);
create index if not exists component_downloads_user_id_idx on public.component_downloads (user_id);
