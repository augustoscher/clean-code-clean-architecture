import AccountDAO from '../repository/AccountDAO'

export default class GetAccount {
  constructor(readonly accountDAO: AccountDAO) {}

  async execute(accountId: string) {
    return this.accountDAO.getById(accountId)
  }
}
