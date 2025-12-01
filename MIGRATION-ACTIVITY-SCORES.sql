-- Simple migration script to add activity_scores table
-- Run this in your PostgreSQL database

-- Create the activity_scores table
CREATE TABLE IF NOT EXISTS activity_scores (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL,
    activity_type TEXT NOT NULL,
    score INTEGER NOT NULL,
    completed_at TIMESTAMP DEFAULT NOW() NOT NULL,
    metadata JSONB
);

-- Add foreign key constraint
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'activity_scores_user_id_user_id_fk'
    ) THEN
        ALTER TABLE activity_scores 
        ADD CONSTRAINT activity_scores_user_id_user_id_fk 
        FOREIGN KEY (user_id) REFERENCES "user"(id) 
        ON DELETE NO ACTION ON UPDATE NO ACTION;
    END IF;
END $$;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_activity_scores_user_id ON activity_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_scores_activity_type ON activity_scores(activity_type);
CREATE INDEX IF NOT EXISTS idx_activity_scores_user_activity ON activity_scores(user_id, activity_type);

-- Verify the table was created
SELECT 
    'activity_scores table created successfully' AS status,
    COUNT(*) AS existing_records
FROM activity_scores;
