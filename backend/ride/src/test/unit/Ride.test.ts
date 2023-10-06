import Ride from '../../domain/Ride'
import RideStatus from '../../domain/RideStatus'

describe('Ride', function () {
  test('should create ride', function () {
    const ride = Ride.create({
      passengerId: '',
      fromLat: 0,
      fromLong: 0,
      toLat: 0,
      toLong: 0
    })
    expect(ride.rideId).toBeDefined()
    expect(ride.getStatus()).toBe(RideStatus.Requested)
  })

  test('should accept a ride', function () {
    const ride = Ride.create({
      passengerId: '',
      fromLat: 0,
      fromLong: 0,
      toLat: 0,
      toLong: 0
    })
    ride.accept('')
    expect(ride.getStatus()).toBe(RideStatus.Accepeted)
  })
})
