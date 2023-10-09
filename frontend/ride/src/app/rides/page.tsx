import Heading from 'components/Heading'
import styles from './Rides.module.scss'
import UseCaseFactory from 'application/UseCaseFactory'
import Ride from 'domain/Ride'

export default async function ServerComponentPage() {
  const listRides = UseCaseFactory.getUseCase('ListRides')
  const rides = await listRides.execute()

  return (
    <div>
      <Heading>Rides list</Heading>
      <ul className={styles.rideList}>
        {rides.map((ride: Ride) => {
          const { rideId, status, date, distance, fare } = ride
          return (
            <li key={rideId}>
              <p>Driver: Test</p>
              <p>Passenger: Test Passenger</p>
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
        })}
      </ul>
    </div>
  )
}
