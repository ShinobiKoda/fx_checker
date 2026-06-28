-- favorite_pairs
create table favorite_pairs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users not null,
  from_currency text not null,
  to_currency text not null,
  created_at timestamptz default now()
);

alter table favorite_pairs enable row level security;

create policy "Users own their favorites"
  on favorite_pairs for all using (auth.uid() = user_id);
