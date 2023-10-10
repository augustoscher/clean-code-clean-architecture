import Heading from 'components/Heading'
import styles from './Rides.module.scss'
import UseCaseFactory from 'application/UseCaseFactory'
import DetailedRide from 'domain/DetailedRide'

export default async function ServerComponentPage() {
  const listRides = UseCaseFactory.getUseCase('ListDetailedRides')
  const rides = await listRides.execute()

  return (
    <div>
      <Heading>Rides list</Heading>
      <ul className={styles.rideList}>
        {rides.map(
          ({
            rideId,
            passenger,
            driver,
            status,
            date,
            distance,
            fare
          }: DetailedRide) => (
            <li key={rideId} className={styles.rideListItem}>
              <p>Passenger: {passenger}</p>
              <p>Driver: {driver}</p>
              <p>Status: {status}</p>
              <p>Distance: {distance}</p>
              <p>Fare: {fare}</p>
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
