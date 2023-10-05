import RideDAO from '../repository/RideDAO'
import RideStatus from '../../domain/RideStatus'

export default class StartRide {
  constructor(readonly rideDAO: RideDAO) {}

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
