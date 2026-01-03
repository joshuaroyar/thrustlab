# Database Migration Instructions

## Migration Needed: Add activity_scores table

The backend for score handling requires a new database table. Here are the options to apply the migration:

### Option 1: Using Docker Compose (Recommended if using local DB)

If your database is running via Docker Compose:

```bash
# Start the database if not already running
npm run db:start

# In a new terminal, connect to the database
docker compose exec -it postgres psql -U postgres -d thrustlab

# Then copy and paste the SQL from MIGRATION-ACTIVITY-SCORES.sql
# Or run it directly:
docker compose exec -T postgres psql -U postgres -d thrustlab < MIGRATION-ACTIVITY-SCORES.sql
```

### Option 2: Using psql directly

If you have PostgreSQL client installed:

```bash
# Using the DATABASE_URL from your .env file
psql $DATABASE_URL < MIGRATION-ACTIVITY-SCORES.sql

# Or connect interactively
psql $DATABASE_URL
# Then paste the contents of MIGRATION-ACTIVITY-SCORES.sql
```

### Option 3: Using Supabase Dashboard

If you're using Supabase:

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy the contents of `MIGRATION-ACTIVITY-SCORES.sql`
4. Paste and run it

### Option 4: Using a Database GUI

Tools like pgAdmin, DBeaver, or TablePlus:

1. Connect to your database
2. Open a SQL query window
3. Copy and paste the contents of `MIGRATION-ACTIVITY-SCORES.sql`
4. Execute the query

## Verification

After running the migration, verify it worked:

```sql
-- Check if table exists
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'activity_scores';

-- Check columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'activity_scores';

-- Check indexes
SELECT indexname 
FROM pg_indexes 
WHERE tablename = 'activity_scores';
```

You should see:
- ✅ Table `activity_scores` exists
- ✅ 6 columns (id, user_id, activity_type, score, completed_at, metadata)
- ✅ 3 indexes created

## What This Migration Does

1. Creates the `activity_scores` table
2. Adds a foreign key to the `user` table
3. Creates indexes for:
   - Fast user lookups
   - Activity type filtering
   - Combined user + activity queries

## Next Steps

Once the migration is complete, the score saving functionality will work automatically in the Assembly & Disassembly activity.
