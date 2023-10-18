import UseCaseFactory from 'application/UseCaseFactory'
import Heading from 'components/Heading'
import styles from './Accounts.module.scss'
import Account from 'domain/Account'

export default async function AccountsPage() {
  const listAccounts = UseCaseFactory.getUseCase('ListAccounts')
  const accounts = await listAccounts.execute()

  return (
    <div>
      <Heading>Accounts Page</Heading>
      <ul className={styles.accountList}>
        {accounts.map(
          ({
            accountId,
            name,
            email,
            cpf,
            isDriver,
            isPassenger,
            carPlate,
            date
          }: Account) => (
            <li key={accountId} className={styles.accountListItem}>
              <p>Name: {name}</p>
              <p>Email: {email}</p>
              <p>Cpf: {cpf}</p>
              {isDriver && <p>Type: Driver | Car Plate: {carPlate}</p>}
              {isPassenger && <p>Type: Passenger</p>}
              <p>
                Date:{' '}
                {date
                  ? new Intl.DateTimeFormat('pt-BR', {
                      dateStyle: 'short',
                      timeStyle: 'long'
                    }).format(date)
                  : null}
              </p>
            </li>
          )
        )}
      </ul>
    </div>
  )
}
