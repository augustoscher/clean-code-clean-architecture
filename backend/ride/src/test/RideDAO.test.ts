import RideDAODatabase from '../dao/ride/RideDAODatabase'
import Ride from '../domain/Ride'

describe('RideDAODatabase', () => {
  const rideDAO = new RideDAODatabase()

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
    expect(ride.status).toBe(rideEntity.getStatus())
    expect(ride.fromLat).toBe(rideEntity.fromLat)
    expect(ride.fromLong).toBe(rideEntity.fromLong)
    expect(ride.toLat).toBe(rideEntity.toLat)
    expect(ride.toLong).toBe(rideEntity.toLong)
  })
})
