import RideService from '../../services/RideService'
import Postgres from '../../database/postgres'
import RideStatus from '../../domain/RideStatus'
import RequestRide from '../../application/usecase/RequestRide'
import AcceptRide from '../../application/usecase/AcceptRide'
import GetRide from '../../application/usecase/GetRide'
import StartRide from '../../application/usecase/StartRide'
import Signup from '../../application/usecase/Signup'
import AccountBuilder from './AccountBuilder'
import PgPromiseAdapter from '../../infra/database/PgPromiseAdapter'
import AccountDAODatabase from '../../infra/repository/AccountDAODatabase'
import RideDAODatabase from '../../infra/repository/RideDAODatabase'
import UpdatePosition from '../../application/usecase/UpdatePosition'
import PositionDAODatabase from '../../infra/repository/PositionDAODatabase'

describe('RideService', () => {
  let connection: PgPromiseAdapter
  let accountDAO: AccountDAODatabase
  let rideDAO: RideDAODatabase
  let positionDAO: PositionDAODatabase
  let requestRide: RequestRide
  let acceptRide: AcceptRide
  let getRide: GetRide
  let startRide: StartRide
  let signup: Signup
  let updatePosition: UpdatePosition
  let passengerAccountId: string
  let driverAccountId: string

  const getPassengerInput = (passengerId: string) => ({
    passengerId,
    from: { lat: 0, long: 0 },
    to: { lat: 0, long: 0 }
  })

  beforeEach(async () => {
    connection = new PgPromiseAdapter()
    await connection.query('delete from cccat13.ride')

    accountDAO = new AccountDAODatabase(connection)
    rideDAO = new RideDAODatabase(connection)
    positionDAO = new PositionDAODatabase(connection)
    requestRide = new RequestRide(rideDAO, accountDAO)
    acceptRide = new AcceptRide(rideDAO, accountDAO)
    getRide = new GetRide(rideDAO)
    startRide = new StartRide(rideDAO)
    signup = new Signup(accountDAO)
    updatePosition = new UpdatePosition(rideDAO, positionDAO)

    const { accountId: passengerId } = await signup.execute(
      AccountBuilder.anAccount().asPassenger().build()
    )
    const { accountId: driverId } = await signup.execute(
      AccountBuilder.anAccount().asDriver().build()
    )
    passengerAccountId = passengerId
    driverAccountId = driverId
  })

  afterEach(async function () {
    await connection.close()
  })

  describe('requestRide', () => {
    test('should allow a passenger to request ride', async () => {
      const input = getPassengerInput(passengerAccountId)
      const output = await requestRide.execute(input)
      expect(output.rideId).toBeDefined()
    })

    test("shouldn't allow not a passenger to request ride", async () => {
      const input = {
        passengerId: driverAccountId,
        from: { lat: 0, long: 0 },
        to: { lat: 0, long: 0 }
      }
      await expect(() => requestRide.execute(input)).rejects.toThrow(
        new Error('Account is not from a passenger')
      )
    })

    test("shouldn't allow request new ride if passenger already have an uncompleted ride", async () => {
      const input = getPassengerInput(passengerAccountId)
      await requestRide.execute(input)
      await expect(() => requestRide.execute(input)).rejects.toThrow(
        new Error('This passenger already has an active ride')
      )
    })

    test('should set status as "requested"', async () => {
      const input = getPassengerInput(passengerAccountId)
      const output = await requestRide.execute(input)
      const ride = await getRide.execute(output.rideId)
      expect(ride?.getStatus()).toBe(RideStatus.Requested)
    })
  })

  describe('acceptRide', () => {
    it('should allow a driver to accept a ride', async () => {
      const input = getPassengerInput(passengerAccountId)
      const { rideId } = await requestRide.execute(input)
      await acceptRide.execute({ driverId: driverAccountId, rideId })
      const ride = await getRide.execute(rideId)
      expect(ride?.getStatus()).toBe('ACCEPTED')
      expect(ride?.driverId).toBe(driverAccountId)
    })

    it("shouldn't allow passenger to accept a ride", async () => {
      const input = getPassengerInput(passengerAccountId)
      const { rideId } = await requestRide.execute(input)
      await expect(() =>
        acceptRide.execute({ driverId: passengerAccountId, rideId })
      ).rejects.toThrow(new Error('Only drivers can accept rides'))
    })

    it("shouldn't allow a driver to accept a ride if status isn't 'requested'", async () => {
      const input = getPassengerInput(passengerAccountId)
      const { rideId } = await requestRide.execute(input)
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
        acceptRide.execute({ driverId: driverAccountId, rideId })
      ).rejects.toThrow(new Error('The ride is not requested'))
    })

    it("shouldn't allow a driver to accept a ride if driver already have another ride with status 'accepted' or 'in_progress'", async () => {
      const { accountId: newPassengerId } = await signup.execute({
        name: 'John Doe',
        email: `john.doe${Math.random()}@gmail.com`,
        cpf: '95818705552',
        isPassenger: true,
        isDriver: false,
        carPlate: ''
      })
      const firstRideInput = getPassengerInput(passengerAccountId)
      const secondRideInput = getPassengerInput(newPassengerId)
      const { rideId: firstRideId } = await requestRide.execute(firstRideInput)
      await acceptRide.execute({
        driverId: driverAccountId,
        rideId: firstRideId
      })
      const { rideId: secondRideId } =
        await requestRide.execute(secondRideInput)
      await expect(() =>
        acceptRide.execute({
          driverId: driverAccountId,
          rideId: secondRideId
        })
      ).rejects.toThrow(new Error('Driver is already in another ride'))
    })
  })

  describe('startRide', () => {
    test('should allow a driver to start a ride when status is accepted', async () => {
      const input = getPassengerInput(passengerAccountId)
      const { rideId } = await requestRide.execute(input)
      await acceptRide.execute({ driverId: driverAccountId, rideId })
      await startRide.execute(rideId)
      const ride = await getRide.execute(rideId)
      expect(ride?.getStatus()).toBe(RideStatus.InProgress)
    })

    test("shouldn't allow a driver to start a ride when status is different the accepted", async () => {
      const input = getPassengerInput(passengerAccountId)
      const { rideId } = await requestRide.execute(input)
      await expect(() => startRide.execute(rideId)).rejects.toThrow(
        new Error('The ride is not accepted')
      )
    })

    test.skip("shouldn't allow a driver to start a ride when ride doesn't exist", async () => {
      await expect(() =>
        startRide.execute(crypto.randomUUID())
      ).rejects.toThrow(new Error('Ride not found'))
    })
  })

  describe('updatePosition', () => {
    test('should update position when ride is in progress', async () => {
      const input = getPassengerInput(passengerAccountId)
      // const rideService = new RideService()
      const { rideId } = await requestRide.execute(input)
      await acceptRide.execute({ driverId: driverAccountId, rideId })
      await startRide.execute(rideId)
      const positionInput = {
        rideId,
        lat: -26.913061443489774,
        long: -49.080980464673274
      }
      await updatePosition.execute(positionInput)
      const positions = await rideService.getRidePositions(rideId)
      expect(positions.length).toBe(1)
      expect(positions[0]?.position_id).toBeDefined()
      expect(positions[0]?.lat).toBe(positionInput.lat)
      expect(positions[0]?.long).toBe(positionInput.long)
    })

    test("shouldn't update position when ride is not in progress", async () => {
      const input = getPassengerInput(passengerAccountId)
      const { rideId } = await requestRide.execute(input)
      await await expect(() =>
        updatePosition.execute({
          rideId,
          lat: -26.913061443489774,
          long: -49.080980464673274
        })
      ).rejects.toThrow(new Error('The ride is not in progress'))
    })

    test.skip("shouldn't update position when ride doesn't exist", async () => {
      await await expect(() =>
        updatePosition.execute({
          rideId: crypto.randomUUID(),
          lat: -26.913061443489774,
          long: -49.080980464673274
        })
      ).rejects.toThrow(new Error('Ride not found'))
    })
  })

  describe('finishRide', () => {
    test.skip("shouldn't allow finish ride when ride doesn't exists", async () => {
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

    test('should finish ride and update status, distance and fare', async () => {
      const input = getPassengerInput(passengerAccountId)
      const rideService = new RideService()
      const { rideId } = await rideService.requestRide(input)
      await rideService.acceptRide({ driverId: driverAccountId, rideId })
      await rideService.startRide(rideId)
      await rideService.updatePosition({
        rideId,
        lat: -26.91448020906993,
        long: -49.09012857447635
      })
      await rideService.updatePosition({
        rideId,
        lat: -28.117481138039185,
        long: -54.83625057524163
      })
      await rideService.finishRide(rideId)
      const ride = await rideService.getRide(rideId)
      expect(ride?.getStatus()).toBe(RideStatus.Completed)
      expect(ride?.distance).toBe(582.1429498711539)
      expect(ride?.fare).toBe(1222.5001947294231)
    })

    test('should finish ride with many positions', async () => {
      const input = getPassengerInput(passengerAccountId)
      const rideService = new RideService()
      const { rideId } = await rideService.requestRide(input)
      await rideService.acceptRide({ driverId: driverAccountId, rideId })
      await rideService.startRide(rideId)
      await rideService.updatePosition({
        rideId,
        lat: -26.91448020906993,
        long: -49.09012857447635
      })
      await rideService.updatePosition({
        rideId,
        lat: -26.920592021792398,
        long: -49.06919226098154
      })
      await rideService.updatePosition({
        rideId,
        lat: -28.117481138039185,
        long: -54.83625057524163
      })
      await rideService.finishRide(rideId)
      const ride = await rideService.getRide(rideId)
      expect(ride?.getStatus()).toBe(RideStatus.Completed)
      expect(ride?.distance).toBe(586.165527079648)
      expect(ride?.fare).toBe(1230.947606867261)
    })
  })
})
