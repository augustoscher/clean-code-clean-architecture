/* eslint-disable @typescript-eslint/no-explicit-any */
// resource - driven actor
// adapter
import Postgres from '../../database/postgres'
import Account from '../../domain/Account'
import AccountDAO from './AccountDAO'

export default class AccountDAODatabase implements AccountDAO {
  async save(input: Account) {
    const connection = Postgres.getConnection()
    try {
      await connection.query(
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
    } finally {
      connection.$pool.end()
    }
  }

  async getByEmail(email: string) {
    const connection = Postgres.getConnection()
    try {
      const [account] = await connection.query(
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
    } finally {
      connection.$pool.end()
    }
  }

  async getById(accountId: string) {
    const connection = Postgres.getConnection()
    try {
      const [account] = await connection.query(
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
    } finally {
      connection.$pool.end()
    }
  }
}
