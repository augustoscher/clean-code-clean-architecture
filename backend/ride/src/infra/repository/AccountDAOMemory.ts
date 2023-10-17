/* eslint-disable @typescript-eslint/no-explicit-any */
// resource - driven actor
// adapter
import AccountDAO from '../../application/repository/AccountDAO'
import Account from '../../domain/Account'

export default class AccountDAOMemory implements AccountDAO {
  accounts: Account[] = []

  async save(account: Account): Promise<void> {
    this.accounts.push(account)
  }

  async getByEmail(email: string): Promise<Account | undefined> {
    return this.accounts.find((account: any) => account.email === email)
  }

  async getById(accountId: string): Promise<Account | undefined> {
    return this.accounts.find((account: any) => account.accountId === accountId)
  }

  async getAll(): Promise<Account[] | []> {
    return this.accounts
  }
}
