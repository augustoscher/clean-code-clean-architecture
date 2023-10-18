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

  async getAll(): Promise<Account[] | []> {
    try {
      const result = await this.httpClient.request('GET', '/accounts')
      return result.map((account: any) =>
        Account.restore({
          name: account.name,
          email: account.email,
          cpf: account.cpf,
          isPassenger: account.isPassenger,
          isDriver: account.isDriver,
          carPlate: account.carPlate,
          verificationCode: account.verificationCode,
          date: new Date(account.date),
          accountId: account.accountId
        })
      )
    } catch (e) {
      return []
    }
  }
}
