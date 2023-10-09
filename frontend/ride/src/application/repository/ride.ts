import Ride from 'domain/Ride'

// port
export default interface RideClient {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getById(rideId: string): Promise<any | undefined>
  getAll(): Promise<Ride[]>
}
