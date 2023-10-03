// driver
// adapter
import express from 'express'
import Signup from './application/usecase/Signup'
import GetAccount from './application/usecase/GetAccount'
const app = express()
app.use(express.json())

// port
app.post('/signup', async (req, res) => {
  const signup = new Signup()
  const result = await signup.execute(req.body)
  res.json(result)
})

app.get('/accounts/:accountId', async function (req, res) {
  const getAccount = new GetAccount()
  const output = await getAccount.execute(req.params.accountId)
  res.json(output)
})

const port = 3000
app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
