/* eslint-disable @typescript-eslint/no-explicit-any */
// resource - driven actor
// adapter

import AccountDAO from './AccountDAO'

export default class AccountDAOMemory implements AccountDAO {
  accounts: any[] = []

  save(input: any): Promise<void> {
    throw new Error('Method not implemented.')
  }
  getByEmail(email: string): Promise<any> {
    throw new Error('Method not implemented.')
  }
  getById(accountId: string): Promise<any> {
    throw new Error('Method not implemented.')
  }
}
