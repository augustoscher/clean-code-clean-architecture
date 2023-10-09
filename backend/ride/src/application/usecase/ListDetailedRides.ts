import Account from '../../domain/Account'
import AccountDAO from '../repository/AccountDAO'
import RideDAO from '../repository/RideDAO'

export default class ListDetailedRides {
  accountCache: Map<string, Account>

  constructor(
    readonly rideDAO: RideDAO,
    readonly accountDAO: AccountDAO
  ) {
    this.accountCache = new Map()
  }

  async getAccountName(accountId: string) {
    if (this.accountCache.has(accountId)) {
      return this.accountCache.get(accountId)?.name
    }
    const account = await this.accountDAO.getById(accountId)
    if (account) this.accountCache.set(accountId, account)
    return account?.name
  }

  async execute() {
    this.accountCache = new Map()
    const rides = await this.rideDAO.getAll()
    return Promise.all(
      rides.map(async ride => ({
        passenger: await this.getAccountName(ride.passengerId),
        driver: ride.driverId ? await this.getAccountName(ride.driverId) : '',
        date: ride.date,
        status: ride.getStatus(),
        distance: ride.distance,
        fare: ride.fare
      }))
    )
  }
}
