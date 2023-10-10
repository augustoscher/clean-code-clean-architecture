import FetchAdapter from 'infra/http/FetchAdapter'
import RideHttpClient from '../infra/repository/RideHttpClient'
import DetailedRideHttpClient from 'infra/repository/DetailedRideHttpClient'
import GetRide from './usecase/GetRide'
import UseCase from './usecase/UseCase'
import ListRides from './usecase/ListRides'
import ListDetailedRides from './usecase/ListDetailedRides'

const fetchAdapter = new FetchAdapter()
const rideClient = new RideHttpClient(fetchAdapter)
const detailedRideClient = new DetailedRideHttpClient(fetchAdapter)

export default class UseCaseFactory {
  static getUseCase(kind: string): UseCase {
    switch (kind) {
      case 'GetRide':
        return new GetRide(rideClient)
      case 'ListRides':
        return new ListRides(rideClient)
      case 'ListDetailedRides':
        return new ListDetailedRides(detailedRideClient)
    }
    throw new Error('Invalid use case')
  }
}
