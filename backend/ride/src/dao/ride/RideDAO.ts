/* eslint-disable @typescript-eslint/no-explicit-any */

import Ride from '../../domain/Ride'

// port
export default interface RideDAO {
  save(ride: Ride): Promise<void>
  update(ride: any): Promise<void>
  getById(rideId: string): Promise<any>
  getActiveRidesByPassengerId(passengerId: string): Promise<any>
  getActiveRidesByDriverId(driverId: string): Promise<any>
}
