// driver
import express from 'express'
import AccountService from './AccountService'
const app = express()
app.use(express.json())

const accountService = new AccountService()

app.post('/signup', async (req, res) => {
  const result = await accountService.signup(req.body)
  res.json(result)
})

const port = 3000
app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})
