import AccountDAODatabase from '../dao/account/AccountDAODatabase'

describe('AccountDAODatabase', () => {
  const accountDAO = new AccountDAODatabase()

  it('should create passenger account and get by id', async () => {
    const input = {
      accountId: crypto.randomUUID(),
      name: 'John Doe',
      email: `john.doe${Math.random()}@gmail.com`,
      cpf: '95818705552',
      isPassenger: true,
      isDriver: false,
      isVerified: false,
      verificationCode: crypto.randomUUID()
    }
    await accountDAO.save(input)
    const account = await accountDAO.getById(input.accountId)
    expect(account.account_id).toBe(input.accountId)
    expect(account.name).toBe(input.name)
    expect(account.email).toBe(input.email)
    expect(account.cpf).toBe(input.cpf)
    expect(account.is_passenger).toBe(input.isPassenger)
    expect(account.is_driver).toBe(input.isDriver)
    expect(account.is_verified).toBe(input.isVerified)
    expect(account.verification_code).toBe(input.verificationCode)
  })

  it('should create driver account and get by email', async () => {
    const input = {
      accountId: crypto.randomUUID(),
      name: 'John Doe',
      email: `john.doe${Math.random()}@gmail.com`,
      cpf: '95818705552',
      isPassenger: false,
      isDriver: true
    }
    await accountDAO.save(input)
    const account = await accountDAO.getByEmail(input.email)
    expect(account.account_id).toBe(input.accountId)
    expect(account.name).toBe(input.name)
    expect(account.cpf).toBe(input.cpf)
    expect(account.is_passenger).toBe(input.isPassenger)
    expect(account.is_driver).toBe(input.isDriver)
  })
})
