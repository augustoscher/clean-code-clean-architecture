// driver
import sinon from 'sinon'
import MailerGateway from '../gateway/MailerGateway'
import AccountService from '../services/AccountService'
import AccountDAOMemory from '../dao/account/AccountDAOMemory'

describe('AccountService', () => {
  const getAccountService = () => new AccountService(new AccountDAOMemory())

  test('Deve criar um passageiro', async function () {
    const input = {
      name: 'John Doe',
      email: `john.doe${Math.random()}@gmail.com`,
      cpf: '95818705552',
      isPassenger: true
    }
    const accountService = getAccountService()
    const output = await accountService.signup(input)
    const account = await accountService.getAccount(output.accountId)
    expect(account?.accountId).toBeDefined()
    expect(account?.name).toBe(input.name)
    expect(account?.email).toBe(input.email)
    expect(account?.cpf).toBe(input.cpf)
  })

  test('Não deve criar um passageiro com cpf inválido', async function () {
    const input = {
      name: 'John Doe',
      email: `john.doe${Math.random()}@gmail.com`,
      cpf: '95818705500',
      isPassenger: true
    }
    const accountService = getAccountService()
    await expect(() => accountService.signup(input)).rejects.toThrow(
      new Error('Invalid cpf')
    )
  })

  test('Não deve criar um passageiro com nome inválido', async function () {
    const input = {
      name: 'John',
      email: `john.doe${Math.random()}@gmail.com`,
      cpf: '95818705552',
      isPassenger: true
    }
    const accountService = getAccountService()
    await expect(() => accountService.signup(input)).rejects.toThrow(
      new Error('Invalid name')
    )
  })

  test('Não deve criar um passageiro com email inválido', async function () {
    const input = {
      name: 'John Doe',
      email: `john.doe${Math.random()}@`,
      cpf: '95818705552',
      isPassenger: true
    }
    const accountService = getAccountService()
    await expect(() => accountService.signup(input)).rejects.toThrow(
      new Error('Invalid email')
    )
  })

  test('Não deve criar um passageiro com conta existente', async function () {
    const input = {
      name: 'John Doe',
      email: `john.doe${Math.random()}@gmail.com`,
      cpf: '95818705552',
      isPassenger: true
    }
    const accountService = getAccountService()
    await accountService.signup(input)
    await expect(() => accountService.signup(input)).rejects.toThrow(
      new Error('Account already exists')
    )
  })

  test('Deve criar um motorista', async function () {
    const input = {
      name: 'John Doe',
      email: `john.doe${Math.random()}@gmail.com`,
      cpf: '95818705552',
      carPlate: 'AAA9999',
      isDriver: true
    }
    const accountService = getAccountService()
    const output = await accountService.signup(input)
    expect(output.accountId).toBeDefined()
  })

  test('Não deve criar um motorista com place do carro inválida', async function () {
    const input = {
      name: 'John Doe',
      email: `john.doe${Math.random()}@gmail.com`,
      cpf: '95818705552',
      carPlate: 'AAA999',
      isDriver: true
    }
    const accountService = getAccountService()
    await expect(() => accountService.signup(input)).rejects.toThrow(
      new Error('Invalid plate')
    )
  })

  test('Deve chamar o MailerGateway após criar a conta', async function () {
    const spy = sinon.spy(MailerGateway.prototype, 'send')
    const input = {
      name: 'John Doe',
      email: `john.doe${Math.random()}@gmail.com`,
      cpf: '95818705552',
      isPassenger: true
    }
    const accountService = getAccountService()
    const output = await accountService.signup(input)
    const account = await accountService.getAccount(output.accountId)
    expect(account?.accountId).toBeDefined()
    expect(account?.name).toBe(input.name)
    expect(account?.email).toBe(input.email)
    expect(account?.cpf).toBe(input.cpf)
    expect(spy.calledWith(input.email, 'Verification')).toBeTruthy()
    spy.restore()
  })
})
