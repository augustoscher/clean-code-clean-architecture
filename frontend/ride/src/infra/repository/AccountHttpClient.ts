import HttpClient from 'application/http/client'
import AccountClient from 'application/repository/Account'
import Account from 'domain/Account'
import OperationResult from 'domain/OperationResult'

export default class AccountHttpClient implements AccountClient {
  constructor(readonly httpClient: HttpClient) {}

  async save(account: Account): Promise<OperationResult> {
    try {
      const { accountId } = await this.httpClient.request(
        'POST',
        '/signup',
        account
      )
      if (!accountId) return OperationResult.fail('Account not created')
      return OperationResult.success()
    } catch (e) {
      return OperationResult.fail(e)
    }
  }
}
