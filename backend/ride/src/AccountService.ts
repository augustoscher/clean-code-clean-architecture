import crypto from 'crypto'
import CpfValidator from './CpfValidator'
import AccountDAO from './dao/AccountDAO'

const VALID_CARD_PLATE_REGEXP = /[A-Z]{3}[0-9]{4}/
const VALID_EMAIL_REGEXP = /^(.+)@(.+)$/
const VALID_NAME_REGEXP = /[a-zA-Z] [a-zA-Z]+/

export default class AccountService {
  cpfValidator: CpfValidator
  accoutDao: AccountDAO

  constructor() {
    this.cpfValidator = new CpfValidator()
    this.accoutDao = new AccountDAO()
  }

  async sendEmail(email: string, subject: string, message: string) {
    console.log(email, subject, message)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async signup(input: any) {
    const existingAccount = await this.accoutDao.getByEmail(input.email)
    if (existingAccount) throw new Error('Account already exists')
    if (!input.name.match(VALID_NAME_REGEXP)) throw new Error('Invalid name')
    if (!input.email.match(VALID_EMAIL_REGEXP)) throw new Error('Invalid email')
    if (!this.cpfValidator.validate(input.cpf)) throw new Error('Invalid cpf')
    if (input.isDriver && !input.carPlate.match(VALID_CARD_PLATE_REGEXP))
      throw new Error('Invalid plate')
    const accountId = crypto.randomUUID()
    const verificationCode = crypto.randomUUID()
    await this.accoutDao.save({
      accountId,
      name: input.name,
      email: input.email,
      cpf: input.cpf,
      carPlate: input.carPlate,
      isPassenger: input.isPassenger,
      isDriver: input.isDriver,
      date: input.date,
      isVerified: input.isVerified,
      verificationCode: input.verificationCode
    })
    await this.sendEmail(
      input.email,
      'Verification',
      `Please verify your code at first login ${verificationCode}`
    )
    return {
      accountId
    }
  }

  async getAccount(accountId: string) {
    return this.accoutDao.getById(accountId)
  }
}
