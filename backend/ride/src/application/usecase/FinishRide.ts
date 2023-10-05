/* eslint-disable @typescript-eslint/no-explicit-any */
import RideStatus from '../../domain/RideStatus'
import RideDAO from '../repository/RideDAO'
import PositionDAO from '../repository/PositionDAO'
import DistanceCalculator from '../../domain/distance/DistanceCalculator'

export type AcceptRideParams = {
  driverId: string
  rideId: string
}

export default class FinishRide {
  constructor(
    readonly rideDAO: RideDAO,
    readonly positionDAO: PositionDAO,
    readonly distanceCalculator: DistanceCalculator,
    readonly farePrice = 2.1
  ) {}

  async execute(rideId: string) {
    const ride = await this.rideDAO.getById(rideId)
    if (!ride) throw new Error('Ride not found')
    if (ride.getStatus() != RideStatus.InProgress)
      throw new Error('The ride is not in progress')
    const positions = await this.positionDAO.getByRideId(rideId)
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
    ride.finish(totalDistance, totalDistance * this.farePrice)
    await this.rideDAO.update(ride)
  }
}
