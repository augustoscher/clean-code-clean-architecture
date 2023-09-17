/* eslint-disable @typescript-eslint/no-explicit-any */
// resource - driven actor
// adapter
import Postgres from '../../database/postgres'
import AccountDAO from './AccountDAO'

export default class AccountDAODatabase implements AccountDAO {
  async save(input: any) {
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
          input.isVerified,
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
      return account
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
      return account
    } finally {
      connection.$pool.end()
    }
  }
}
