import AccountService from '../AccountService'
import RideService from '../RideService'
import Postgres from '../database/postgres'

describe('RideService', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const createAccount = async (input: any) => {
    const accountService = new AccountService()
    return accountService.signup(input)
  }

  let passengerAccountId: string
  let driverAccountId: string

  beforeAll(async () => {
    const { accountId: passengerId } = await createAccount({
      name: 'John Doe',
      email: `john.doe${Math.random()}@gmail.com`,
      cpf: '95818705552',
      isPassenger: true
    })
    const { accountId: driverId } = await createAccount({
      name: 'John Doe',
      email: `john.doe${Math.random()}@gmail.com`,
      cpf: '95818705552',
      isPassenger: false,
      isDriver: true,
      carPlate: 'AAA9999'
    })
    passengerAccountId = passengerId
    driverAccountId = driverId
  })

  beforeEach(async () => {
    const connection = Postgres.getConnection()
    await connection.query('delete from cccat13.ride')
    await connection.$pool.end()
  })

  describe('requestRide', () => {
    test('should allow a passenger to request ride', async () => {
      const input = {
        passengerId: passengerAccountId,
        from: { lat: 0, long: 0 },
        to: { lat: 0, long: 0 }
      }
      const rideService = new RideService()
      const output = await rideService.requestRide(input)
      expect(output.rideId).toBeDefined()
    })

    test("shouldn't allow not a passenger to request ride", async () => {
      const input = {
        passengerId: driverAccountId,
        from: { lat: 0, long: 0 },
        to: { lat: 0, long: 0 }
      }
      const rideService = new RideService()
      await expect(() => rideService.requestRide(input)).rejects.toThrow(
        new Error('Account is not from a passenger')
      )
    })

    test("shouldn't allow request new ride if passenger already have an uncompleted ride", async () => {
      const input = {
        passengerId: passengerAccountId,
        from: { lat: 0, long: 0 },
        to: { lat: 0, long: 0 }
      }
      const rideService = new RideService()
      await rideService.requestRide(input)
      await expect(() => rideService.requestRide(input)).rejects.toThrow(
        new Error('This passenger already has an active ride')
      )
    })

    test('should set status as "requested"', async () => {
      const input = {
        passengerId: passengerAccountId,
        from: { lat: 0, long: 0 },
        to: { lat: 0, long: 0 }
      }
      const rideService = new RideService()
      const output = await rideService.requestRide(input)
      const ride = await rideService.getRide(output.rideId)
      expect(ride.status).toBe('REQUESTED')
    })
  })

  describe('acceptRide', () => {
    it('should allow a driver to accept a ride', async () => {
      const input = {
        passengerId: passengerAccountId,
        from: { lat: 0, long: 0 },
        to: { lat: 0, long: 0 }
      }
      const rideService = new RideService()
      const { rideId } = await rideService.requestRide(input)
      await rideService.acceptRide({ driverId: driverAccountId, rideId })
      const ride = await rideService.getRide(rideId)
      expect(ride.status).toBe('ACCEPTED')
      expect(ride.driver_id).toBe(driverAccountId)
    })

    it("shouldn't allow passenger to accept a ride", async () => {
      const input = {
        passengerId: passengerAccountId,
        from: { lat: 0, long: 0 },
        to: { lat: 0, long: 0 }
      }
      const rideService = new RideService()
      const { rideId } = await rideService.requestRide(input)
      await expect(() =>
        rideService.acceptRide({ driverId: passengerAccountId, rideId })
      ).rejects.toThrow(new Error('Only drivers can accept rides'))
    })

    it("shouldn't allow a driver to accept a ride if status isn't 'requested'", async () => {
      const input = {
        passengerId: passengerAccountId,
        from: { lat: 0, long: 0 },
        to: { lat: 0, long: 0 }
      }
      const rideService = new RideService()
      const { rideId } = await rideService.requestRide(input)
      const conn = Postgres.getConnection()
      try {
        conn.query(
          "update cccat13.ride set status = 'CANCELED' where ride_id = $1",
          [rideId]
        )
      } finally {
        conn.$pool.end()
      }
      await expect(() =>
        rideService.acceptRide({ driverId: driverAccountId, rideId })
      ).rejects.toThrow(new Error('The ride is not requested'))
    })

    it("shouldn't allow a driver to accept a ride if driver already have another ride with status 'accepted' or 'in_progress'", async () => {
      const { accountId: newPassengerId } = await createAccount({
        name: 'John Doe',
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: '95818705552',
        isPassenger: true
      })
      const firstRideInput = {
        passengerId: passengerAccountId,
        from: { lat: 0, long: 0 },
        to: { lat: 0, long: 0 }
      }
      const secondRideInput = {
        passengerId: newPassengerId,
        from: { lat: 0, long: 0 },
        to: { lat: 0, long: 0 }
      }
      const rideService = new RideService()
      const { rideId: firstRideId } =
        await rideService.requestRide(firstRideInput)
      await rideService.acceptRide({
        driverId: driverAccountId,
        rideId: firstRideId
      })
      const { rideId: secondRideId } =
        await rideService.requestRide(secondRideInput)
      await expect(() =>
        rideService.acceptRide({
          driverId: driverAccountId,
          rideId: secondRideId
        })
      ).rejects.toThrow(new Error('Driver is already in another ride'))
    })
  })

  describe('startRide', () => {})

  describe('updatePosition', () => {})

  describe('finishRide', () => {})
})
