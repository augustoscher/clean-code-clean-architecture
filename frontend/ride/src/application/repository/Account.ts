import Account from 'domain/Account'
import OperationResult from 'domain/OperationResult'

// port
export default interface AccountClient {
  save(account: Account): Promise<OperationResult>
  getAll(): Promise<Account[] | []>
}
