/* eslint-disable @typescript-eslint/no-explicit-any */

import Ride from '../../domain/Ride'

// port
export default interface RideDAO {
  save(ride: Ride): Promise<void>
  update(ride: any): Promise<void>
  getAll(): Promise<Ride[] | []>
  getById(rideId: string): Promise<Ride>
  getActiveRidesByPassengerId(passengerId: string): Promise<any>
  getActiveRidesByDriverId(driverId: string): Promise<any>
}
