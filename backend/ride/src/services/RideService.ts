import AccountDAO from '../dao/account/AccountDAO'
import AccountDAODatabase from '../dao/account/AccountDAODatabase'
import PositionDAO from '../dao/position/PositionDAO'
import PositionDAODatabase from '../dao/position/PositionDAODatabase'
import RideDAO from '../dao/ride/RideDAO'
import RideDAODatabase from '../dao/ride/RideDAODatabase'
import crypto from 'crypto'

export type GetRideParams = {
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
export type AcceptRideParams = {
  driverId: string
  rideId: string
}
export type UpdatePositionParams = {
  rideId: string
  lat: number
  long: number
}
export type RidePositions = {
  ride_id: string
  position_id: string
  lat: number
  long: number
  date: Date
}

export enum RideStatus {
  Requested = 'REQUESTED',
  Accepeted = 'ACCEPTED',
  InProgress = 'IN_PROGRESS',
  Completed = 'COMPLETED',
  Canceled = 'CANCELED'
}

export default class RideService {
  constructor(
    readonly rideDAO: RideDAO = new RideDAODatabase(),
    readonly accountDAO: AccountDAO = new AccountDAODatabase(),
    readonly poisitionDAO: PositionDAO = new PositionDAODatabase()
  ) {}

  async requestRide({ passengerId, from, to }: GetRideParams) {
    const account = await this.accountDAO.getById(passengerId)
    if (!account.is_passenger)
      throw new Error('Account is not from a passenger')
    const activeRides =
      await this.rideDAO.getActiveRidesByPassengerId(passengerId)
    if (activeRides.length > 0)
      throw new Error('This passenger already has an active ride')
    const rideId = crypto.randomUUID()
    await this.rideDAO.save({
      rideId,
      passengerId: account.account_id,
      from: {
        lat: from.lat,
        long: from.long
      },
      to: {
        lat: to.lat,
        long: to.long
      },
      status: RideStatus.Requested,
      date: new Date()
    })
    return {
      rideId
    }
  }

  async acceptRide({ driverId, rideId }: AcceptRideParams) {
    const account = await this.accountDAO.getById(driverId)
    if (!account.is_driver) throw new Error('Only drivers can accept rides')
    const ride = await this.getRide(rideId)
    if (ride.status != RideStatus.Requested)
      throw new Error('The ride is not requested')
    const activeRides = await this.rideDAO.getActiveRidesByDriverId(driverId)
    if (activeRides.length > 0)
      throw new Error('Driver is already in another ride')
    ride.rideId = rideId
    ride.driverId = driverId
    ride.status = RideStatus.Accepeted
    await this.rideDAO.update(ride)
  }

  async startRide(rideId: string) {
    const ride = await this.getRide(rideId)
    if (!ride) throw new Error('Ride not found')
    if (ride.status != RideStatus.Accepeted)
      throw new Error('The ride is not accepted')
    const updatedRide = {
      rideId,
      driverId: ride.driver_id,
      status: RideStatus.InProgress
    }
    await this.rideDAO.update(updatedRide)
  }

  async updatePosition({ rideId, lat, long }: UpdatePositionParams) {
    const ride = await this.getRide(rideId)
    if (!ride) throw new Error('Ride not found')
    if (ride.status != RideStatus.InProgress)
      throw new Error('The ride is not in progress')
    const positionId = crypto.randomUUID()
    await this.poisitionDAO.save({
      positionId,
      rideId,
      lat,
      long,
      date: new Date()
    })
  }

  async finishRide(rideId: string) {
    const ride = await this.getRide(rideId)
    if (!ride) throw new Error('Ride not found')
    if (ride.status != RideStatus.InProgress)
      throw new Error('The ride is not in progress')
  }

  async getRide(rideId: string) {
    const ride = await this.rideDAO.getById(rideId)
    return ride
  }

  async getRidePositions(rideId: string): Promise<[RidePositions] | []> {
    const positions = await this.poisitionDAO.getByRideId(rideId)
    return positions
  }
}
