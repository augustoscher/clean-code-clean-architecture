/* eslint-disable @typescript-eslint/no-explicit-any */
import RideDAO from '../application/repository/RideDAO'
import DistanceCalculator from '../distance/DistanceCalculator'
import DistanceCalculatorStraightLine from '../distance/DistanceCalculatorStraightLine'
import RideStatus from '../domain/RideStatus'

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

export type RidePositions = {
  ride_id: string
  position_id: string
  lat: number
  long: number
  date: Date
}

export default class RideService {
  constructor(
    readonly distanceCalculator: DistanceCalculator = new DistanceCalculatorStraightLine(),
    readonly farePrice = 2.1
  ) {}

  async finishRide(rideId: string) {
    const ride = await this.rideDAO.getById(rideId)
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
}
