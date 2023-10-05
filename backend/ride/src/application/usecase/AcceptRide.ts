import AccountDAO from '../repository/AccountDAO'
import RideDAO from '../repository/RideDAO'

export type AcceptRideParams = {
  driverId: string
  rideId: string
}

export default class AcceptRide {
  constructor(
    readonly rideDAO: RideDAO,
    readonly accountDAO: AccountDAO
  ) {}

  async execute({ driverId, rideId }: AcceptRideParams) {
    const account = await this.accountDAO.getById(driverId)
    if (!account?.isDriver) throw new Error('Only drivers can accept rides')
    const ride = await this.rideDAO.getById(rideId)
    const activeRides = await this.rideDAO.getActiveRidesByDriverId(driverId)
    if (activeRides.length > 0)
      throw new Error('Driver is already in another ride')
    ride.accept(driverId)
    await this.rideDAO.update(ride)
  }
}
