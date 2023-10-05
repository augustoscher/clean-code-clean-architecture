/* eslint-disable @typescript-eslint/no-explicit-any */
import RideDAO from '../../application/repository/RideDAO'
import Ride from '../../domain/Ride'
import RideStatus from '../../domain/RideStatus'
import Connection from '../database/Connection'

export default class RideDAODatabase implements RideDAO {
  constructor(readonly connection: Connection) {}

  async save(ride: Ride) {
    await this.connection.query(
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
  }

  async update(ride: Ride): Promise<void> {
    await this.connection.query(
      'update cccat13.ride set driver_id = $1, status = $2, distance = $3, fare = $4 where ride_id = $5',
      [ride.driverId, ride.getStatus(), ride.distance, ride.fare, ride.rideId]
    )
  }

  async getById(rideId: string): Promise<Ride> {
    const [rideData] = await this.connection.query(
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
  }

  async getActiveRidesByPassengerId(passengerId: string): Promise<any> {
    const ridesData = await this.connection.query(
      "select * from cccat13.ride where passenger_id = $1 and status in ('REQUESTED', 'ACCEPTED', 'IN_PROGRESS')",
      [passengerId]
    )
    return ridesData
  }

  async getActiveRidesByDriverId(driverId: string): Promise<any> {
    const ridesData = await this.connection.query(
      "select * from cccat13.ride where driver_id = $1 and status in ('ACCEPTED', 'IN_PROGRESS')",
      [driverId]
    )
    return ridesData
  }
}
