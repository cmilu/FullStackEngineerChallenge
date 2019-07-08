import request from 'supertest'
import app, { server } from '..'
import db from '../../db'

const mockAdmin = {
  id: 0,
  name: 'admin',
  employee_id: '00001',
  admin: 1,
  created_at: Date.now(),
  updated_at: Date.now()
}

const mockNonEmployee = {
  id: 1,
  name: 'nonAdmin',
  employee_id: '00002',
  admin: 0,
  created_at: Date.now(),
  updated_at: Date.now()
}

// clear all data before each test
beforeEach(async () => {
  await db('employee').truncate()
  await db('review').truncate()

  // insert an admin
  await db('employee').insert(mockAdmin)
  await db('employee').insert(mockNonEmployee)
})

// close server when all tests are done
afterAll(() => {
  server.close()
})

test('GET /v1/session => 401 if not logged in ', async () => {
  const res = await request(app).get('/v1/session')
  expect(res.status).toBe(401)
})

test('POST /v1/demo/login/ should succeed', async () => {
  const res = await request(app).post('/v1/demo/login/0')
  expect(res.status).toBe(200)
  expect(res.header['set-cookie']).toBeTruthy()
})

test('GET /v1/session => should work after login', async () => {
  const resLogin = await request(app).post('/v1/demo/login/0')
  const res = await request(app)
    .get('/v1/session')
    .set('Cookie', resLogin.header['set-cookie'])
  expect(res.status).toBe(200)
  expect(res.body).toEqual(mockAdmin)
})

test('GET /v1/admin/employees => 401 if not logged', async () => {
  const res = await request(app).get('/v1/admin/employees')
  expect(res.status).toBe(401)
})

test('GET /v1/admin/employees => 403 if logged in but not admin', async () => {
  const resLogin = await request(app).post('/v1/demo/login/1')
  const res = await request(app)
    .get('/v1/admin/employees')
    .set('Cookie', resLogin.header['set-cookie'])
  expect(res.status).toBe(403)
})

test('GET /v1/admin/employees should work if logged in with admin', async () => {
  const resLogin = await request(app).post('/v1/demo/login/0')
  const res = await request(app)
    .get('/v1/admin/employees')
    .set('Cookie', resLogin.header['set-cookie'])
  expect(res.status).toBe(200)
  expect(res.body.list.length).toBe(2)
})
