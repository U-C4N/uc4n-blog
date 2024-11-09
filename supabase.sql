-- Add admin policies for posts
create policy "Enable admin insert access" on public.posts for
insert with check (auth.role() = 'authenticated');

create policy "Enable admin update access" on public.posts for
update using (auth.role() = 'authenticated');

create policy "Enable admin delete access" on public.posts for
delete using (auth.role() = 'authenticated');

-- Add admin policies for projects
create policy "Enable admin insert access" on public.projects for
insert with check (auth.role() = 'authenticated');

create policy "Enable admin update access" on public.projects for
update using (auth.role() = 'authenticated');

create policy "Enable admin delete access" on public.projects for
delete using (auth.role() = 'authenticated');