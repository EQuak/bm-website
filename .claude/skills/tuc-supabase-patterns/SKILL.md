---
name: supabase-patterns
description: Supabase patterns for storage, realtime, and db integration. Use when handling uploads, signed URLs, Realtime publications, or combining Supabase with Drizzle.
---

# Supabase patterns

## Buckets & Naming

- Default buckets: `public_files`, `items_images`, `profile_avatars`, `employee_files`, `application_files`, `reference_material_files`, `email_attachments`, `company_videos`, `forklift_pdfs`, `boom_pdfs`, `scissors_pdfs`, `hr_conversions`, `ticket_attachments`.
- Size limits: items images 10MB; profile avatars 5MB; email attachments 10MB; company videos 500MB.
- Path patterns:
  - HR conversions: `{userId}/{timestamp}_{sanitizedFileName}` (no upsert).
  - Employee files: `{profileId}/certification_{timestamp}.ext` or `{profileId}/{folder}.ext` with upsert for overwrite.
  - Ticket attachments: `{ticketReference}/{nanoid}.{ext}` (sanitize svg+xml → svg).
  - Cached PDFs/videos: use bucket-specific helper to resolve bucket by type.

## Upload Patterns

- Server uploads (hr_conversions): set `contentType`, `upsert: false`, sanitize filename, prepend timestamp, return `{ path, fullPath }`.
- Base64 uploads: decode to Buffer/string before upload (CSV/XLSX/PDF).
- Client uploads (supabaseBrowserClient): use `cacheControl: "0"`, `upsert: true` when overwriting (avatars, signatures, dl photos).
- Signed URLs: use short TTLs (60s for employee files, 600s for tickets, 86400s for PDFs, 3600s default HR). Prefer signed URLs over public except public buckets.
- Deletion: use `.remove([...paths])`; no-op on empty list.
- Public URL: only when bucket is public; otherwise use signed URL helpers.

## Realtime Patterns

- Publications: add tables to `supabase_realtime` (staffing\_\* tables, employee_notes/information, projects, staffing_logs, inventory tables/views).
- RLS: enable on realtime tables; policies usually `authenticated USING (true)` for broadcast consumption.
- Inventory broadcast (SQL):
  - Trigger functions per table (items, inventory_transactions, work_orders, work_orders_items, buildings, areas, locations).
  - `realtime.send` payload includes `data`, `change_context`, `timestamp`, `action`, `item_sku`.
  - Two channels: general `items_inventory_summary_v` (full table) and specific `items_inventory_summary_v_{sku}`.
  - Maintenance mode guard: check `system_settings.maintenance_mode`; skip sends when true; helper functions to enable/disable.
- Staffing realtime (SQL): add staffing tables to publication; open authenticated policies.

## Supabase + Drizzle Integration

- tRPC context exposes `ctx.supabase`, `ctx.supabaseAdmin`, `ctx.db`.
- Pattern: perform storage upload/removal with Supabase, persist metadata with Drizzle.
  - Example: `createTicketAttachments` inserts rows with `objectId` + `uploadedBy`; `getTicketAttachments` fetches rows and generates signed URLs per attachment.
  - Example: HR conversions: upload file → store paths → create signed URL for download.
- Deletion: call Supabase `remove`, then clean DB rows if needed.
- Admin client (SSR): use `createServerClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)` with `autoRefreshToken: false`, `detectSessionInUrl: false`.

## Do / Never

- DO sanitize filenames, include timestamp/nanoid to avoid collisions.
- DO set `contentType` and `upsert` consciously (upsert true only when overwriting expected).
- DO keep signed URL TTL short for private buckets.
- DO gate realtime broadcasts with maintenance mode when running bulk ops.
- NEVER assume bucket is public; default to signed URLs.
- NEVER skip RLS/policies when adding tables to realtime publication.
- NEVER broadcast without checking table/view data exists.

## Quick Snippets

- Signed URL:
  ```ts
  const { data } = await supabase.storage
    .from("ticket_attachments")
    .createSignedUrl(path, 600);
  const url = data?.signedUrl ?? null;
  ```
- Upload (server, HR):
  ```ts
  const path = `${userId}/${Date.now()}_${safeName}`;
  const { data, error } = await supabase.storage
    .from("hr_conversions")
    .upload(path, buffer, { contentType: "text/csv", upsert: false });
  ```
- Upload (client, profile file overwrite):
  ```ts
  await supabaseBrowserClient.storage
    .from(DEFAULT_EMPLOYEE_FILES_BUCKET)
    .upload(path, file, { cacheControl: "0", upsert: true });
  ```
- Realtime broadcast (SQL):
  ```sql
  PERFORM realtime.send(
    jsonb_build_object('data', payload, 'action', 'inventory_item_updated'),
    'UPDATE', 'items_inventory_summary_v_' || sku, true
  );
  ```
