import AccountService from '../services/AccountService'
import RideService, { RideStatus } from '../services/RideService'
import Postgres from '../database/postgres'

describe('RideService', () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const createAccount = async (input: any) => {
    const accountService = new AccountService()
    return accountService.signup(input)
  }

  let passengerAccountId: string
  let driverAccountId: string

  const getPassengerInput = (passengerId: string) => ({
    passengerId,
    from: { lat: 0, long: 0 },
    to: { lat: 0, long: 0 }
  })

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
      const input = getPassengerInput(passengerAccountId)
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
      const input = getPassengerInput(passengerAccountId)
      const rideService = new RideService()
      await rideService.requestRide(input)
      await expect(() => rideService.requestRide(input)).rejects.toThrow(
        new Error('This passenger already has an active ride')
      )
    })

    test('should set status as "requested"', async () => {
      const input = getPassengerInput(passengerAccountId)
      const rideService = new RideService()
      const output = await rideService.requestRide(input)
      const ride = await rideService.getRide(output.rideId)
      expect(ride.status).toBe('REQUESTED')
    })
  })

  describe('acceptRide', () => {
    it('should allow a driver to accept a ride', async () => {
      const input = getPassengerInput(passengerAccountId)
      const rideService = new RideService()
      const { rideId } = await rideService.requestRide(input)
      await rideService.acceptRide({ driverId: driverAccountId, rideId })
      const ride = await rideService.getRide(rideId)
      expect(ride.status).toBe('ACCEPTED')
      expect(ride.driver_id).toBe(driverAccountId)
    })

    it("shouldn't allow passenger to accept a ride", async () => {
      const input = getPassengerInput(passengerAccountId)
      const rideService = new RideService()
      const { rideId } = await rideService.requestRide(input)
      await expect(() =>
        rideService.acceptRide({ driverId: passengerAccountId, rideId })
      ).rejects.toThrow(new Error('Only drivers can accept rides'))
    })

    it("shouldn't allow a driver to accept a ride if status isn't 'requested'", async () => {
      const input = getPassengerInput(passengerAccountId)
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
      const firstRideInput = getPassengerInput(passengerAccountId)
      const secondRideInput = getPassengerInput(newPassengerId)
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

  describe('startRide', () => {
    test('should allow a driver to start a ride when status is accepted', async () => {
      const input = getPassengerInput(passengerAccountId)
      const rideService = new RideService()
      const { rideId } = await rideService.requestRide(input)
      await rideService.acceptRide({ driverId: driverAccountId, rideId })
      await rideService.startRide(rideId)
      const ride = await rideService.getRide(rideId)
      expect(ride.status).toBe(RideStatus.InProgress)
    })

    test("shouldn't allow a driver to start a ride when status is different the accepted", async () => {
      const input = getPassengerInput(passengerAccountId)
      const rideService = new RideService()
      const { rideId } = await rideService.requestRide(input)
      await expect(() => rideService.startRide(rideId)).rejects.toThrow(
        new Error('The ride is not accepted')
      )
    })

    test("shouldn't allow a driver to start a ride when ride doesn't exist", async () => {
      const rideService = new RideService()
      await expect(() =>
        rideService.startRide(crypto.randomUUID())
      ).rejects.toThrow(new Error('Ride not found'))
    })
  })

  describe('updatePosition', () => {
    test('should update position when ride is in progress', async () => {
      const input = getPassengerInput(passengerAccountId)
      const rideService = new RideService()
      const { rideId } = await rideService.requestRide(input)
      await rideService.acceptRide({ driverId: driverAccountId, rideId })
      await rideService.startRide(rideId)
      const positionInput = {
        rideId,
        lat: -26.913061443489774,
        long: -49.080980464673274
      }
      await rideService.updatePosition(positionInput)
      const positions = await rideService.getRidePositions(rideId)
      expect(positions.length).toBe(1)
      expect(positions[0]?.position_id).toBeDefined()
      expect(positions[0]?.lat).toBe(positionInput.lat)
      expect(positions[0]?.long).toBe(positionInput.long)
    })

    test("shouldn't update position when ride is not in progress", async () => {
      const input = getPassengerInput(passengerAccountId)
      const rideService = new RideService()
      const { rideId } = await rideService.requestRide(input)
      await await expect(() =>
        rideService.updatePosition({
          rideId,
          lat: -26.913061443489774,
          long: -49.080980464673274
        })
      ).rejects.toThrow(new Error('The ride is not in progress'))
    })

    test("shouldn't update position when ride doesn't exist", async () => {
      const rideService = new RideService()
      await await expect(() =>
        rideService.updatePosition({
          rideId: crypto.randomUUID(),
          lat: -26.913061443489774,
          long: -49.080980464673274
        })
      ).rejects.toThrow(new Error('Ride not found'))
    })
  })

  describe('finishRide', () => {
    test("shouldn't allow finish ride when ride doesn't exists", async () => {
      const rideService = new RideService()
      await await expect(() =>
        rideService.finishRide(crypto.randomUUID())
      ).rejects.toThrow(new Error('Ride not found'))
    })

    test("shouldn't allow finish ride when ride is not in progress", async () => {
      const input = getPassengerInput(passengerAccountId)
      const rideService = new RideService()
      const { rideId } = await rideService.requestRide(input)
      await expect(() => rideService.finishRide(rideId)).rejects.toThrow(
        new Error('The ride is not in progress')
      )
    })

    test('should calculate distance in km', async () => {})

    test('should calculate fare', async () => {})

    test('should finish ride and update status, distance and fare', async () => {})
    // Deve obter todas as positions e calcular a distância entre cada uma delas, para isso utilize um algoritmo que receba duas coordenadas (lat, long) e retorne a distância entre elas em km.
    // Com a distância total calculada, calcule o valor da corrida (fare) multiplicando a distância por 2,1
    // Atualizar a corrida com o status "completed", a distância e o valor da corrida (fare)
  })
})
