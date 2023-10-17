import AccountDAO from '../../application/repository/AccountDAO'
import Account from '../../domain/Account'
import Connection from '../database/Connection'

export default class AccountDAODatabase implements AccountDAO {
  constructor(readonly connection: Connection) {}

  async save(input: Account) {
    await this.connection.query(
      'insert into cccat13.account (account_id, name, email, cpf, car_plate, is_passenger, is_driver, date, is_verified, verification_code) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
      [
        input.accountId,
        input.name,
        input.email,
        input.cpf,
        input.carPlate,
        input.isPassenger,
        input.isDriver,
        input.date,
        false,
        input.verificationCode
      ]
    )
  }

  async getByEmail(email: string) {
    const [account] = await this.connection.query(
      'select * from cccat13.account where email = $1',
      [email]
    )
    if (!account) return
    return Account.restore({
      accountId: account.account_id,
      name: account.name,
      email: account.email,
      cpf: account.cpf,
      isPassenger: account.is_passenger,
      isDriver: account.is_driver,
      carPlate: account.car_plate,
      date: account.date,
      verificationCode: account.verification_code
    })
  }

  async getById(accountId: string) {
    const [account] = await this.connection.query(
      'select * from cccat13.account where account_id = $1',
      [accountId]
    )
    if (!account) return
    return Account.restore({
      accountId: account.account_id,
      name: account.name,
      email: account.email,
      cpf: account.cpf,
      isPassenger: account.is_passenger,
      isDriver: account.is_driver,
      carPlate: account.car_plate,
      date: account.date,
      verificationCode: account.verification_code
    })
  }

  async getAll(): Promise<Account[] | []> {
    const accountsData = await this.connection.query(
      'select * from cccat13.account'
    )
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return accountsData.map((accountData: any) =>
      Account.restore({
        accountId: accountData.account_id,
        name: accountData.name,
        email: accountData.email,
        cpf: accountData.cpf,
        isPassenger: accountData.is_passenger,
        isDriver: accountData.is_driver,
        carPlate: accountData.car_plate,
        date: accountData.date,
        verificationCode: accountData.verification_code
      })
    )
  }
}
