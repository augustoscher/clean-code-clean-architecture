/* eslint-disable @typescript-eslint/no-explicit-any */
import PositionDAO from '../../application/repository/PositionDAO'
import Connection from '../database/Connection'

export default class PositionDAODatabase implements PositionDAO {
  constructor(readonly connection: Connection) {}

  async save(position: any): Promise<void> {
    await this.connection.query(
      'insert into cccat13.position (position_id, ride_id, lat, long, date) values ($1, $2, $3, $4, $5)',
      [
        position.positionId,
        position.rideId,
        position.lat,
        position.long,
        position.date
      ]
    )
  }

  async getById(positionId: string): Promise<any> {
    const [positionData] = await this.connection.query(
      'select * from cccat13.position where position_id = $1',
      [positionId]
    )
    return {
      ...positionData,
      lat: Number(positionData.lat),
      long: Number(positionData.long)
    }
  }

  async getByRideId(rideId: string): Promise<any> {
    const positionsData = await this.connection.query(
      'select * from cccat13.position where ride_id = $1',
      [rideId]
    )
    return positionsData.map((positionData: any) => ({
      ...positionData,
      lat: Number(positionData.lat),
      long: Number(positionData.long)
    }))
  }
}
