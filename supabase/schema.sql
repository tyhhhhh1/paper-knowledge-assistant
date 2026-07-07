create extension if not exists vector;

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  file_url text not null,
  status text not null default 'uploaded',
  page_count integer not null default 0,
  chunk_count integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.document_chunks (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.documents(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  page_number integer not null,
  chunk_index integer not null,
  embedding vector(1536),
  created_at timestamptz not null default now()
);

create table if not exists public.qa_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  question text not null,
  answer text not null,
  sources jsonb not null default '[]'::jsonb,
  latency_ms integer,
  created_at timestamptz not null default now()
);

create table if not exists public.eval_cases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  document_id uuid references public.documents(id) on delete cascade,
  question text not null,
  expected_keywords text[] not null default '{}',
  expected_source_pages integer[] not null default '{}',
  created_at timestamptz not null default now()
);

alter table public.documents enable row level security;
alter table public.document_chunks enable row level security;
alter table public.qa_logs enable row level security;
alter table public.eval_cases enable row level security;

create policy "Users can read own documents"
on public.documents for select
using (auth.uid() = user_id);

create policy "Users can insert own documents"
on public.documents for insert
with check (auth.uid() = user_id);

create policy "Users can update own documents"
on public.documents for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own documents"
on public.documents for delete
using (auth.uid() = user_id);

create policy "Users can read own chunks"
on public.document_chunks for select
using (auth.uid() = user_id);

create policy "Users can insert own chunks"
on public.document_chunks for insert
with check (auth.uid() = user_id);

create policy "Users can read own qa logs"
on public.qa_logs for select
using (auth.uid() = user_id);

create policy "Users can insert own qa logs"
on public.qa_logs for insert
with check (auth.uid() = user_id);

create policy "Users can manage own eval cases"
on public.eval_cases for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create index if not exists document_chunks_embedding_idx
on public.document_chunks
using ivfflat (embedding vector_cosine_ops)
with (lists = 100);

create or replace function public.match_document_chunks(
  query_embedding vector(1536),
  match_user_id uuid,
  match_document_id uuid default null,
  match_count integer default 5
)
returns table (
  id uuid,
  document_id uuid,
  content text,
  page_number integer,
  chunk_index integer,
  similarity double precision
)
language sql
stable
as $$
  select
    dc.id,
    dc.document_id,
    dc.content,
    dc.page_number,
    dc.chunk_index,
    1 - (dc.embedding <=> query_embedding) as similarity
  from public.document_chunks dc
  where dc.user_id = match_user_id
    and (match_document_id is null or dc.document_id = match_document_id)
  order by dc.embedding <=> query_embedding
  limit match_count;
$$;
