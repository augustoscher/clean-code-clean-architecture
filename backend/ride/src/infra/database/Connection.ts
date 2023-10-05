/* eslint-disable @typescript-eslint/no-explicit-any */
export default interface Connection {
  query(statement: string, data?: any | undefined): Promise<any>
  close(): Promise<void>
}
