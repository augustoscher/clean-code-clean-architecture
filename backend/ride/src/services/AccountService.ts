import AccountDAO from '../dao/account/AccountDAO'
import MailerGateway from '../gateway/MailerGateway'
import AccountDAODatabase from '../dao/account/AccountDAODatabase'
import Account from '../domain/Account'

export default class AccountService {
  mailerGateway: MailerGateway

  // creating a port for more than one adapter to implement, allowing me to vary the behavior
  constructor(readonly accountDAO: AccountDAO = new AccountDAODatabase()) {
    this.mailerGateway = new MailerGateway()
  }

  async sendEmail(email: string, subject: string, message: string) {
    console.log(email, subject, message)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async signup(input: any) {
    const existingAccount = await this.accountDAO.getByEmail(input.email)
    if (existingAccount) throw new Error('Account already exists')

    const account = Account.create({
      name: input.name,
      email: input.email,
      cpf: input.cpf,
      isPassenger: input.isPassenger,
      isDriver: input.isDriver,
      carPlate: input.carPlate
    })

    await this.accountDAO.save(account)
    await this.mailerGateway.send(
      input.email,
      'Verification',
      `Please verify your code at first login ${account.verificationCode}`
    )
    return {
      accountId: account.accountId
    }
  }

  async getAccount(accountId: string) {
    return this.accountDAO.getById(accountId)
  }
}
