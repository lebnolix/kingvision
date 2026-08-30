# update-user-status

Ye Edge Function raw IP ko database me save nahi karti. Request IP ko server-side
`IP_HASH_SALT` ke saath SHA-256 hash karke `user_data.ip_hash` me rakhti hai.

## Supabase secrets

Supabase dashboard me Function secrets set karein:

```text
ADMIN_KEY=<service role key>
IP_HASH_SALT=<random long secret>
```

`SUPABASE_URL` Supabase runtime provide karta hai. Service-role key ko app,
GitHub ya client-side JavaScript me kabhi na rakhein.

## Required database constraint

`upsert(..., { onConflict: 'user_id' })` ke liye `user_id` unique hona chahiye:

```sql
create unique index if not exists user_data_user_id_key
on public.user_data (user_id);
```
