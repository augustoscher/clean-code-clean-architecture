import PositionDAODatabase from '../dao/position/PositionDAODatabase'

describe('PositionDAODatabase', () => {
  const positionDAO = new PositionDAODatabase()

  it('should create position and get by id', async () => {
    const input = {
      positionId: crypto.randomUUID(),
      rideId: crypto.randomUUID(),
      lat: 1,
      long: 2,
      date: new Date()
    }
    await positionDAO.save(input)
    const position = await positionDAO.getById(input.positionId)
    expect(position.ride_id).toBe(input.rideId)
    expect(position.lat).toBe(input.lat)
    expect(position.long).toBe(input.long)
  })
})
