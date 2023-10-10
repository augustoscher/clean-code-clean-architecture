import RideClient from 'application/repository/Ride'
import UseCase from './UseCase'

export default class GetRide implements UseCase {
  constructor(readonly rideClient: RideClient) {}

  async execute(rideId: string) {
    const ride = await this.rideClient.getById(rideId)
    return ride
  }
}
