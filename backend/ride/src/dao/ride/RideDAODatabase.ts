/* eslint-disable @typescript-eslint/no-explicit-any */
// resource - driven actor
// adapter
import Postgres from '../../database/postgres'
import Ride from '../../domain/Ride'
import RideStatus from '../../domain/RideStatus'
import RideDAO from './RideDAO'

export default class RideDAODatabase implements RideDAO {
  constructor() {}

  async save(ride: Ride) {
    const connection = Postgres.getConnection()
    try {
      await connection.query(
        'insert into cccat13.ride (ride_id, passenger_id, from_lat, from_long, to_lat, to_long, status, date) values ($1, $2, $3, $4, $5, $6, $7, $8)',
        [
          ride.rideId,
          ride.passengerId,
          ride.fromLat,
          ride.fromLong,
          ride.toLat,
          ride.toLong,
          ride.getStatus(),
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
        'update cccat13.ride set driver_id = $1, status = $2, distance = $3, fare = $4 where ride_id = $5',
        [ride.driverId, ride.status, ride.distance, ride.fare, ride.rideId]
      )
    } finally {
      await connection.$pool.end()
    }
  }

  async getById(rideId: string): Promise<Ride> {
    const connection = Postgres.getConnection()
    try {
      const [rideData] = await connection.query(
        'select * from cccat13.ride where ride_id = $1',
        [rideId]
      )

      return Ride.restore({
        rideId: rideData.ride_id,
        passengerId: rideData.passenger_id,
        driverId: rideData.driver_id,
        fromLat: Number(rideData.from_lat),
        fromLong: Number(rideData.from_long),
        toLat: Number(rideData.to_lat),
        toLong: Number(rideData.to_long),
        status: rideData.status as RideStatus,
        distance: Number(rideData.distance),
        fare: Number(rideData.fare),
        date: rideData.date
      })
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
