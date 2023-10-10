import DetailedRideClient from 'application/repository/DetailedRide'
import UseCase from './UseCase'

export default class ListDetailedRides implements UseCase {
  constructor(readonly detailedRideClient: DetailedRideClient) {}

  execute() {
    return this.detailedRideClient.getAll()
  }
}
