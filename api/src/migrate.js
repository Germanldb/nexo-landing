const RETENTION_DAYS = 3;

export async function ensureSchema(pool) {
  const [columns] = await pool.query(
    `SELECT COLUMN_NAME
     FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME = 'captaciones'
       AND COLUMN_NAME = 'deleted_at'`,
  );

  if (columns.length === 0) {
    await pool.query('ALTER TABLE captaciones ADD COLUMN deleted_at TIMESTAMP NULL DEFAULT NULL');
    await pool.query('CREATE INDEX idx_captaciones_deleted_at ON captaciones (deleted_at)');
  }
}

export async function purgeExpiredCaptaciones(pool) {
  const [result] = await pool.query(
    `DELETE FROM captaciones
     WHERE deleted_at IS NOT NULL
       AND deleted_at < (CURRENT_TIMESTAMP - INTERVAL ${RETENTION_DAYS} DAY)`,
  );

  return result.affectedRows ?? 0;
}

export { RETENTION_DAYS };
