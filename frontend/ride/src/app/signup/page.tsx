import Heading from 'components/Heading'
import styles from './Page.module.scss'
import UseCaseFactory from 'application/UseCaseFactory'

export default function SignupPage() {
  const createAccount = async (formData: FormData) => {
    'use server'

    const name = formData.get('name')
    const email = formData.get('email')
    const cpf = formData.get('cpf')
    const type = formData.get('type')
    const plate = formData.get('plate')
    const signup = UseCaseFactory.getUseCase('Signup')
    const result = await signup.execute({
      name,
      email,
      cpf,
      type,
      carPlate: plate
    })
    console.log(result)
  }

  return (
    <div>
      <Heading size="medium">Create Account</Heading>
      <div className={styles.content}>
        <form action={createAccount} method="POST" className={styles.form}>
          <label htmlFor="name">Name: </label>
          <input type="text" name="name" id="name" />
          <label htmlFor="email">Email: </label>
          <input type="email" name="email" id="email" />
          <label htmlFor="cpf">Cpf: </label>
          <input type="text" name="cpf" id="cpf" />
          <label htmlFor="type">Type: </label>
          <select name="type" id="type">
            <option value="passenger">Passenger</option>
            <option value="driver">Driver</option>
          </select>
          <label htmlFor="plate">Car plate: </label>
          <input type="text" name="plate" id="plate" />
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  )
}
