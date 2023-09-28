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
    expect(ride.passenger_id).toBe(rideEntity.passengerId)
    expect(ride.status).toBe(rideEntity.getStatus())
    expect(ride.from_lat).toBe(rideEntity.fromLat)
    expect(ride.from_long).toBe(rideEntity.fromLong)
    expect(ride.to_lat).toBe(rideEntity.toLat)
    expect(ride.to_long).toBe(rideEntity.toLong)
  })
})
