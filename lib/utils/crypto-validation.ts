/**
 * 暗号化キーの検証ユーティリティ
 */

const MIN_KEY_LENGTH = 32;

/**
 * 暗号化キーを検証して返す
 * 
 * @param key - 検証する暗号化キー
 * @returns 検証済みの暗号化キー
 * @throws キーが無効な場合はエラー
 */
export function validateEncryptionKey(key: string | undefined): string {
  if (!key) {
    throw new Error('DB_ENCRYPTION_KEY環境変数が設定されていません');
  }
  
  if (key.length < MIN_KEY_LENGTH) {
    throw new Error(`DB_ENCRYPTION_KEYは${MIN_KEY_LENGTH}文字以上である必要があります`);
  }
  
  // 基本的なエントロピーチェック（同じ文字の繰り返しを検出）
  const uniqueChars = new Set(key).size;
  if (uniqueChars < MIN_KEY_LENGTH / 2) {
    throw new Error('DB_ENCRYPTION_KEYのエントロピーが不十分です（より複雑なキーを使用してください）');
  }
  
  return key;
}

/**
 * 環境変数が本番環境で適切に設定されているか検証
 */
export function validateProductionEnvironment(): void {
  const requiredEnvVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'DB_ENCRYPTION_KEY',
  ];
  
  const missingVars = requiredEnvVars.filter(
    (varName) => !process.env[varName]
  );
  
  if (missingVars.length > 0) {
    throw new Error(
      `必須の環境変数が設定されていません: ${missingVars.join(', ')}`
    );
  }
}
