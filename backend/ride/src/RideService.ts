import AccountService from './AccountService'
import Postgres from './database/postgres'
import crypto from 'crypto'

export type GetRideParams = {
  accountId: string
  from: {
    lat: number
    long: number
  }
  to: {
    lat: number
    long: number
  }
}
export type AcceptRideParams = {
  driverId: string
  rideId: string
}

export enum RideStatus {
  Requested = 'REQUESTED',
  Accepeted = 'ACCEPTED',
  InProgress = 'IN_PROGRESS',
  Completed = 'COMPLETED',
  Canceled = 'CANCELED'
}

export default class RideService {
  accountService: AccountService

  constructor() {
    this.accountService = new AccountService()
  }

  async requestRide({ accountId, from, to }: GetRideParams) {
    const account = await this.accountService.getAccount(accountId)
    if (!account.is_passenger)
      throw new Error('Only passengers can request rides')
    const uncompletedRide = await this.getUnfinishedRidesByPassenger(
      account.account_id
    )
    if (uncompletedRide)
      throw new Error('Passenger already have an uncompleted ride')
    const rideId = crypto.randomUUID()
    const { lat: fromLat, long: fromLong } = from
    const { lat: toLat, long: toLong } = to
    const fare = 0
    const distance = 0
    const driverId = null
    const connection = Postgres.getConnection()
    try {
      await connection.query(
        'insert into cccat13.ride (ride_id, passenger_id, driver_id, status, fare, distance, from_lat, from_long, to_lat, to_long, date) values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)',
        [
          rideId,
          account.account_id,
          driverId,
          RideStatus.Requested,
          fare,
          distance,
          fromLat,
          fromLong,
          toLat,
          toLong,
          new Date()
        ]
      )
      return {
        rideId
      }
    } finally {
      await connection.$pool.end()
    }
  }

  async acceptRide({ driverId, rideId }: AcceptRideParams) {
    const account = await this.accountService.getAccount(driverId)
    if (!account.is_driver) throw new Error('Only drivers can accept rides')
    const ride = await this.getRide(rideId)
    if (ride.status != RideStatus.Requested)
      throw new Error('Only rides with status requested can be accepted')
    const driverPendingRides = await this.getDriverPendingRides(
      account.account_id
    )
    if (driverPendingRides)
      throw new Error('Driver already have an uncompleted ride')
    const connection = Postgres.getConnection()
    try {
      await connection.query(
        "update cccat13.ride set status = 'ACCEPTED', driver_id = $1 where ride_id = $2",
        [account.account_id, ride.ride_id]
      )
    } finally {
      await connection.$pool.end()
    }
  }

  async getRide(rideId: string) {
    const connection = Postgres.getConnection()
    const [ride] = await connection.query(
      'select * from cccat13.ride where ride_id = $1',
      [rideId]
    )
    await connection.$pool.end()
    return ride
  }

  async getDriverPendingRides(accountId: string) {
    const connection = Postgres.getConnection()
    const [ride] = await connection.query(
      "select * from cccat13.ride where driver_id = $1 and status in ('ACCEPTED', 'IN_PROGRESS')",
      [accountId]
    )
    await connection.$pool.end()
    return ride
  }

  async getUnfinishedRidesByPassenger(accountId: string) {
    const connection = Postgres.getConnection()
    const [ride] = await connection.query(
      "select * from cccat13.ride where passenger_id = $1 and status not in ('COMPLETED', 'CANCELED')",
      [accountId]
    )
    await connection.$pool.end()
    return ride
  }
}
