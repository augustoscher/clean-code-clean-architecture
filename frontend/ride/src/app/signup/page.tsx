import Heading from 'components/Heading'
import styles from './Page.module.scss'
import { action } from './signup'

export default function SignupPage() {
  return (
    <div>
      <Heading size="medium">Create Account</Heading>
      <div className={styles.content}>
        {/* @ts-expect-error  next server actions */}
        <form action={action} className={styles.form}>
          <label htmlFor="name">Name: </label>
          <input type="text" name="name" id="name" required />
          <label htmlFor="email">Email: </label>
          <input type="email" name="email" id="email" required />
          <label htmlFor="cpf">Cpf: </label>
          <input type="text" name="cpf" id="cpf" required />
          <label htmlFor="type">Type: </label>
          <select name="type" id="type">
            <option value="passenger">Passenger</option>
            <option value="driver">Driver</option>
          </select>
          <label htmlFor="plate">Car plate: </label>
          <input type="text" name="plate" id="plate" />
          <button>Submit</button>
        </form>
      </div>
    </div>
  )
}
