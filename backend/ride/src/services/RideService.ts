/* eslint-disable @typescript-eslint/no-explicit-any */
import AccountDAO from '../dao/account/AccountDAO'
import AccountDAODatabase from '../dao/account/AccountDAODatabase'
import PositionDAO from '../dao/position/PositionDAO'
import PositionDAODatabase from '../dao/position/PositionDAODatabase'
import RideDAO from '../dao/ride/RideDAO'
import RideDAODatabase from '../dao/ride/RideDAODatabase'
import DistanceCalculator from '../distance/DistanceCalculator'
import DistanceCalculatorStraightLine from '../distance/DistanceCalculatorStraightLine'
import crypto from 'crypto'
import RideStatus from '../domain/RideStatus'
import Ride from '../domain/Ride'

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

export default class RideService {
  constructor(
    readonly rideDAO: RideDAO = new RideDAODatabase(),
    readonly accountDAO: AccountDAO = new AccountDAODatabase(),
    readonly poisitionDAO: PositionDAO = new PositionDAODatabase(),
    readonly distanceCalculator: DistanceCalculator = new DistanceCalculatorStraightLine(),
    readonly farePrice = 2.1
  ) {}

  async requestRide({ passengerId, from, to }: GetRideParams) {
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

  async acceptRide({ driverId, rideId }: AcceptRideParams) {
    const account = await this.accountDAO.getById(driverId)
    if (!account?.isDriver) throw new Error('Only drivers can accept rides')
    const ride = await this.getRide(rideId)
    const activeRides = await this.rideDAO.getActiveRidesByDriverId(driverId)
    if (activeRides.length > 0)
      throw new Error('Driver is already in another ride')
    ride.accept(driverId)
    await this.rideDAO.update(ride)
  }

  async startRide(rideId: string) {
    const ride = await this.getRide(rideId)
    if (!ride) throw new Error('Ride not found')
    if (ride.getStatus() != RideStatus.Accepeted)
      throw new Error('The ride is not accepted')
    const updatedRide = {
      rideId,
      driverId: ride.driverId,
      status: RideStatus.InProgress
    }
    await this.rideDAO.update(updatedRide)
  }

  async updatePosition({ rideId, lat, long }: UpdatePositionParams) {
    const ride = await this.getRide(rideId)
    if (!ride) throw new Error('Ride not found')
    if (ride.getStatus() != RideStatus.InProgress)
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
    if (ride.getStatus() != RideStatus.InProgress)
      throw new Error('The ride is not in progress')
    const positions = await this.poisitionDAO.getByRideId(rideId)
    const totalDistance = positions
      .map((pos: any) => ({
        lat: pos.lat,
        long: pos.long
      }))
      .reduce(
        (
          total: number,
          position: { lat: number; long: number },
          index: number
        ) => {
          if (index == 0) return 0
          const lastPosition = positions[index - 1]
          total += this.distanceCalculator.calculate(lastPosition, position)
          return total
        },
        0
      )
    const updatedRide = {
      rideId,
      driverId: ride.driverId,
      status: RideStatus.Completed,
      distance: totalDistance,
      fare: totalDistance * this.farePrice
    }
    await this.rideDAO.update(updatedRide)
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
