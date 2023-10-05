import AccountDAO from '../repository/AccountDAO'
import Account from '../../domain/Account'
import MailerGateway from '../../gateway/MailerGateway'

export type SignupParams = {
  name: string
  email: string
  cpf: string
  isPassenger: boolean
  isDriver: boolean
  carPlate: string
}

export default class Signup {
  mailerGateway: MailerGateway

  // creating a port for more than one adapter to implement, allowing me to vary the behavior
  constructor(readonly accountDAO: AccountDAO) {
    this.mailerGateway = new MailerGateway()
  }

  async execute({
    email,
    name,
    cpf,
    isPassenger,
    isDriver,
    carPlate
  }: SignupParams) {
    const existingAccount = await this.accountDAO.getByEmail(email)
    if (existingAccount) throw new Error('Account already exists')

    const account = Account.create({
      name,
      email,
      cpf,
      isPassenger,
      isDriver,
      carPlate
    })

    await this.accountDAO.save(account)
    await this.mailerGateway.send(
      email,
      'Verification',
      `Please verify your code at first login ${account.verificationCode}`
    )
    return {
      accountId: account.accountId
    }
  }
}
