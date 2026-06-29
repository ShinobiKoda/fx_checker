create table public.rate_alerts (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users not null,
    from_currency text not null,
    to_currency text not null,
    target_rate numeric not null,
    condition text not null check (condition in ('above', 'below')),
    triggered boolean default false not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table public.rate_alerts enable row level security;

create policy "Users can view their own rate alerts"
    on public.rate_alerts for select
    using (auth.uid() = user_id);

create policy "Users can insert their own rate alerts"
    on public.rate_alerts for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own rate alerts"
    on public.rate_alerts for update
    using (auth.uid() = user_id)
    with check (auth.uid() = user_id);

create policy "Users can delete their own rate alerts"
    on public.rate_alerts for delete
    using (auth.uid() = user_id);
