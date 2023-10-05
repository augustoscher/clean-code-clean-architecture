// driver
import sinon from 'sinon'
import MailerGateway from '../../gateway/MailerGateway'
// import AccountDAOMemory from '../../infra/repository/AccountDAOMemory'
import AccountDAO from '../../application/repository/AccountDAO'
import AccountDAODatabase from '../../infra/repository/AccountDAODatabase'
import Signup from '../../application/usecase/Signup'
import GetAccount from '../../application/usecase/GetAccount'
import PgPromiseAdapter from '../../infra/database/PgPromiseAdapter'
import Connection from '../../infra/database/Connection'
import AccountBuilder from './AccountBuilder'

describe('AccountService', () => {
  let signup: Signup
  let getAccount: GetAccount
  let connection: Connection
  let accountDAO: AccountDAO

  beforeEach(function () {
    connection = new PgPromiseAdapter()
    accountDAO = new AccountDAODatabase(connection)
    signup = new Signup(accountDAO)
    getAccount = new GetAccount(accountDAO)
  })

  afterEach(async function () {
    await connection.close()
  })

  test('Deve criar um passageiro', async function () {
    const input = AccountBuilder.anAccount().asPassenger().build()
    const output = await signup.execute(input)
    const account = await getAccount.execute(output.accountId)
    expect(account?.accountId).toBeDefined()
    expect(account?.name).toBe(input.name)
    expect(account?.email).toBe(input.email)
    expect(account?.cpf).toBe(input.cpf)
  })

  test('Não deve criar um passageiro com cpf inválido', async function () {
    const input = AccountBuilder.anAccount().asPassengerWithInvalidCpf().build()
    await expect(() => signup.execute(input)).rejects.toThrow(
      new Error('Invalid cpf')
    )
  })

  test('Não deve criar um passageiro com nome inválido', async function () {
    const input = AccountBuilder.anAccount()
      .asPassengerWithInvalidName()
      .build()
    await expect(() => signup.execute(input)).rejects.toThrow(
      new Error('Invalid name')
    )
  })

  test('Não deve criar um passageiro com email inválido', async function () {
    const input = AccountBuilder.anAccount()
      .asPassengerWithInvalidMail()
      .build()
    await expect(() => signup.execute(input)).rejects.toThrow(
      new Error('Invalid email')
    )
  })

  test('Não deve criar um passageiro com conta existente', async function () {
    const input = AccountBuilder.anAccount().asPassenger().build()
    await signup.execute(input)
    await expect(() => signup.execute(input)).rejects.toThrow(
      new Error('Account already exists')
    )
  })

  test('Deve criar um motorista', async function () {
    const input = AccountBuilder.anAccount().asDriver().build()
    const output = await signup.execute(input)
    expect(output.accountId).toBeDefined()
  })

  test('Não deve criar um motorista com place do carro inválida', async function () {
    const input = AccountBuilder.anAccount().asDriverWithInvalidPlate().build()
    await expect(() => signup.execute(input)).rejects.toThrow(
      new Error('Invalid plate')
    )
  })

  test('Deve chamar o MailerGateway após criar a conta', async function () {
    const spy = sinon.spy(MailerGateway.prototype, 'send')
    const input = AccountBuilder.anAccount().asPassenger().build()
    const output = await signup.execute(input)
    const account = await getAccount.execute(output.accountId)
    expect(account?.accountId).toBeDefined()
    expect(account?.name).toBe(input.name)
    expect(account?.email).toBe(input.email)
    expect(account?.cpf).toBe(input.cpf)
    expect(spy.calledWith(input.email, 'Verification')).toBeTruthy()
    spy.restore()
  })
})
