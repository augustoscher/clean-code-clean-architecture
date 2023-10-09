import RideStatus from './RideStatus'

export type RestoreRideParams = {
  rideId: string
  passengerId: string
  driverId: string
  status: RideStatus
  fromLat: number
  fromLong: number
  toLat: number
  toLong: number
  date: Date
  distance: number
  fare: number
}

export default class Ride {
  private constructor(
    readonly rideId: string,
    readonly passengerId: string,
    readonly status: string,
    readonly fromLat: number,
    readonly fromLong: number,
    readonly toLat: number,
    readonly toLong: number,
    readonly date: Date,
    readonly driverId?: string,
    readonly distance?: number,
    readonly fare?: number
  ) {}

  static restore({
    rideId,
    passengerId,
    fromLat,
    status,
    fromLong,
    toLat,
    toLong,
    date,
    driverId,
    distance,
    fare
  }: RestoreRideParams) {
    return new Ride(
      rideId,
      passengerId,
      status as RideStatus,
      fromLat,
      fromLong,
      toLat,
      toLong,
      date,
      driverId,
      distance,
      fare
    )
  }
}
