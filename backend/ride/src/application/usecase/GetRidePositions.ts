import PositionDAO from '../repository/PositionDAO'

export default class GetRidePositions {
  constructor(readonly positionDAO: PositionDAO) {}

  async execute(rideId: string) {
    const positions = await this.positionDAO.getByRideId(rideId)
    return positions
  }
}
