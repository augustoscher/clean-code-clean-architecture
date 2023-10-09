import FetchAdapter from 'infra/http/FetchAdapter'
import RideHttpClient from '../infra/repository/RideHttpClient'
import GetRide from './usecase/GetRide'
import UseCase from './usecase/UseCase'
import ListRides from './usecase/ListRides'

const fetchAdapter = new FetchAdapter()
const rideClient = new RideHttpClient(fetchAdapter)

export default class UseCaseFactory {
  static getUseCase(kind: string): UseCase {
    switch (kind) {
      case 'GetRide':
        return new GetRide(rideClient)
      case 'ListRides':
        return new ListRides(rideClient)
    }
    throw new Error('Invalid use case')
  }
}
