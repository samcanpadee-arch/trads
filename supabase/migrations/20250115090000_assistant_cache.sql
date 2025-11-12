create extension if not exists moddatetime schema extensions;

-- Cache OpenAI file metadata to avoid repeated full listings
create table if not exists openai_file_cache (
  stable_name text primary key,
  file_id text not null,
  original_name text,
  size_bytes bigint,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

create trigger openai_file_cache_set_updated_at
before update on openai_file_cache
for each row
execute function extensions.moddatetime (updated_at);

-- Track temporary assistant vector stores per Supabase session
create table if not exists assistant_vector_sessions (
  scope_id text primary key,
  user_id uuid references auth.users on delete cascade,
  vector_store_id text not null,
  created_at timestamp with time zone default now() not null,
  last_used_at timestamp with time zone default now() not null
);

create trigger assistant_vector_sessions_set_last_used_at
before update on assistant_vector_sessions
for each row
execute function extensions.moddatetime (last_used_at);
