import axios from 'axios'
import AxiosMockAdapter from 'axios-mock-adapter'
import api from '~/utils/api'
import {
  showAlert as originShowAlert,
  showModal as originShowModal
} from '~/components/Modals'

jest.mock('~/components/Modals', () => ({
  showAlert: jest.fn(),
  showModal: jest.fn()
}))

const showAlert = originShowAlert as jest.Mock
const showModal = originShowModal as jest.Mock
const mock = new AxiosMockAdapter(axios)
const methods: Array<keyof typeof api> = ['get', 'post', 'put', 'delete']

beforeEach(() => {
  jest.clearAllMocks()
  mock.reset()
})

test('proper api methods should exists', () => {
  expect(api.get).toBeDefined()
  expect(api.post).toBeDefined()
  expect(api.put).toBeDefined()
  expect(api.delete).toBeDefined()
})

test('resolve to right response when 200 ', async () => {
  mock.onAny('/api/v1/foo').reply(200, {
    bar: 'bar'
  })

  for (let method of methods) {
    const [err, res] = await api[method]('/foo')
    expect(err!).toBe(null)
    expect(res.bar).toBe('bar')
  }
})

test('network error should trigger showAlert', async () => {
  mock.onAny('/api/v1/foo').networkError()
  for (let method of methods) {
    const [err] = await api[method]('/foo')
    expect(err).toBeTruthy()
    expect(err!.code).toBe('network.error')
    expect(err!.message).toBe('Network Error, please check')
    expect(showAlert).toHaveBeenCalled()
    expect(showAlert.mock.calls[0][0].message).toBe(err!.message)
  }
})

test('400 request.malformed', async () => {
  mock.onAny('/api/v1/foo').reply(400, {})

  for (let method of methods) {
    const [err] = await api[method]('/foo')
    expect(err!.code).toBe('request.malformed')
    expect(err!.message).toBe('Request data is not valid')
    expect(showAlert).toHaveBeenCalled()
    expect(showAlert.mock.calls[0][0].message).toBe(err!.message)
  }
})

test('401 auth.required', async () => {
  mock.onAny('/api/v1/foo').reply(401, {})
  for (let method of methods) {
    const [err] = await api[method]('/foo')
    expect(err!.code).toBe('auth.required')
    expect(err!.message).toBe('Please login')
    expect(showModal).toHaveBeenCalled()
  }
})

test('403 auth.forbidden', async () => {
  mock.onAny('/api/v1/foo').reply(403, {})
  for (let method of methods) {
    const [err] = await api[method]('/foo')
    expect(err!.code).toBe('auth.forbidden')
    expect(err!.message).toBe('Please relogin with proper account')
    expect(showModal).toHaveBeenCalled()
  }
})

test('500 unexpected', async () => {
  mock.onAny('/api/v1/foo').reply(500, {})
  for (let method of methods) {
    const [err] = await api[method]('/foo')
    expect(err!.code).toBe('unexpected')
    expect(err!.message).toBe('Unexpected error')
    expect(showAlert).toHaveBeenCalled()
    expect(showAlert.mock.calls[0][0].message).toBe(err!.message)
  }
})
