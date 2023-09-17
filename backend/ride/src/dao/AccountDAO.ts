/* eslint-disable @typescript-eslint/no-explicit-any */

// port
export default interface AccountDAO {
  save(input: any): Promise<void>
  getByEmail(email: string): Promise<any>
  getById(accountId: string): Promise<any>
}
