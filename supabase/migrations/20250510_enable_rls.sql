-- Enable RLS
alter table documents enable row level security;

-- Policy: owners can select
create policy "Documents are selectable by owner" on documents
for select using (auth.uid() = user_id);

-- Policy: owners can insert
create policy "Owners can insert documents" on documents
for insert with check (auth.uid() = user_id);

-- Policy: owners can update
create policy "Owners can update their documents" on documents
for update using (auth.uid() = user_id); 