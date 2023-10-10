import RideStatus from './RideStatus'

export type RestoreDetailedRideParams = {
  rideId: string
  passenger: string
  driver: string
  status: RideStatus
  date: Date
  distance: number
  fare: number
}

export default class DetailedRide {
  private constructor(
    readonly rideId: string,
    readonly passenger: string,
    readonly driver: string,
    readonly status: string,
    readonly date: Date,
    readonly distance?: number,
    readonly fare?: number
  ) {}

  static restore({
    rideId,
    passenger,
    driver,
    status,
    date,
    distance,
    fare
  }: RestoreDetailedRideParams) {
    return new DetailedRide(
      rideId,
      passenger,
      driver,
      status as RideStatus,
      date,
      distance,
      fare
    )
  }
}
