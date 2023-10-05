import RideDAODatabase from '../../infra/repository/RideDAODatabase'
import Ride from '../../domain/Ride'
import PgPromiseAdapter from '../../infra/database/PgPromiseAdapter'

describe('RideDAODatabase', () => {
  let rideDAO: RideDAODatabase
  let connection: PgPromiseAdapter

  beforeEach(() => {
    connection = new PgPromiseAdapter()
    rideDAO = new RideDAODatabase(connection)
  })

  afterEach(async function () {
    await connection.close()
  })

  it('should create ride and get by id', async () => {
    const rideEntity = Ride.create({
      passengerId: crypto.randomUUID(),
      fromLat: 1,
      fromLong: 2,
      toLat: 4,
      toLong: 5
    })

    await rideDAO.save(rideEntity)
    const ride = await rideDAO.getById(rideEntity.rideId)
    expect(ride.passengerId).toBe(rideEntity.passengerId)
    expect(ride.getStatus()).toBe(rideEntity.getStatus())
    expect(ride.fromLat).toBe(rideEntity.fromLat)
    expect(ride.fromLong).toBe(rideEntity.fromLong)
    expect(ride.toLat).toBe(rideEntity.toLat)
    expect(ride.toLong).toBe(rideEntity.toLong)
  })
})
