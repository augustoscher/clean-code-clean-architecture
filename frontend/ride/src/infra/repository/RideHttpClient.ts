/* eslint-disable @typescript-eslint/no-explicit-any */
import HttpClient from 'application/http/client'
import RideClient from 'application/repository/Ride'
import Ride from 'domain/Ride'
import RideStatus from 'domain/RideStatus'

export default class RideHttpClient implements RideClient {
  constructor(readonly httpClient: HttpClient) {}

  async getById(rideId: string): Promise<Ride | undefined> {
    const result = await this.httpClient.request('GET', `/rides/${rideId}`)
    return Ride.restore({
      ...result
    })
  }

  async getAll(): Promise<Ride[]> {
    const result = await this.httpClient.request('GET', '/rides')
    return result.map((item: any) =>
      Ride.restore({
        rideId: item.rideId,
        passengerId: item.passengerId,
        status: item.status as RideStatus,
        fromLong: item.fromLong,
        toLong: item.toLong,
        fromLat: item.fromLat,
        toLat: item.toLat,
        date: new Date(item.date),
        driverId: item.driverId,
        distance: item.distance,
        fare: item.fare
      })
    )
  }
}
