create table public.conversion_logs (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users not null,
    from_currency text not null,
    to_currency text not null,
    amount numeric not null,
    converted_amount numeric not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Set up Row Level Security (RLS)
alter table public.conversion_logs enable row level security;

create policy "Users can view their own conversion logs"
    on public.conversion_logs for select
    using (auth.uid() = user_id);

create policy "Users can insert their own conversion logs"
    on public.conversion_logs for insert
    with check (auth.uid() = user_id);

create policy "Users can delete their own conversion logs"
    on public.conversion_logs for delete
    using (auth.uid() = user_id);
