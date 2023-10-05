import RideStatus from '../../domain/RideStatus'
import PositionDAO from '../repository/PositionDAO'
import RideDAO from '../repository/RideDAO'

export type UpdatePositionParams = {
  rideId: string
  lat: number
  long: number
}

export default class GetRide {
  constructor(
    readonly rideDAO: RideDAO,
    readonly positionDAO: PositionDAO
  ) {}

  async execute({ rideId, lat, long }: UpdatePositionParams) {
    const ride = await this.rideDAO.getById(rideId)
    if (!ride) throw new Error('Ride not found')
    if (ride.getStatus() != RideStatus.InProgress)
      throw new Error('The ride is not in progress')
    const positionId = crypto.randomUUID()
    await this.positionDAO.save({
      positionId,
      rideId,
      lat,
      long,
      date: new Date()
    })
  }
}
