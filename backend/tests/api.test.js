require('dotenv').config()
const request = require('supertest')
const app = require('../src/app')
const prisma = require('../src/lib/prisma')

// ─── Datos únicos por ejecución para evitar conflictos con la BD ───────────
const ts = Date.now()
const USER_EMAIL = `user_${ts}@swift-test.com`
const ADMIN_EMAIL = `admin_${ts}@swift-test.com`
const EXTRA_EMAIL = `extra_${ts}@swift-test.com`
const PASSWORD = 'testpassword123'

// Estado compartido entre tests (se rellena en beforeAll y en los propios tests)
let userToken, adminToken, userId, adminId
let setupServiceId, testServiceId, orderId

// ─── Preparar datos de prueba ──────────────────────────────────────────────
beforeAll(async () => {
  // 1. Registrar usuario normal
  const userRes = await request(app)
    .post('/api/auth/register')
    .send({ email: USER_EMAIL, password: PASSWORD })
  userId = userRes.body.user?.id
  userToken = userRes.body.token

  // 2. Registrar el futuro admin y promocionarlo directamente en BD
  const adminRegRes = await request(app)
    .post('/api/auth/register')
    .send({ email: ADMIN_EMAIL, password: PASSWORD })
  adminId = adminRegRes.body.user?.id
  await prisma.user.update({ where: { id: adminId }, data: { role: 'ADMIN' } })

  // 3. Login como admin para obtener token con role ADMIN (el del register tiene role USER)
  const adminLoginRes = await request(app)
    .post('/api/auth/login')
    .send({ email: ADMIN_EMAIL, password: PASSWORD })
  adminToken = adminLoginRes.body.token

  // 4. Crear un servicio en BD para usarlo en los tests de pedidos
  const service = await prisma.service.create({
    data: {
      name: `Setup Service ${ts}`,
      description: 'Servicio auxiliar creado para tests de pedidos',
      price: 150,
      category: 'SEO',
      formConfig: { fields: [] },
    },
  })
  setupServiceId = service.id
})

// ─── Limpiar todos los datos de prueba al terminar ─────────────────────────
afterAll(async () => {
  try {
    const testEmails = [USER_EMAIL, ADMIN_EMAIL, EXTRA_EMAIL]
    const testUsers = await prisma.user.findMany({ where: { email: { in: testEmails } } })
    const testUserIds = testUsers.map((u) => u.id)

    // Los deliverables se borran en cascada con los pedidos (onDelete: Cascade)
    await prisma.order.deleteMany({ where: { userId: { in: testUserIds } } })

    // Soft-delete de los servicios creados en los tests
    const serviceIds = [setupServiceId, testServiceId].filter(Boolean)
    if (serviceIds.length > 0) {
      await prisma.service.updateMany({
        where: { id: { in: serviceIds } },
        data: { isActive: false },
      })
    }

    await prisma.profile.deleteMany({ where: { userId: { in: testUserIds } } })
    await prisma.user.deleteMany({ where: { id: { in: testUserIds } } })
  } finally {
    await prisma.$disconnect()
  }
})

// ══════════════════════════════════════════════════════════════════════════════
// AUTH — REGISTER
// ══════════════════════════════════════════════════════════════════════════════
describe('POST /api/auth/register', () => {
  it('1 — registro exitoso devuelve 201, token y datos del usuario', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: EXTRA_EMAIL, password: PASSWORD })

    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('token')
    expect(res.body.user).toHaveProperty('id')
    expect(res.body.user.email).toBe(EXTRA_EMAIL)
    expect(res.body.user.role).toBe('USER')
    expect(res.body.user).not.toHaveProperty('password')
  })

  it('2 — email duplicado devuelve 409', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: USER_EMAIL, password: PASSWORD })

    expect(res.status).toBe(409)
    expect(res.body).toHaveProperty('error')
  })
})

// ══════════════════════════════════════════════════════════════════════════════
// AUTH — LOGIN
// ══════════════════════════════════════════════════════════════════════════════
describe('POST /api/auth/login', () => {
  it('3 — credenciales correctas devuelven 200 y token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: USER_EMAIL, password: PASSWORD })

    expect(res.status).toBe(200)
    expect(res.body).toHaveProperty('token')
    expect(res.body.user).not.toHaveProperty('password')
  })

  it('4 — contraseña incorrecta devuelve 401', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: USER_EMAIL, password: 'contraseñaequivocada' })

    expect(res.status).toBe(401)
    expect(res.body).toHaveProperty('error')
  })
})

// ══════════════════════════════════════════════════════════════════════════════
// SERVICES — LISTADO PÚBLICO
// ══════════════════════════════════════════════════════════════════════════════
describe('GET /api/services', () => {
  it('5 — lista servicios activos sin autenticación', async () => {
    const res = await request(app).get('/api/services')

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    // Todos los servicios devueltos deben estar activos
    res.body.forEach((s) => expect(s.isActive).toBe(true))
  })
})

// ══════════════════════════════════════════════════════════════════════════════
// SERVICES — CREAR (control de rol)
// ══════════════════════════════════════════════════════════════════════════════
describe('POST /api/services', () => {
  const newService = {
    name: `Servicio Test API ${ts}`,
    description: 'Creado durante tests de integración',
    price: 200,
    category: 'SEO',
    formConfig: { fields: [] },
  }

  it('6 — admin puede crear un servicio y recibe 201', async () => {
    const res = await request(app)
      .post('/api/services')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(newService)

    testServiceId = res.body.id
    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('id')
    expect(res.body.name).toBe(newService.name)
    expect(res.body.isActive).toBe(true)
  })

  it('7 — usuario normal recibe 403', async () => {
    const res = await request(app)
      .post('/api/services')
      .set('Authorization', `Bearer ${userToken}`)
      .send(newService)

    expect(res.status).toBe(403)
    expect(res.body).toHaveProperty('error')
  })
})

// ══════════════════════════════════════════════════════════════════════════════
// ORDERS — CREAR
// ══════════════════════════════════════════════════════════════════════════════
describe('POST /api/orders', () => {
  it('8 — usuario autenticado crea pedido correctamente', async () => {
    const res = await request(app)
      .post('/api/orders')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ serviceId: setupServiceId, configData: { note: 'test de integración' } })

    orderId = res.body.id
    expect(res.status).toBe(201)
    expect(res.body).toHaveProperty('id')
    expect(res.body.userId).toBe(userId)
    expect(res.body.total).toBe(150)
    expect(res.body.status).toBe('PENDING')
  })
})

// ══════════════════════════════════════════════════════════════════════════════
// ORDERS — LISTADO (ownership)
// ══════════════════════════════════════════════════════════════════════════════
describe('GET /api/orders', () => {
  it('9 — usuario solo ve sus propios pedidos', async () => {
    const res = await request(app)
      .get('/api/orders')
      .set('Authorization', `Bearer ${userToken}`)

    expect(res.status).toBe(200)
    expect(Array.isArray(res.body)).toBe(true)
    // Ningún pedido devuelto pertenece a otro usuario
    res.body.forEach((o) => expect(o.userId).toBe(userId))
  })
})

// ══════════════════════════════════════════════════════════════════════════════
// ORDERS — CAMBIAR ESTADO (control de rol)
// ══════════════════════════════════════════════════════════════════════════════
describe('PUT /api/orders/:id/status', () => {
  it('10 — usuario normal recibe 403; admin cambia estado a PROGRESS', async () => {
    // Un USER no puede cambiar el estado
    const userRes = await request(app)
      .put(`/api/orders/${orderId}/status`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ status: 'PROGRESS' })
    expect(userRes.status).toBe(403)

    // Un ADMIN sí puede
    const adminRes = await request(app)
      .put(`/api/orders/${orderId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'PROGRESS' })
    expect(adminRes.status).toBe(200)
    expect(adminRes.body.status).toBe('PROGRESS')
  })
})
