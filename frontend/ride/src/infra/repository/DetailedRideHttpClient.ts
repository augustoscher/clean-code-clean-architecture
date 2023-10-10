import HttpClient from 'application/http/client'
import DetailedRideClient from 'application/repository/DetailedRide'
import DetailedRide from 'domain/DetailedRide'
import RideStatus from 'domain/RideStatus'

export default class DetailedRideHttpClient implements DetailedRideClient {
  constructor(readonly httpClient: HttpClient) {}

  async getAll(): Promise<DetailedRide[]> {
    const result = await this.httpClient.request('GET', '/rides/detail')
    return result.map((item: any) =>
      DetailedRide.restore({
        rideId: item.rideId,
        passenger: item.passenger,
        driver: item.driver,
        status: item.status as RideStatus,
        date: new Date(item.date),
        distance: item.distance,
        fare: item.fare
      })
    )
  }
}
