import RideClient from 'application/client/ride'

export default class ListRides {
  constructor(readonly rideClient: RideClient) {}

  async execute() {
    const ride = await this.rideClient.getAll()
    return ride
  }
}
