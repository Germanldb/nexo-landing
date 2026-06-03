import express from 'express';
import mysql from 'mysql2/promise';
import {
  clearSessionCookie,
  createSessionToken,
  getSessionFromRequest,
  requireAdmin,
  setSessionCookie,
  validateAdminCredentials,
} from './auth.js';
import { RETENTION_DAYS, ensureSchema, purgeExpiredCaptaciones } from './migrate.js';

const app = express();
const port = Number(process.env.PORT ?? 3000);

const pool = mysql.createPool({
  uri: process.env.DATABASE_URL,
  waitForConnections: true,
  connectionLimit: 10,
});

app.use(express.json({ limit: '32kb' }));

function isNonEmptyString(value, maxLength) {
  return typeof value === 'string' && value.trim().length > 0 && value.trim().length <= maxLength;
}

function isOptionalString(value, maxLength) {
  return value == null || value === '' || (typeof value === 'string' && value.length <= maxLength);
}

function isStringArray(value) {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

function validateWhatsApp(value) {
  const digits = value.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 15;
}

function validatePayload(body) {
  const errors = [];

  if (!isNonEmptyString(body.nombre, 255)) errors.push('nombre es obligatorio');
  if (!isNonEmptyString(body.cargo, 255)) errors.push('cargo es obligatorio');
  if (!isNonEmptyString(body.whatsapp, 30) || !validateWhatsApp(body.whatsapp)) {
    errors.push('whatsapp inválido');
  }
  if (!isNonEmptyString(body.email, 255) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email.trim())) {
    errors.push('email inválido');
  }
  if (!isNonEmptyString(body.empresa, 255)) errors.push('empresa es obligatoria');

  if (!isOptionalString(body.num_clientes, 50)) errors.push('num_clientes inválido');
  if (!isOptionalString(body.pais, 100)) errors.push('pais inválido');
  if (!isOptionalString(body.estado, 100)) errors.push('estado inválido');
  if (!isOptionalString(body.ciudad_region, 255)) errors.push('ciudad_region inválido');
  if (!isOptionalString(body.infraestructura, 50)) errors.push('infraestructura inválido');
  if (!isOptionalString(body.rsg_marcas_otro, 255)) errors.push('rsg_marcas_otro inválido');
  if (!isOptionalString(body.software_actual, 50)) errors.push('software_actual inválido');
  if (!isOptionalString(body.software_otro, 255)) errors.push('software_otro inválido');
  if (!isOptionalString(body.inconvenientes_sistema, 5000)) errors.push('inconvenientes_sistema inválido');
  if (!isOptionalString(body.expectativas, 5000)) errors.push('expectativas inválido');

  if (!isStringArray(body.soluciones ?? [])) errors.push('soluciones inválido');
  if (!isStringArray(body.rsg_marcas ?? [])) errors.push('rsg_marcas inválido');

  const soluciones = body.soluciones ?? [];
  const rsgMarcas = body.rsg_marcas ?? [];

  if (soluciones.includes('rsg') && rsgMarcas.length === 0) {
    errors.push('Selecciona al menos una marca RSG');
  }

  if (rsgMarcas.includes('otros') && !isNonEmptyString(body.rsg_marcas_otro, 255)) {
    errors.push('Indica qué otra marca utilizas');
  }

  if (body.software_actual === 'otro' && !isNonEmptyString(body.software_otro, 255)) {
    errors.push('Especifica el otro software');
  }

  return errors;
}

function trimOrNull(value) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function parseJsonField(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch {
      return [];
    }
  }
  return [];
}

function normalizeCaptacion(row) {
  return {
    ...row,
    soluciones: parseJsonField(row.soluciones),
    rsg_marcas: parseJsonField(row.rsg_marcas),
  };
}

app.get('/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ ok: true });
  } catch {
    res.status(503).json({ ok: false });
  }
});

app.post('/registro', async (req, res) => {
  const errors = validatePayload(req.body ?? {});
  if (errors.length > 0) {
    return res.status(400).json({ ok: false, errors });
  }

  const body = req.body;
  const soluciones = body.soluciones ?? [];
  const rsgMarcas = body.rsg_marcas ?? [];

  try {
    await pool.query(
      `INSERT INTO captaciones (
        nombre, cargo, whatsapp, email, empresa,
        num_clientes, pais, estado, ciudad_region, infraestructura,
        soluciones, rsg_marcas, rsg_marcas_otro,
        software_actual, software_otro, inconvenientes_sistema, expectativas
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        body.nombre.trim(),
        body.cargo.trim(),
        body.whatsapp.trim(),
        body.email.trim(),
        body.empresa.trim(),
        trimOrNull(body.num_clientes),
        trimOrNull(body.pais),
        trimOrNull(body.estado),
        trimOrNull(body.ciudad_region),
        trimOrNull(body.infraestructura),
        JSON.stringify(soluciones),
        JSON.stringify(rsgMarcas),
        trimOrNull(body.rsg_marcas_otro),
        trimOrNull(body.software_actual),
        trimOrNull(body.software_otro),
        trimOrNull(body.inconvenientes_sistema),
        trimOrNull(body.expectativas),
      ],
    );

    res.status(201).json({ ok: true });
  } catch (error) {
    console.error('Error al guardar captación:', error);
    res.status(500).json({ ok: false, message: 'No se pudo guardar el registro' });
  }
});

app.post('/admin/login', (req, res) => {
  const username = typeof req.body?.username === 'string' ? req.body.username.trim() : '';
  const password = typeof req.body?.password === 'string' ? req.body.password : '';

  if (!validateAdminCredentials(username, password)) {
    return res.status(401).json({ ok: false, message: 'Usuario o contraseña incorrectos.' });
  }

  const token = createSessionToken(username);
  setSessionCookie(res, token);
  return res.json({ ok: true, user: username });
});

app.post('/admin/logout', (_req, res) => {
  clearSessionCookie(res);
  return res.json({ ok: true });
});

app.get('/admin/session', (req, res) => {
  const session = getSessionFromRequest(req);
  if (!session) {
    return res.status(401).json({ ok: false });
  }

  return res.json({ ok: true, user: session.user });
});

app.get('/captaciones', requireAdmin, async (req, res) => {
  try {
    await purgeExpiredCaptaciones(pool);

    const limit = Math.min(Math.max(Number(req.query.limit) || 200, 1), 500);
    const offset = Math.max(Number(req.query.offset) || 0, 0);
    const papelera = req.query.papelera === '1';
    const whereClause = papelera ? 'deleted_at IS NOT NULL' : 'deleted_at IS NULL';

    const [rows] = await pool.query(
      `SELECT * FROM captaciones WHERE ${whereClause} ORDER BY ${papelera ? 'deleted_at' : 'fecha_ingreso'} DESC LIMIT ? OFFSET ?`,
      [limit, offset],
    );
    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) AS total FROM captaciones WHERE ${whereClause}`,
    );
    const [[{ activeTotal }]] = await pool.query(
      'SELECT COUNT(*) AS activeTotal FROM captaciones WHERE deleted_at IS NULL',
    );
    const [[{ trashTotal }]] = await pool.query(
      'SELECT COUNT(*) AS trashTotal FROM captaciones WHERE deleted_at IS NOT NULL',
    );

    res.json({
      ok: true,
      total,
      activeTotal,
      trashTotal,
      retentionDays: RETENTION_DAYS,
      papelera,
      data: rows.map(normalizeCaptacion),
    });
  } catch (error) {
    console.error('Error al listar captaciones:', error);
    res.status(500).json({ ok: false, message: 'No se pudieron cargar los registros' });
  }
});

app.delete('/captaciones/:id', requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ ok: false, message: 'ID inválido' });
  }

  try {
    const [result] = await pool.query(
      'UPDATE captaciones SET deleted_at = CURRENT_TIMESTAMP WHERE id = ? AND deleted_at IS NULL',
      [id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ ok: false, message: 'Registro no encontrado' });
    }

    res.json({ ok: true, message: 'Registro movido a la papelera' });
  } catch (error) {
    console.error('Error al mover captación a papelera:', error);
    res.status(500).json({ ok: false, message: 'No se pudo mover el registro a la papelera' });
  }
});

app.post('/captaciones/:id/restaurar', requireAdmin, async (req, res) => {
  const id = Number(req.params.id);
  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ ok: false, message: 'ID inválido' });
  }

  try {
    const [result] = await pool.query(
      'UPDATE captaciones SET deleted_at = NULL WHERE id = ? AND deleted_at IS NOT NULL',
      [id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ ok: false, message: 'Registro no encontrado en la papelera' });
    }

    res.json({ ok: true, message: 'Registro restaurado' });
  } catch (error) {
    console.error('Error al restaurar captación:', error);
    res.status(500).json({ ok: false, message: 'No se pudo restaurar el registro' });
  }
});

async function start() {
  await pool.query('SELECT 1');
  await ensureSchema(pool);
  const purged = await purgeExpiredCaptaciones(pool);
  if (purged > 0) {
    console.log(`Purgados ${purged} registros de captaciones (>${RETENTION_DAYS} días en papelera)`);
  }

  setInterval(() => {
    purgeExpiredCaptaciones(pool)
      .then((count) => {
        if (count > 0) console.log(`Purgados ${count} registros de captaciones`);
      })
      .catch((error) => console.error('Error en purga automática:', error));
  }, 6 * 60 * 60 * 1000);

  app.listen(port, () => {
    console.log(`API escuchando en puerto ${port}`);
  });
}

start().catch((error) => {
  console.error('No se pudo iniciar la API:', error);
  process.exit(1);
});
