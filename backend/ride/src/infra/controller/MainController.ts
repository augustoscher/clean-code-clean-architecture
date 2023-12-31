/* eslint-disable @typescript-eslint/no-explicit-any */
import GetAccount from '../../application/usecase/GetAccount'
import HttpServer from '../http/HttpServer'
import Signup from '../../application/usecase/Signup'
import GetRide from '../../application/usecase/GetRide'
import ListRides from '../../application/usecase/ListRides'
import ListDetailedRides from '../../application/usecase/ListDetailedRides'
import ListAccounts from '../../application/usecase/ListAccounts'

// interface adapter
export default class MainController {
  constructor(
    readonly httpServer: HttpServer,
    signup: Signup,
    getAccount: GetAccount,
    listAccounts: ListAccounts,
    getRide: GetRide,
    listRides: ListRides,
    listDetailedRides: ListDetailedRides
  ) {
    httpServer.on('post', '/signup', async function (params: any, body: any) {
      try {
        const output = await signup.execute(body)
        return {
          ...output,
          status: 'ok'
        }
      } catch (error) {
        console.log(error)
        return {
          status: 'error'
        }
      }
    })

    httpServer.on('get', '/accounts', function () {
      return listAccounts.execute()
    })

    httpServer.on('get', '/accounts/:accountId', async function (params: any) {
      const output = await getAccount.execute(params.accountId)
      return output
    })

    httpServer.on('get', '/rides', async function () {
      const output = await listRides.execute()
      return output
    })

    httpServer.on('get', '/rides/detail', function () {
      return listDetailedRides.execute()
    })

    httpServer.on('get', '/rides/:rideId', async function (params: any) {
      const output = await getRide.execute(params.rideId)
      return output
    })
  }
}
