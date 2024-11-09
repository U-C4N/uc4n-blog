-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create posts table
create table public.posts (
    id uuid default uuid_generate_v4() primary key,
    title text not null,
    content text not null,
    slug text not null,
    published boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create projects table
create table public.projects (
    id uuid default uuid_generate_v4() primary key,
    title text not null,
    description text not null,
    icon text not null,
    is_current_focus boolean default false,
    category text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.posts enable row level security;
alter table public.projects enable row level security;

-- Create indexes
create index posts_slug_idx on public.posts (slug);
create index projects_category_idx on public.projects (category);

-- Create updated_at trigger function
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at
create trigger handle_posts_updated_at
    before update on public.posts
    for each row
    execute function public.handle_updated_at();

create trigger handle_projects_updated_at
    before update on public.projects
    for each row
    execute function public.handle_updated_at();

-- Create policies for public access (no authentication required for any operation)
create policy "Enable all access"
    on public.posts
    for all
    using (true)
    with check (true);

create policy "Enable all access"
    on public.projects
    for all
    using (true)
    with check (true);

-- Grant access to public
grant all on public.posts to anon;
grant all on public.projects to anon;