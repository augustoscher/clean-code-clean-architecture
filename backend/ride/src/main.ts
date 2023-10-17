import PgPromiseAdapter from './infra/database/PgPromiseAdapter'
import AccountDAODatabase from './infra/repository/AccountDAODatabase'
import RideDAODatabase from './infra/repository/RideDAODatabase'
import ExpressAdapter from './infra/http/ExpressAdapter'
import MainController from './infra/controller/MainController'
import Signup from './application/usecase/Signup'
import GetAccount from './application/usecase/GetAccount'
import GetRide from './application/usecase/GetRide'
import ListRides from './application/usecase/ListRides'
import ListDetailedRides from './application/usecase/ListDetailedRides'
import ListAccounts from './application/usecase/ListAccounts'

// Composition root pattern. Dependency injection. Knows all dependencies and injects them
const connection = new PgPromiseAdapter()
const accountDAO = new AccountDAODatabase(connection)
const rideDAO = new RideDAODatabase(connection)
const signup = new Signup(accountDAO)
const getAccount = new GetAccount(accountDAO)
const listAccounts = new ListAccounts(accountDAO)
const getRide = new GetRide(rideDAO)
const listRides = new ListRides(rideDAO)
const listDetailedRides = new ListDetailedRides(rideDAO, accountDAO)
const httpServer = new ExpressAdapter()
new MainController(
  httpServer,
  signup,
  getAccount,
  listAccounts,
  getRide,
  listRides,
  listDetailedRides
)
httpServer.listen(3000)
