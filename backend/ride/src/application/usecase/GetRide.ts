import RideDAO from '../../dao/ride/RideDAO'
import RideDAODatabase from '../../dao/ride/RideDAODatabase'

export default class GetRide {
  constructor(readonly rideDAO: RideDAO = new RideDAODatabase()) {}

  async getRide(rideId: string) {
    const ride = await this.rideDAO.getById(rideId)
    return ride
  }
}
