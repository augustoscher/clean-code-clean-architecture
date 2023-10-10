import DetailedRide from 'domain/DetailedRide'

// port
export default interface DetailedRideClient {
  getAll(): Promise<DetailedRide[]>
}
