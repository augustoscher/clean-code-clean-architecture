import AccountDAO from '../../dao/account/AccountDAO'
import AccountDAODatabase from '../../dao/account/AccountDAODatabase'

export default class GetAccount {
  constructor(readonly accountDAO: AccountDAO = new AccountDAODatabase()) {}

  async execute(accountId: string) {
    return this.accountDAO.getById(accountId)
  }
}
