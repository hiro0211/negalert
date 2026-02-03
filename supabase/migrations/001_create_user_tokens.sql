-- ユーザーのGoogle OAuth Tokenを保存するテーブル
CREATE TABLE IF NOT EXISTS user_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL DEFAULT 'google',
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- ユーザーごとに1つのTokenレコードのみ
  UNIQUE(user_id, provider)
);

-- updated_atを自動更新するトリガー
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_tokens_updated_at
  BEFORE UPDATE ON user_tokens
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- インデックス
CREATE INDEX IF NOT EXISTS idx_user_tokens_user_id ON user_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_user_tokens_provider ON user_tokens(provider);

-- RLS (Row Level Security) ポリシー
ALTER TABLE user_tokens ENABLE ROW LEVEL SECURITY;

-- ユーザーは自分のTokenのみ閲覧可能
CREATE POLICY "Users can view their own tokens"
  ON user_tokens
  FOR SELECT
  USING (auth.uid() = user_id);

-- ユーザーは自分のTokenのみ更新可能
CREATE POLICY "Users can update their own tokens"
  ON user_tokens
  FOR UPDATE
  USING (auth.uid() = user_id);

-- ユーザーは自分のTokenのみ挿入可能
CREATE POLICY "Users can insert their own tokens"
  ON user_tokens
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ユーザーは自分のTokenのみ削除可能
CREATE POLICY "Users can delete their own tokens"
  ON user_tokens
  FOR DELETE
  USING (auth.uid() = user_id);
