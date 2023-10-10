import RideClient from 'application/repository/Ride'
import UseCase from './UseCase'

export default class ListRides implements UseCase {
  constructor(readonly rideClient: RideClient) {}

  async execute() {
    const ride = await this.rideClient.getAll()
    return ride
  }
}
