import RideDAO from '../../dao/ride/RideDAO'
import RideDAODatabase from '../../dao/ride/RideDAODatabase'
import RideStatus from '../../domain/RideStatus'

export default class StartRide {
  constructor(readonly rideDAO: RideDAO = new RideDAODatabase()) {}

  async execute(rideId: string) {
    const ride = await this.rideDAO.getById(rideId)
    if (!ride) throw new Error('Ride not found')
    if (ride.getStatus() != RideStatus.Accepeted)
      throw new Error('The ride is not accepted')
    const updatedRide = {
      rideId,
      driverId: ride.driverId,
      status: RideStatus.InProgress
    }
    await this.rideDAO.update(updatedRide)
  }
}
