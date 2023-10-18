import AccountClient from 'application/repository/Account'
import UseCase from './UseCase'

export default class ListRides implements UseCase {
  constructor(readonly accountClient: AccountClient) {}

  async execute() {
    return this.accountClient.getAll()
  }
}
