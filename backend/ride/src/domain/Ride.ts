import crypto from 'crypto'
import RideStatus from './RideStatus'

export type CreateRideParams = {
  passengerId: string
  fromLat: number
  fromLong: number
  toLat: number
  toLong: number
}
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
  driverId?: string
  distance?: number
  fare?: number

  private constructor(
    readonly rideId: string,
    readonly passengerId: string,
    private status: string,
    readonly fromLat: number,
    readonly fromLong: number,
    readonly toLat: number,
    readonly toLong: number,
    readonly date: Date,
    distance: number = 0,
    fare: number = 0
  ) {
    this.distance = distance
    this.fare = fare
  }

  static create({
    passengerId,
    fromLat,
    fromLong,
    toLat,
    toLong
  }: CreateRideParams) {
    const rideId = crypto.randomUUID()
    const status = RideStatus.Requested
    const date = new Date()
    return new Ride(
      rideId,
      passengerId,
      status,
      fromLat,
      fromLong,
      toLat,
      toLong,
      date
    )
  }

  static restore({
    rideId,
    passengerId,
    driverId,
    status,
    fromLat,
    fromLong,
    toLat,
    toLong,
    date,
    distance,
    fare
  }: RestoreRideParams) {
    const ride = new Ride(
      rideId,
      passengerId,
      status,
      fromLat,
      fromLong,
      toLat,
      toLong,
      date,
      distance,
      fare
    )
    ride.driverId = driverId
    return ride
  }

  accept(driverId: string) {
    if (this.status !== RideStatus.Requested)
      throw new Error('The ride is not requested')
    this.driverId = driverId
    this.status = RideStatus.Accepeted
  }

  start() {
    if (this.status !== RideStatus.Accepeted)
      throw new Error('The ride is not accepted')
    this.status = RideStatus.InProgress
  }

  finish(distance: number, fare: number) {
    if (this.status !== RideStatus.InProgress)
      throw new Error('The ride is not in progress')
    this.status = RideStatus.Completed
    this.distance = distance
    this.fare = fare
  }

  getStatus() {
    return this.status
  }
}
