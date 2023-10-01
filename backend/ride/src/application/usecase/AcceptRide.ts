import AccountDAO from '../../dao/account/AccountDAO'
import AccountDAODatabase from '../../dao/account/AccountDAODatabase'
import RideDAO from '../../dao/ride/RideDAO'
import RideDAODatabase from '../../dao/ride/RideDAODatabase'

export type AcceptRideParams = {
  driverId: string
  rideId: string
}

export default class RideService {
  constructor(
    readonly rideDAO: RideDAO = new RideDAODatabase(),
    readonly accountDAO: AccountDAO = new AccountDAODatabase()
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
