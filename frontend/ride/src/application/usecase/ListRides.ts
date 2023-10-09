import RideClient from 'application/repository/ride'
import UseCase from './UseCase'

export default class ListRides implements UseCase {
  constructor(readonly rideClient: RideClient) {}

  async execute() {
    const ride = await this.rideClient.getAll()
    return ride
  }
}