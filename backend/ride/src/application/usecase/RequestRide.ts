import AccountDAO from '../../dao/account/AccountDAO'
import AccountDAODatabase from '../../dao/account/AccountDAODatabase'
import RideDAO from '../../dao/ride/RideDAO'
import RideDAODatabase from '../../dao/ride/RideDAODatabase'
import Ride from '../../domain/Ride'

// type refers to data structure. Interfaces are better when we have some behavior to implement.
export type RequestRideParams = {
  passengerId: string
  from: {
    lat: number
    long: number
  }
  to: {
    lat: number
    long: number
  }
}

// SRP - Single Responsibility Principle
// Just one reason to change
export default class RideService {
  constructor(
    readonly rideDAO: RideDAO = new RideDAODatabase(),
    readonly accountDAO: AccountDAO = new AccountDAODatabase()
  ) {}

  async execute({ passengerId, from, to }: RequestRideParams) {
    const account = await this.accountDAO.getById(passengerId)
    if (!account?.isPassenger)
      throw new Error('Account is not from a passenger')
    const activeRides =
      await this.rideDAO.getActiveRidesByPassengerId(passengerId)
    if (activeRides.length > 0)
      throw new Error('This passenger already has an active ride')
    const ride = Ride.create({
      passengerId: account?.accountId,
      fromLat: from.lat,
      fromLong: from.long,
      toLat: to.lat,
      toLong: to.long
    })
    await this.rideDAO.save(ride)
    return {
      rideId: ride.rideId
    }
  }
}
