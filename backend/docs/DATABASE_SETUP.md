# RembukTani Database Schema Setup Guide

**Status**: M2 Vertical Slice  
**Date**: 2026-09-05  
**Database**: Supabase (PostgreSQL)

---

## Overview

This guide walks through setting up the RembukTani database schema on Supabase for the M2 vertical slice.

The schema implements the full decision support flow:
```
User Profile → Land → Crop Context → Decision Case → Evidence → Assessment → Action Options → Decision Record → Decision Brief
```

---

## What's Included

### Migration Files: `001_init_rembuktani_schema.sql` and `002_decision_record_audit_and_assessment_evidence.sql`

- **13 tables** with complete relationships
- **Constraints** (PK, FK, unique, check)
- **Indexes** for query performance
- **Row-Level Security (RLS)** policies
- **Triggers** for automatic `updated_at` timestamps
- **JSONB fields** for flexible evidence/assessment payloads
- **Assessment-to-evidence links** for canonical many-to-many traceability
- **Decision audit snapshots** with human authority and revision references

### TypeScript Types: `src/domain/types.ts`

- Type definitions for all 13 tables
- Input/output types for CRUD operations
- Enum types for statuses and enums
- Aggregate types for common queries

---

## Setup Steps

### Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Note your:
   - Project ID
   - API URL
   - Service Role Key (for backend)
   - Anon Key (for frontend)

### Step 2: Copy Migration SQL

1. Navigate to your Supabase project dashboard
2. Go to **SQL Editor**
3. Click **New Query**
4. Paste the entire contents of `backend/migrations/001_init_rembuktani_schema.sql`
5. Click **Run**
6. Paste and run `backend/migrations/002_decision_record_audit_and_assessment_evidence.sql`
7. Verify all tables and indexes are created

**⚠️ Important**: Supabase's default SQL editor may have limits. If the migration is too large:
- Split into smaller queries
- Or use the Supabase CLI (recommended for production)

### Step 3: Verify Schema

Run these verification queries in the SQL Editor:

```sql
-- List all created tables
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check profiles table structure
\d profiles

-- Verify indexes
SELECT indexname FROM pg_indexes WHERE schemaname = 'public' ORDER BY indexname;

-- Check RLS policies
SELECT schemaname, tablename, policyname FROM pg_policies WHERE schemaname = 'public';
```

### Step 4: Configure Environment Variables

Create or update `.env.local` in the `backend/` directory:

```env
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_JWT_SECRET=your-jwt-secret

# Database connection (direct)
DATABASE_URL=postgresql://postgres:password@db.your-project.supabase.co:5432/postgres
```

### Step 5: Install Supabase Client

In `backend/package.json`, ensure dependencies include:

```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.39.0"
  }
}
```

Run:
```bash
npm install
```

### Step 6: Test Connection

Create `backend/src/config/database.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);
```

Test connection with a simple script:

```typescript
import { supabase } from './config/database';

async function testConnection() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .limit(1);
  
  if (error) {
    console.error('Connection failed:', error);
  } else {
    console.log('Connection successful!');
  }
}

testConnection();
```

---

## Schema Highlights

### Key Design Decisions

#### 1. **Profiles ↔ Auth Users**

- `profiles.user_id` is NOT a foreign key constraint to `auth.users`
- Reason: `auth.users` is managed by Supabase Auth system
- Must manually sync profile creation on user signup (see below)

```typescript
// In your auth signup handler:
async function onAuthSignup(user: AuthUser) {
  await supabase
    .from('profiles')
    .insert({
      user_id: user.id,
      display_name: user.email.split('@')[0],
      role: 'farmer' // default role
    });
}
```

#### 2. **Lands: Location Resolution**

- `latitude, longitude` are required for M2
- `adm4_code` is populated by location resolver service
- `location_source` tracks the origin (manual, BMKG, geocoding)
- No polygon/GIS for M2 (added complexity not needed)

#### 3. **Crop Contexts: No Overwrite**

- Each season, a new `crop_context` is created
- Old contexts remain for historical reference
- **Constraint**: Only 1 active crop per land
  ```sql
  UNIQUE (land_id) WHERE is_active = TRUE
  ```

#### 4. **Decision Cases: Status Flow**

```
draft 
  ↓
collecting_evidence 
  ↓
assessed 
  ↓
review_pending (optional)
  ↓
ready_for_decision 
  ↓
decided
```

#### 5. **Evidence: Type Agnostic**

- Single `decision_case_evidence` table stores all evidence types
- `type` field differentiates: `bmkg_forecast`, `field_pulse`, `crop_context`, etc.
- `payload` is JSONB — flexible for any evidence structure
- `is_mock` flag marks demo/test data

#### 6. **Assessments: Non-Authoritative**

- Assessment output from reasoning engine
- Not a decision — human makes the final call
- Multiple assessments possible per decision case (versions)

#### 7. **Decision Records: Immutable Authority**

- Final human decision stored here
- `decision_type` indicates how decision was made:
  - `selected_option`: User chose from system options
  - `custom`: User wrote custom decision
  - `deferred`: Decision postponed

#### 8. **Trusted Reviews: Optional Gate**

- Not required — users can decide without review
- Provides optional human validation layer
- Reviewer is NOT the decision maker (separate roles)

---

## Row-Level Security (RLS)

**All sensitive tables have RLS enabled.**

### Key Policies

#### Profiles
- ✅ SELECT: Anyone can view profiles
- ✅ UPDATE: Only own profile

#### Lands
- ✅ SELECT/INSERT/UPDATE/DELETE: Only by owner

#### Nested Access (via land)
- Crop Contexts
- Decision Cases
- Evidence
- Assessments
- Action Options
- Decision Records
- Decision Briefs

All controlled through: `land.owner_id` → `auth.uid()`

### Testing RLS

```typescript
// Test as authenticated user
const { data, error } = await supabase.auth.signIn({
  email: 'test@example.com',
  password: 'password'
});

// Query lands (should only see own)
const { data: lands } = await supabase
  .from('lands')
  .select('*');
// Returns: only lands where owner_id matches auth.uid()
```

---

## Migration Safety

### Rollback Plan

If migration fails:

1. **Identify error** in SQL Editor output
2. **Fix SQL** in migration file
3. **Delete problematic table** manually (if partial creation)
4. **Re-run migration**

If major issues:

1. Go to Supabase Dashboard → Project Settings → Database
2. Click "Reset Database" (⚠️ loses all data)
3. Run migration again

### Pre-Production Checklist

- [ ] Migration runs without errors
- [ ] All 13 tables created
- [ ] All indexes present
- [ ] RLS policies applied
- [ ] Triggers functional (`updated_at` auto-updates)
- [ ] Test connection from backend succeeds
- [ ] Sample data inserted successfully
- [ ] RLS policies block unauthorized access

---

## Sample Data Loading

### Create Test User & Profile

```sql
-- Note: This is for LOCAL/DEV testing only
-- In production, use Supabase Auth API

-- Insert test profile (assumes user exists in auth.users)
INSERT INTO profiles (user_id, display_name, role)
VALUES (
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa'::uuid,
  'Budi Farmer',
  'farmer'
);

-- Insert test lands
INSERT INTO lands (owner_id, name, latitude, longitude, province, regency, district, village, adm4_code)
VALUES (
  (SELECT id FROM profiles LIMIT 1),
  'Sawah Utara',
  -6.9271,
  110.4305,
  'Jawa Tengah',
  'Sleman',
  'Kalasan',
  'Purwomartani',
  '3401060030'
);
```

### Load Demo Evidence

```sql
-- Insert crop context
INSERT INTO crop_contexts (land_id, crop_name, variety_name, growth_stage, planting_date, is_active)
VALUES (
  (SELECT id FROM lands LIMIT 1),
  'Padi Inpari 32',
  'Inpari 32',
  'vegetative',
  '2026-08-15',
  true
);

-- Insert decision case
INSERT INTO decision_cases (land_id, crop_context_id, created_by, decision_type, status)
VALUES (
  (SELECT id FROM lands LIMIT 1),
  (SELECT id FROM crop_contexts LIMIT 1),
  (SELECT id FROM profiles LIMIT 1),
  'water_condition',
  'collecting_evidence'
);

-- Insert BMKG evidence
INSERT INTO decision_case_evidence (decision_case_id, type, source, payload, is_mock, freshness_status)
VALUES (
  (SELECT id FROM decision_cases LIMIT 1),
  'bmkg_forecast',
  'BMKG',
  '{"temperature": 24, "humidity": 85, "condition": "cloudy", "rainfall_mm": 2.5}'::jsonb,
  true,
  'fresh'
);
```

---

## Common Tasks

### Query Active Decision Cases for a Land

```typescript
const { data } = await supabase
  .from('decision_cases')
  .select(`
    *,
    evidence:decision_case_evidence(*),
    assessment:assessments(*),
    options:action_options(*)
  `)
  .eq('land_id', landId)
  .eq('status', 'ready_for_decision')
  .order('created_at', { ascending: false });
```

### Link Evidence to Decision Record

```typescript
// After decision is made, record which evidence was used
const { error } = await supabase
  .from('decision_record_evidence')
  .insert(
    evidenceIds.map(evidenceId => ({
      decision_record_id: decisionRecordId,
      evidence_id: evidenceId
    }))
  );
```

### Generate Decision Brief

```typescript
const { data } = await supabase
  .from('decision_briefs')
  .insert({
    decision_record_id: recordId,
    template_version: '1.0',
    content: generatedBriefHTML
  })
  .select()
  .single();
```

---

## Monitoring & Maintenance

### Check Table Sizes

```sql
SELECT 
  schemaname, 
  tablename, 
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### Check Slow Queries

Via Supabase Dashboard → Logs → Slow Queries

### Backup Strategy

- Supabase automates daily backups (keep 7 days)
- Project Settings → Backups → Download for manual backup

---

## Next Steps

1. ✅ Run migration
2. ✅ Set up Supabase client
3. ➡️ **TASK 4.1**: Create repository layer (domain adapters)
4. ➡️ **TASK 4.2**: Implement API endpoints
5. ➡️ **TASK 4.3**: Set up BMKG adapter
6. ➡️ **TASK 4.4**: Evidence collection workflow
7. ➡️ **TASK 4.5**: Assessment/options display
8. ➡️ **TASK 4.6**: Decision recording
9. ➡️ **TASK 4.7**: Decision brief generation

---

## References

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Row-Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [PostgreSQL JSONB](https://www.postgresql.org/docs/current/datatype-json.html)
- RembukTani Schema Design: `docs/role/TUGAS_FULLSTACK.md`
- Architecture: `backend/docs/ARCHITECTURE.md`
