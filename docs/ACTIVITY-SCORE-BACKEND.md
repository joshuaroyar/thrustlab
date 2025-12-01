# Activity Score Backend Implementation

## Overview
Backend system for tracking and persisting user scores from interactive activities like the Assembly & Disassembly game.

## Database Schema

### `activity_scores` Table
```sql
CREATE TABLE activity_scores (
  id SERIAL PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES user(id),
  activity_type TEXT NOT NULL,
  score INTEGER NOT NULL,
  completed_at TIMESTAMP DEFAULT NOW() NOT NULL,
  metadata JSONB
);
```

**Indexes:**
- `idx_activity_scores_user_id` - Fast user lookups
- `idx_activity_scores_activity_type` - Filter by activity type
- `idx_activity_scores_user_activity` - Combined user + activity queries

## API Endpoints

### Save Activity Score
**POST** `/api/activity-score/save`

**Request Body:**
```json
{
  "activityType": "assembly-disassembly",
  "score": 85,
  "metadata": {
    "componentsPlaced": 5,
    "timestamp": "2025-12-01T10:30:00Z"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 123,
    "score": 85,
    "completedAt": "2025-12-01T10:30:00Z"
  }
}
```

### Get Activity Scores
**GET** `/api/activity-score/get`

**Query Parameters:**
- `activityType` (optional) - Filter by specific activity
- `limit` (optional, default: 10) - Number of records to return

**Response:**
```json
{
  "success": true,
  "scores": [
    {
      "id": 123,
      "userId": "user-uuid",
      "activityType": "assembly-disassembly",
      "score": 85,
      "completedAt": "2025-12-01T10:30:00Z",
      "metadata": { "componentsPlaced": 5 }
    }
  ],
  "highScore": 95,
  "totalAttempts": 12
}
```

## Client-Side Usage

### Import the utility
```typescript
import { saveActivityScore, getActivityScores } from '$lib/utils/activityScore';
```

### Save a score
```typescript
const result = await saveActivityScore({
  activityType: 'assembly-disassembly',
  score: 85,
  metadata: {
    componentsPlaced: 5,
    timeSpent: 120 // seconds
  }
});

if (result.success) {
  console.log('Score saved!', result.data);
}
```

### Get scores
```typescript
const result = await getActivityScores('assembly-disassembly', 10);

if (result.success) {
  console.log('High Score:', result.highScore);
  console.log('Recent Scores:', result.scores);
}
```

## Running the Migration

### Option 1: Using the migration script
```bash
npm run tsx scripts/run-migration.ts
```

### Option 2: Manual SQL execution
Connect to your database and run:
```bash
psql $DATABASE_URL < drizzle/migrations/add_activity_scores.sql
```

## Activity Types

Current supported activities:
- `assembly-disassembly` - Assembly & Disassembly interactive game
- More activities can be added by simply using different `activityType` values

## Features

✅ Automatic user creation if not exists  
✅ Score persistence with metadata  
✅ High score tracking  
✅ Activity history  
✅ Indexed for performance  
✅ Type-safe with TypeScript  
✅ Error handling and validation  

## Security

- All endpoints require authentication via Supabase session
- User ID is extracted from session, not from request body (prevents spoofing)
- Foreign key constraints ensure data integrity
