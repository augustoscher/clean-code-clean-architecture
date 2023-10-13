export type CreateAccountParams = {
  name: string
  email: string
  cpf: string
  isPassenger: boolean
  isDriver: boolean
  carPlate?: string
}
export type RestoreAccountParams = {
  name: string
  email: string
  cpf: string
  isPassenger: boolean
  isDriver: boolean
  carPlate: string
  verificationCode: string
  date: Date
  accountId: string
}

export default class Account {
  private constructor(
    readonly name: string,
    readonly email: string,
    readonly cpf: string,
    readonly isPassenger: boolean,
    readonly isDriver: boolean,
    readonly carPlate?: string,
    readonly verificationCode?: string,
    readonly date?: Date,
    readonly accountId?: string
  ) {}

  static restore({
    name,
    email,
    cpf,
    isPassenger,
    isDriver,
    carPlate,
    verificationCode,
    date,
    accountId
  }: RestoreAccountParams) {
    return new Account(
      name,
      email,
      cpf,
      isPassenger,
      isDriver,
      carPlate,
      verificationCode,
      date,
      accountId
    )
  }

  static create({
    name,
    email,
    cpf,
    isPassenger,
    isDriver,
    carPlate
  }: CreateAccountParams) {
    return new Account(
      name,
      email,
      cpf,
      isPassenger,
      isDriver,
      carPlate,
      undefined,
      undefined,
      undefined
    )
  }
}
