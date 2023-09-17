//driver
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
  })
})
