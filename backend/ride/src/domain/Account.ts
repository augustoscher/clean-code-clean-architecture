import crypto from 'crypto'
import CpfValidator from './CpfValidator'

export type CreateAccountParams = {
  name: string
  email: string
  cpf: string
  isPassenger: boolean
  isDriver: boolean
  carPlate: string
}
export type RestoreAccountParams = {
  accountId: string
  name: string
  email: string
  cpf: string
  isPassenger: boolean
  isDriver: boolean
  carPlate: string
  date: Date
  verificationCode: string
}

export default class Account {
  private constructor(
    readonly accountId: string,
    readonly name: string,
    readonly email: string,
    readonly cpf: string,
    readonly isPassenger: boolean,
    readonly isDriver: boolean,
    readonly carPlate: string,
    readonly date: Date,
    readonly verificationCode: string
  ) {}

  static create({
    name,
    email,
    cpf,
    isPassenger,
    isDriver,
    carPlate
  }: CreateAccountParams) {
    if (!name.match(/[a-zA-Z] [a-zA-Z]+/)) throw new Error('Invalid name')
    if (!email.match(/^(.+)@(.+)$/)) throw new Error('Invalid email')
    const cpfValidator = new CpfValidator()
    if (!cpfValidator.validate(cpf)) throw new Error('Invalid cpf')
    if (isDriver && !carPlate.match(/[A-Z]{3}[0-9]{4}/))
      throw new Error('Invalid plate')
    const accountId = crypto.randomUUID()
    const verificationCode = crypto.randomUUID()
    const date = new Date()
    return new Account(
      accountId,
      name,
      email,
      cpf,
      isPassenger,
      isDriver,
      carPlate,
      date,
      verificationCode
    )
  }

  static restore({
    accountId,
    name,
    email,
    cpf,
    isPassenger,
    isDriver,
    carPlate,
    date,
    verificationCode
  }: RestoreAccountParams) {
    return new Account(
      accountId,
      name,
      email,
      cpf,
      isPassenger,
      isDriver,
      carPlate,
      date,
      verificationCode
    )
  }
}
