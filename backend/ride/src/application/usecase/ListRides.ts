import RideDAO from '../repository/RideDAO'

export default class ListRides {
  constructor(readonly rideDAO: RideDAO) {}

  async execute() {
    const rides = await this.rideDAO.getAll()
    return rides
  }
}
