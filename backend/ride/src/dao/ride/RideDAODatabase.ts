/* eslint-disable @typescript-eslint/no-explicit-any */
// resource - driven actor
// adapter
import Postgres from '../../database/postgres'
import RideDAO from './RideDAO'

export default class RideDAODatabase implements RideDAO {
  constructor() {}

  async save(ride: any) {
    const connection = Postgres.getConnection()
    try {
      await connection.query(
        'insert into cccat13.ride (ride_id, passenger_id, from_lat, from_long, to_lat, to_long, status, date) values ($1, $2, $3, $4, $5, $6, $7, $8)',
        [
          ride.rideId,
          ride.passengerId,
          ride.from.lat,
          ride.from.long,
          ride.to.lat,
          ride.to.long,
          ride.status,
          ride.date
        ]
      )
    } finally {
      await connection.$pool.end()
    }
  }

  async update(ride: any): Promise<void> {
    const connection = Postgres.getConnection()
    try {
      await connection.query(
        'update cccat13.ride set driver_id = $1, status = $2 where ride_id = $3',
        [ride.driverId, ride.status, ride.rideId]
      )
    } finally {
      await connection.$pool.end()
    }
  }

  async getById(rideId: string): Promise<any> {
    const connection = Postgres.getConnection()
    try {
      const [rideData] = await connection.query(
        'select * from cccat13.ride where ride_id = $1',
        [rideId]
      )

      return rideData
        ? {
            ...rideData,
            from_lat: Number(rideData?.from_lat),
            from_long: Number(rideData?.from_long),
            to_lat: Number(rideData?.to_lat),
            to_long: Number(rideData?.to_long)
          }
        : null
    } finally {
      await connection.$pool.end()
    }
  }

  async getActiveRidesByPassengerId(passengerId: string): Promise<any> {
    const connection = Postgres.getConnection()
    try {
      const ridesData = await connection.query(
        "select * from cccat13.ride where passenger_id = $1 and status in ('REQUESTED', 'ACCEPTED', 'IN_PROGRESS')",
        [passengerId]
      )
      return ridesData
    } finally {
      await connection.$pool.end()
    }
  }

  async getActiveRidesByDriverId(driverId: string): Promise<any> {
    const connection = Postgres.getConnection()
    try {
      const ridesData = await connection.query(
        "select * from cccat13.ride where driver_id = $1 and status in ('ACCEPTED', 'IN_PROGRESS')",
        [driverId]
      )
      return ridesData
    } finally {
      await connection.$pool.end()
    }
  }
}
