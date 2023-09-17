//driver
// TODO - mock the API
describe('API', () => {
  const baseUrl = 'http://localhost:3000'
  const passengerInput = {
    name: 'John Doe',
    email: `john.doe${Math.random()}@gmail.com`,
    cpf: '95818705552',
    isPassenger: true
  }

  it('should create passenger account', async () => {
    const response = await fetch(`${baseUrl}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(passengerInput)
    })
    const output = await response.json()
    expect(output.accountId).toBeDefined()
    const responseAccount = await fetch(
      `http://localhost:3000/accounts/${output.accountId}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    const outputAccount = await responseAccount.json()
    expect(outputAccount.account_id).toBeDefined()
    expect(outputAccount.name).toBe(passengerInput.name)
    expect(outputAccount.email).toBe(passengerInput.email)
    expect(outputAccount.cpf).toBe(passengerInput.cpf)
  })
})
