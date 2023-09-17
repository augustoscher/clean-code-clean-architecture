// driver
// adapter
import express from 'express'
import AccountService from './AccountService'
const app = express()
app.use(express.json())

// port
const accountService = new AccountService()

app.post('/signup', async (req, res) => {
  const result = await accountService.signup(req.body)
  res.json(result)
})

app.get('/accounts/:accountId', async function (req, res) {
  const output = await accountService.getAccount(req.params.accountId)
  res.json(output)
})

const port = 3000
app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
