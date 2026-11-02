create extension if not exists pg_net with schema extensions;
create extension if not exists pg_cron;

create table if not exists public.notification_preferences (
  user_id uuid primary key references auth.users(id) on delete cascade,
  product_updates_enabled boolean not null default false,
  consented_at timestamptz,
  unsubscribed_at timestamptz,
  updated_at timestamptz not null default now()
);

create table if not exists public.release_notifications (
  id uuid primary key default gen_random_uuid(),
  resource_key text not null unique,
  resource_type text not null,
  resource_name text not null,
  description text not null default '',
  category text not null default '',
  resource_url text not null,
  image_url text,
  total_recipients integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.release_email_deliveries (
  id uuid primary key default gen_random_uuid(),
  release_id uuid not null references public.release_notifications(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  email text not null,
  status text not null default 'pending'
    check (status in ('pending', 'sending', 'sent', 'delivered', 'failed', 'bounced', 'complained', 'cancelled')),
  attempts integer not null default 0 check (attempts >= 0),
  retryable boolean not null default false,
  next_attempt_at timestamptz not null default now(),
  locked_until timestamptz,
  resend_email_id text unique,
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (release_id, user_id)
);

alter table public.release_email_deliveries
  drop constraint if exists release_email_deliveries_status_check;
alter table public.release_email_deliveries
  add constraint release_email_deliveries_status_check
  check (status in (
    'pending', 'sending', 'sent', 'delayed', 'delivered',
    'failed', 'bounced', 'complained', 'cancelled'
  ));

create table if not exists public.release_registry_state (
  singleton boolean primary key default true check (singleton),
  bootstrapped boolean not null default false,
  last_synced_at timestamptz
);

create table if not exists public.release_notification_worker_state (
  singleton boolean primary key default true check (singleton),
  worker_id uuid,
  locked_until timestamptz
);

create table if not exists public.release_registry_resources (
  resource_key text primary key,
  release_id uuid references public.release_notifications(id) on delete set null,
  first_seen_at timestamptz not null default now()
);

create table if not exists public.email_provider_events (
  event_id text primary key,
  event_type text not null,
  resend_email_id text,
  delivery_id uuid references public.release_email_deliveries(id) on delete set null,
  delivery_status text,
  processed_at timestamptz not null default now()
);

create index if not exists email_provider_events_resend_id_idx
  on public.email_provider_events (resend_email_id)
  where resend_email_id is not null;

create index if not exists email_provider_events_delivery_id_idx
  on public.email_provider_events (delivery_id)
  where delivery_id is not null;

create index if not exists release_email_deliveries_queue_idx
  on public.release_email_deliveries (next_attempt_at, created_at)
  where status = 'pending';

create index if not exists release_email_deliveries_lease_idx
  on public.release_email_deliveries (locked_until)
  where status = 'sending';

create index if not exists release_email_deliveries_campaign_idx
  on public.release_email_deliveries (release_id, status);

create index if not exists notification_preferences_enabled_idx
  on public.notification_preferences (user_id)
  where product_updates_enabled;

alter table public.notification_preferences enable row level security;
alter table public.release_notifications enable row level security;
alter table public.release_email_deliveries enable row level security;
alter table public.release_registry_state enable row level security;
alter table public.release_notification_worker_state enable row level security;
alter table public.release_registry_resources enable row level security;
alter table public.email_provider_events enable row level security;

create or replace function public.set_notification_preference(
  p_user_id uuid,
  p_enabled boolean
)
returns void
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $$
begin
  insert into public.notification_preferences (
    user_id,
    product_updates_enabled,
    consented_at,
    unsubscribed_at,
    updated_at
  )
  values (
    p_user_id,
    p_enabled,
    case when p_enabled then now() else null end,
    case when p_enabled then null else now() end,
    now()
  )
  on conflict (user_id) do update
  set product_updates_enabled = excluded.product_updates_enabled,
      consented_at = case
        when excluded.product_updates_enabled then now()
        else public.notification_preferences.consented_at
      end,
      unsubscribed_at = case
        when excluded.product_updates_enabled then null
        else now()
      end,
      updated_at = now();

  if not p_enabled then
    update public.release_email_deliveries
    set status = 'cancelled',
        locked_until = null,
        updated_at = now()
    where user_id = p_user_id
      and status in ('pending', 'sending');
  end if;
end;
$$;

create or replace function public.sync_release_registry(p_items jsonb)
returns integer
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $$
declare
  item record;
  was_inserted integer;
  recipient_count integer;
  release_uuid uuid;
  created_count integer := 0;
  is_bootstrapped boolean;
begin
  if p_items is null or jsonb_typeof(p_items) <> 'array' then
    raise exception 'Registry items must be an array';
  end if;

  insert into public.release_registry_state (singleton)
  values (true)
  on conflict (singleton) do nothing;

  select bootstrapped
  into is_bootstrapped
  from public.release_registry_state
  where singleton = true
  for update;

  if not is_bootstrapped then
    insert into public.release_registry_resources (resource_key)
    select item.resource_key
    from jsonb_to_recordset(p_items) as item(resource_key text)
    where item.resource_key is not null
    on conflict (resource_key) do nothing;

    update public.release_registry_state
    set bootstrapped = true,
        last_synced_at = now()
    where singleton = true;

    return 0;
  end if;

  for item in
    select *
    from jsonb_to_recordset(p_items) as resource(
      resource_key text,
      resource_type text,
      resource_name text,
      description text,
      category text,
      resource_url text,
      image_url text
    )
  loop
    release_uuid := null;
    if item.resource_key is null
      or item.resource_type is null
      or item.resource_name is null
      or item.resource_url is null then
      raise exception 'Registry resource is missing required fields';
    end if;

    insert into public.release_registry_resources (resource_key)
    values (item.resource_key)
    on conflict (resource_key) do nothing;
    get diagnostics was_inserted = row_count;

    if was_inserted = 1 then
      insert into public.release_notifications (
        resource_key,
        resource_type,
        resource_name,
        description,
        category,
        resource_url,
        image_url
      )
      values (
        item.resource_key,
        item.resource_type,
        item.resource_name,
        coalesce(item.description, ''),
        coalesce(item.category, ''),
        item.resource_url,
        item.image_url
      )
      on conflict (resource_key) do nothing
      returning id into release_uuid;

      if release_uuid is not null then
        update public.release_registry_resources
        set release_id = release_uuid
        where resource_key = item.resource_key;

        insert into public.release_email_deliveries (
          release_id,
          user_id,
          email
        )
        select
          release_uuid,
          preference.user_id,
          auth_user.email
        from public.notification_preferences as preference
        join auth.users as auth_user on auth_user.id = preference.user_id
        where preference.product_updates_enabled = true
          and auth_user.email is not null
          and auth_user.email_confirmed_at is not null
        on conflict (release_id, user_id) do nothing;
        get diagnostics recipient_count = row_count;

        update public.release_notifications
        set total_recipients = recipient_count
        where id = release_uuid;

        created_count := created_count + 1;
      end if;
    end if;
  end loop;

  update public.release_registry_state
  set last_synced_at = now()
  where singleton = true;

  return created_count;
end;
$$;

create or replace function public.claim_release_email_deliveries(p_limit integer default 25)
returns table (
  id uuid,
  release_id uuid,
  user_id uuid,
  email text,
  attempts integer,
  resource_name text,
  description text,
  resource_type text,
  category text,
  resource_url text,
  image_url text
)
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $$
begin
  update public.release_email_deliveries
  set status = 'failed',
      retryable = true,
      locked_until = null,
      last_error = 'delivery_lease_expired',
      updated_at = now()
  where status = 'sending'
    and locked_until < now()
    and attempts >= 8;

  return query
  with candidates as (
    select delivery.id
    from public.release_email_deliveries as delivery
    join public.notification_preferences as preference
      on preference.user_id = delivery.user_id
     and preference.product_updates_enabled = true
    join auth.users as auth_user
      on auth_user.id = delivery.user_id
     and auth_user.email_confirmed_at is not null
    where (
      (delivery.status = 'pending' and delivery.next_attempt_at <= now())
      or (delivery.status = 'sending' and delivery.locked_until < now())
    )
      and delivery.attempts < 8
    order by delivery.next_attempt_at, delivery.created_at
    limit greatest(1, least(coalesce(p_limit, 25), 50))
    for update of delivery skip locked
  ),
  claimed as (
    update public.release_email_deliveries as delivery
    set status = 'sending',
        attempts = delivery.attempts + 1,
        locked_until = now() + interval '10 minutes',
        updated_at = now()
    from candidates
    where delivery.id = candidates.id
    returning delivery.*
  )
  select
    claimed.id,
    claimed.release_id,
    claimed.user_id,
    claimed.email,
    claimed.attempts,
    release.resource_name,
    release.description,
    release.resource_type,
    release.category,
    release.resource_url,
    release.image_url
  from claimed
  join public.release_notifications as release
    on release.id = claimed.release_id;
end;
$$;

create or replace function public.try_claim_release_notification_worker(
  p_worker_id uuid
)
returns boolean
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $$
declare
  claimed_count integer;
begin
  if p_worker_id is null then
    raise exception 'Worker id is required';
  end if;

  insert into public.release_notification_worker_state (singleton)
  values (true)
  on conflict (singleton) do nothing;

  update public.release_notification_worker_state
  set worker_id = p_worker_id,
      locked_until = now() + interval '2 minutes'
  where singleton = true
    and (worker_id is null or locked_until < now());
  get diagnostics claimed_count = row_count;

  return claimed_count = 1;
end;
$$;

create or replace function public.release_release_notification_worker(
  p_worker_id uuid
)
returns void
language sql
security definer
set search_path = public, auth, pg_temp
as $$
  update public.release_notification_worker_state
  set worker_id = null,
      locked_until = null
  where singleton = true
    and worker_id = p_worker_id;
$$;

create or replace function public.fail_release_email_delivery(
  p_delivery_id uuid,
  p_error_code text,
  p_retryable boolean
)
returns void
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $$
declare
  delivery_attempts integer;
  should_retry boolean;
begin
  select attempts
  into delivery_attempts
  from public.release_email_deliveries
  where id = p_delivery_id
    and status = 'sending'
  for update;

  if not found then
    return;
  end if;

  should_retry := coalesce(p_retryable, false) and delivery_attempts < 8;

  update public.release_email_deliveries
  set status = case when should_retry then 'pending' else 'failed' end,
      retryable = coalesce(p_retryable, false),
      next_attempt_at = now() + make_interval(
        mins => least(60, power(2, least(delivery_attempts, 6))::integer)
      ),
      locked_until = null,
      last_error = left(coalesce(p_error_code, 'resend_error'), 80),
      updated_at = now()
  where id = p_delivery_id;
end;
$$;

create or replace function public.complete_release_email_delivery(
  p_delivery_id uuid,
  p_resend_email_id text
)
returns void
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $$
declare
  provider_status text;
begin
  select case
    when bool_or(delivery_status = 'complained') then 'complained'
    when bool_or(delivery_status = 'bounced') then 'bounced'
    when bool_or(delivery_status = 'delivered') then 'delivered'
    when bool_or(delivery_status = 'failed') then 'failed'
    when bool_or(delivery_status = 'delayed') then 'delayed'
    when bool_or(delivery_status = 'sent') then 'sent'
    else null
  end
  into provider_status
  from public.email_provider_events
  where resend_email_id = p_resend_email_id
     or delivery_id = p_delivery_id;

  update public.release_email_deliveries
  set status = coalesce(provider_status, 'sent'),
      resend_email_id = p_resend_email_id,
      retryable = false,
      locked_until = null,
      last_error = case
        when provider_status = 'failed' then 'resend_delivery_failed'
        else null
      end,
      updated_at = now()
  where id = p_delivery_id
    and status in ('sending', 'cancelled');
end;
$$;

create or replace function public.apply_resend_email_event(
  p_event_id text,
  p_event_type text,
  p_resend_email_id text,
  p_status text,
  p_delivery_id uuid
)
returns boolean
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $$
declare
  inserted_count integer;
begin
  if p_event_id is null or p_event_type is null then
    raise exception 'Webhook event identifiers are required';
  end if;

  insert into public.email_provider_events (
    event_id,
    event_type,
    resend_email_id,
    delivery_id,
    delivery_status
  )
  values (
    p_event_id,
    p_event_type,
    p_resend_email_id,
    p_delivery_id,
    p_status
  )
  on conflict (event_id) do nothing;
  get diagnostics inserted_count = row_count;

  if inserted_count = 0 then
    return false;
  end if;

  if p_status is not null then
    update public.release_email_deliveries as delivery
    set status = case
          when (case delivery.status
            when 'complained' then 6
            when 'bounced' then 5
            when 'delivered' then 4
            when 'failed' then 3
            when 'delayed' then 2
            when 'sent' then 1
            else 0
          end) >= (case p_status
            when 'complained' then 6
            when 'bounced' then 5
            when 'delivered' then 4
            when 'failed' then 3
            when 'delayed' then 2
            when 'sent' then 1
            else 0
          end)
          then delivery.status
          else p_status
        end,
        resend_email_id = coalesce(delivery.resend_email_id, p_resend_email_id),
        retryable = false,
        locked_until = null,
        last_error = case when p_status = 'failed' then 'resend_delivery_failed' else null end,
        updated_at = now()
    where (resend_email_id = p_resend_email_id or id = p_delivery_id)
      and p_status in (
        'sent', 'delayed', 'delivered', 'failed', 'bounced', 'complained'
      );

    if p_status in ('bounced', 'complained') then
      update public.notification_preferences
      set product_updates_enabled = false,
          unsubscribed_at = now(),
          updated_at = now()
      where user_id in (
        select user_id
        from public.release_email_deliveries
        where resend_email_id = p_resend_email_id or id = p_delivery_id
      );

      update public.release_email_deliveries
      set status = 'cancelled',
          locked_until = null,
          updated_at = now()
      where user_id in (
        select user_id
        from public.release_email_deliveries
        where resend_email_id = p_resend_email_id or id = p_delivery_id
      )
        and status in ('pending', 'sending');
    end if;
  end if;

  return true;
end;
$$;

create or replace function public.retry_release_notification(p_release_id uuid)
returns integer
language plpgsql
security definer
set search_path = public, auth, pg_temp
as $$
declare
  retried_count integer;
begin
  update public.release_email_deliveries as delivery
  set status = 'pending',
      attempts = 0,
      retryable = false,
      next_attempt_at = now(),
      locked_until = null,
      last_error = null,
      email = auth_user.email,
      updated_at = now()
  from public.notification_preferences as preference
  join auth.users as auth_user on auth_user.id = preference.user_id
  where delivery.release_id = p_release_id
    and delivery.user_id = preference.user_id
    and preference.product_updates_enabled = true
    and auth_user.email_confirmed_at is not null
    and delivery.status = 'failed'
    and delivery.retryable = true;

  get diagnostics retried_count = row_count;
  return retried_count;
end;
$$;

create or replace view public.release_notification_stats as
select
  release.id,
  release.resource_key,
  release.resource_type,
  release.resource_name,
  release.description,
  release.category,
  release.created_at,
  release.total_recipients,
  count(delivery.id) filter (
    where delivery.status in (
      'sent', 'delayed', 'delivered', 'bounced', 'complained'
    )
  )::integer as emails_sent,
  count(delivery.id) filter (where delivery.status = 'delivered')::integer as delivered,
  count(delivery.id) filter (where delivery.status = 'failed')::integer as failed,
  count(delivery.id) filter (
    where delivery.status = 'failed' and delivery.retryable
  )::integer as retryable_failed,
  count(delivery.id) filter (where delivery.status = 'bounced')::integer as bounced,
  count(delivery.id) filter (where delivery.status = 'complained')::integer as complained,
  count(delivery.id) filter (
    where delivery.status in ('pending', 'sending')
  )::integer as pending,
  count(delivery.id) filter (where delivery.status = 'delayed')::integer as delayed
from public.release_notifications as release
left join public.release_email_deliveries as delivery
  on delivery.release_id = release.id
group by release.id;

revoke all on public.notification_preferences from public, anon, authenticated;
revoke all on public.release_notifications from public, anon, authenticated;
revoke all on public.release_email_deliveries from public, anon, authenticated;
revoke all on public.release_registry_state from public, anon, authenticated;
revoke all on public.release_notification_worker_state from public, anon, authenticated;
revoke all on public.release_registry_resources from public, anon, authenticated;
revoke all on public.email_provider_events from public, anon, authenticated;
revoke all on public.release_notification_stats from public, anon, authenticated;
grant all on public.notification_preferences to service_role;
grant all on public.release_notifications to service_role;
grant all on public.release_email_deliveries to service_role;
grant all on public.release_registry_state to service_role;
grant all on public.release_notification_worker_state to service_role;
grant all on public.release_registry_resources to service_role;
grant all on public.email_provider_events to service_role;
grant select on public.release_notification_stats to service_role;

revoke all on function public.set_notification_preference(uuid, boolean) from public, anon, authenticated;
revoke all on function public.sync_release_registry(jsonb) from public, anon, authenticated;
revoke all on function public.claim_release_email_deliveries(integer) from public, anon, authenticated;
revoke all on function public.try_claim_release_notification_worker(uuid) from public, anon, authenticated;
revoke all on function public.release_release_notification_worker(uuid) from public, anon, authenticated;
revoke all on function public.fail_release_email_delivery(uuid, text, boolean) from public, anon, authenticated;
revoke all on function public.complete_release_email_delivery(uuid, text) from public, anon, authenticated;
revoke all on function public.apply_resend_email_event(text, text, text, text, uuid) from public, anon, authenticated;
revoke all on function public.retry_release_notification(uuid) from public, anon, authenticated;
grant execute on function public.set_notification_preference(uuid, boolean) to service_role;
grant execute on function public.sync_release_registry(jsonb) to service_role;
grant execute on function public.claim_release_email_deliveries(integer) to service_role;
grant execute on function public.try_claim_release_notification_worker(uuid) to service_role;
grant execute on function public.release_release_notification_worker(uuid) to service_role;
grant execute on function public.fail_release_email_delivery(uuid, text, boolean) to service_role;
grant execute on function public.complete_release_email_delivery(uuid, text) to service_role;
grant execute on function public.apply_resend_email_event(text, text, text, text, uuid) to service_role;
grant execute on function public.retry_release_notification(uuid) to service_role;

create or replace function public.dispatch_release_notification_worker(
  p_only_if_pending boolean default false
)
returns void
language plpgsql
security definer
set search_path = public, vault, net, pg_temp
as $$
declare
  worker_url text;
  worker_secret text;
begin
  if p_only_if_pending and (
    not exists (
      select 1
      from public.release_email_deliveries as delivery
      where (
        (delivery.status = 'pending' and delivery.next_attempt_at <= now())
        or (delivery.status = 'sending' and delivery.locked_until < now())
      )
      limit 1
    )
    or exists (
      select 1
      from public.release_notification_worker_state
      where singleton = true
        and locked_until > now()
    )
  ) then
    return;
  end if;

  select decrypted_secret
  into worker_url
  from vault.decrypted_secrets
  where name = 'release_notification_worker_url'
  order by created_at desc
  limit 1;

  select decrypted_secret
  into worker_secret
  from vault.decrypted_secrets
  where name = 'release_notification_worker_secret'
  order by created_at desc
  limit 1;

  if worker_url is null or worker_secret is null then
    if not p_only_if_pending then
      raise warning 'Release notification worker dispatch is not configured in Supabase Vault';
    end if;
    return;
  end if;

  perform net.http_post(
    url := worker_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || worker_secret
    ),
    body := '{}'::jsonb,
    timeout_milliseconds := 60000
  );
end;
$$;

create or replace function public.dispatch_new_release_notification_worker()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  perform public.dispatch_release_notification_worker(false);
  return new;
end;
$$;

drop trigger if exists release_notification_worker_dispatch
  on public.release_notifications;
create trigger release_notification_worker_dispatch
after insert on public.release_notifications
for each row
execute function public.dispatch_new_release_notification_worker();

revoke all on function public.dispatch_release_notification_worker(boolean)
  from public, anon, authenticated, service_role;
revoke all on function public.dispatch_new_release_notification_worker()
  from public, anon, authenticated, service_role;

do $$
declare
  recovery_job_id bigint;
begin
  select jobid
  into recovery_job_id
  from cron.job
  where jobname = 'bagui-release-notification-recovery'
  limit 1;

  if recovery_job_id is not null then
    perform cron.unschedule(recovery_job_id);
  end if;

  perform cron.schedule(
    'bagui-release-notification-recovery',
    '* * * * *',
    'select public.dispatch_release_notification_worker(true);'
  );
end;
$$;
