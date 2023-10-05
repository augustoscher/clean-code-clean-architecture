export default class AccountBuilder {
  name: string = 'John Doe'
  email: string = `john.doe${Math.random()}@gmail.com`
  cpf: string = '95818705552'
  isPassenger: boolean = false
  isDriver: boolean = false
  carPlate: string = ''

  static anAccount(): AccountBuilder {
    return new AccountBuilder()
  }

  asPassenger(): AccountBuilder {
    this.isPassenger = true
    this.isDriver = false
    this.carPlate = ''
    return this
  }

  asPassengerWithInvalidName(): AccountBuilder {
    this.isPassenger = true
    this.isDriver = false
    this.carPlate = ''
    this.name = 'John'
    return this
  }

  asPassengerWithInvalidMail(): AccountBuilder {
    this.isPassenger = true
    this.isDriver = false
    this.carPlate = ''
    this.email = `john.doe${Math.random()}@`
    return this
  }

  asPassengerWithInvalidCpf(): AccountBuilder {
    this.isPassenger = true
    this.isDriver = false
    this.carPlate = ''
    this.cpf = '95818705500'
    return this
  }

  asDriver(): AccountBuilder {
    this.isPassenger = false
    this.isDriver = true
    this.carPlate = 'AAA9999'
    return this
  }

  asDriverWithInvalidPlate(): AccountBuilder {
    this.isPassenger = false
    this.isDriver = true
    this.carPlate = 'AAA999'
    return this
  }

  build() {
    return {
      name: this.name,
      email: this.email,
      cpf: this.cpf,
      isPassenger: this.isPassenger,
      isDriver: this.isDriver,
      carPlate: this.carPlate
    }
  }
}
