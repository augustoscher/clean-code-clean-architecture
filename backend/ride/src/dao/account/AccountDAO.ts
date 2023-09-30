/* eslint-disable @typescript-eslint/no-explicit-any */

import Account from '../../domain/Account'

// port
export default interface AccountDAO {
  save(account: Account): Promise<void>
  getByEmail(email: string): Promise<Account | undefined>
  getById(accountId: string): Promise<Account | undefined>
}
