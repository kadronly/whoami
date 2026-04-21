-- Lab Completions Table: Tracks which labs users have completed
CREATE TABLE IF NOT EXISTS lab_completions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  lab_id TEXT NOT NULL,
  lab_name TEXT NOT NULL,
  xp_earned INTEGER NOT NULL DEFAULT 0,
  completion_time INTEGER, -- in seconds
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, lab_id)
);

-- User Badges Table: Tracks earned badges
CREATE TABLE IF NOT EXISTS user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  badge_id TEXT NOT NULL,
  badge_name TEXT NOT NULL,
  badge_description TEXT,
  badge_icon TEXT NOT NULL,
  badge_rarity TEXT NOT NULL CHECK (badge_rarity IN ('common', 'rare', 'epic', 'legendary')),
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

-- Activity Feed Table: Tracks all activities for live feed
CREATE TABLE IF NOT EXISTS activity_feed (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('lab_completion', 'badge_earned', 'level_up', 'registration')),
  title TEXT NOT NULL,
  description TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_lab_completions_user_id ON lab_completions(user_id);
CREATE INDEX IF NOT EXISTS idx_lab_completions_lab_id ON lab_completions(lab_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_feed_user_id ON activity_feed(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_feed_created_at ON activity_feed(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_feed_type ON activity_feed(activity_type);

-- Enable Row Level Security
ALTER TABLE lab_completions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_feed ENABLE ROW LEVEL SECURITY;

-- RLS Policies for lab_completions
CREATE POLICY "Herkes lab tamamlamalarini gorebilir" ON lab_completions
  FOR SELECT USING (true);

CREATE POLICY "Kullanicilar kendi lab tamamlamalarini ekleyebilir" ON lab_completions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for user_badges
CREATE POLICY "Herkes rozetleri gorebilir" ON user_badges
  FOR SELECT USING (true);

CREATE POLICY "Kullanicilar kendi rozetlerini ekleyebilir" ON user_badges
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for activity_feed
CREATE POLICY "Herkes aktiviteleri gorebilir" ON activity_feed
  FOR SELECT USING (true);

CREATE POLICY "Kullanicilar kendi aktivitelerini ekleyebilir" ON activity_feed
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Enable Realtime for activity_feed
ALTER PUBLICATION supabase_realtime ADD TABLE activity_feed;
