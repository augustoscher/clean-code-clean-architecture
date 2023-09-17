import RideDAODatabase from '../dao/ride/RideDAODatabase'

describe('RideDAODatabase', () => {
  const rideDAO = new RideDAODatabase()

  it('should create ride and get by id', async () => {
    const input = {
      rideId: crypto.randomUUID(),
      passengerId: crypto.randomUUID(),
      from: {
        lat: 1,
        long: 2
      },
      to: {
        lat: 4,
        long: 5
      },
      status: 'REQUESTED',
      date: new Date()
    }

    await rideDAO.save(input)
    const ride = await rideDAO.getById(input.rideId)
    expect(ride.passenger_id).toBe(input.passengerId)
    expect(ride.status).toBe(input.status)
    expect(ride.from_lat).toBe(input.from.lat)
    expect(ride.from_long).toBe(input.from.long)
    expect(ride.to_lat).toBe(input.to.lat)
    expect(ride.to_long).toBe(input.to.long)
  })
})
