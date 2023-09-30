import AccountDAODatabase from '../dao/account/AccountDAODatabase'
import Account from '../domain/Account'

describe('AccountDAODatabase', () => {
  const accountDAO = new AccountDAODatabase()

  it('should create passenger account and get by id', async () => {
    const accountData = Account.create({
      name: 'John Doe',
      email: `john.doe${Math.random()}@gmail.com`,
      cpf: '95818705552',
      isPassenger: true,
      isDriver: false,
      carPlate: ''
    })

    await accountDAO.save(accountData)
    const account = await accountDAO.getById(accountData.accountId)
    expect(account?.accountId).toBe(accountData.accountId)
    expect(account?.name).toBe(accountData.name)
    expect(account?.email).toBe(accountData.email)
    expect(account?.cpf).toBe(accountData.cpf)
    expect(account?.isPassenger).toBe(accountData.isPassenger)
    expect(account?.isDriver).toBe(accountData.isDriver)
    // expect(account?.is_verified).toBe(accountData.isVerified)
    expect(account?.verificationCode).toBe(accountData.verificationCode)
  })

  it('should create driver account and get by email', async () => {
    const email = `john.doe${Math.random()}@gmail.com`
    const accountData = Account.create({
      name: 'John Doe',
      email,
      cpf: '95818705552',
      isPassenger: false,
      isDriver: true,
      carPlate: 'AAA9999'
    })
    await accountDAO.save(accountData)
    const account = await accountDAO.getByEmail(email)
    expect(account?.accountId).toBe(accountData.accountId)
    expect(account?.name).toBe(accountData.name)
    expect(account?.cpf).toBe(accountData.cpf)
    expect(account?.isPassenger).toBe(accountData.isPassenger)
    expect(account?.isDriver).toBe(accountData.isDriver)
  })
})
