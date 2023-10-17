import AccountDAO from '../repository/AccountDAO'

export default class ListAccounts {
  constructor(readonly accountDAO: AccountDAO) {}

  async execute() {
    return this.accountDAO.getAll()
  }
}
