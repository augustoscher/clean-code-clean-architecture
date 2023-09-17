/* eslint-disable @typescript-eslint/no-explicit-any */
import Postgres from '../../database/postgres'
import PositionDAO from './PositionDAO'

export default class PositionDAODatabase implements PositionDAO {
  constructor() {}

  async save(position: any): Promise<void> {
    const connection = Postgres.getConnection()
    try {
      await connection.query(
        'insert into cccat13.position (position_id, ride_id, lat, long, date) values ($1, $2, $3, $4, $5)',
        [
          position.positionId,
          position.rideId,
          position.lat,
          position.long,
          position.date
        ]
      )
    } finally {
      await connection.$pool.end()
    }
  }

  // async update(position: any): Promise<void> {}

  async getById(positionId: string): Promise<any> {
    const connection = Postgres.getConnection()
    try {
      const [positionData] = await connection.query(
        'select * from cccat13.position where position_id = $1',
        [positionId]
      )
      return {
        ...positionData,
        lat: Number(positionData.lat),
        long: Number(positionData.long)
      }
    } finally {
      await connection.$pool.end()
    }
  }

  async getByRideId(rideId: string): Promise<any> {
    const connection = Postgres.getConnection()
    try {
      const positionsData = await connection.query(
        'select * from cccat13.position where ride_id = $1',
        [rideId]
      )
      return positionsData.map((positionData: any) => ({
        ...positionData,
        lat: Number(positionData.lat),
        long: Number(positionData.long)
      }))
    } finally {
      await connection.$pool.end()
    }
  }
}
