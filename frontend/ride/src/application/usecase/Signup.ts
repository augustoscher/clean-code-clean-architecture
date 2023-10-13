import Account from 'domain/Account'
import UseCase from './UseCase'
import AccountClient from 'application/repository/Account'

type SignupParams = {
  name: string
  email: string
  cpf: string
  type: string
  carPlate?: string
}

export default class Signup implements UseCase {
  constructor(readonly accountClient: AccountClient) {}

  async execute(acc: SignupParams) {
    const { name, email, cpf, type, carPlate } = acc
    const isPassenger = type === 'passenger'
    const isDriver = type === 'driver'
    const account = Account.create({
      name,
      email,
      cpf,
      isPassenger,
      isDriver,
      carPlate
    })
    return this.accountClient.save(account)
  }
}
