/* eslint-disable @typescript-eslint/no-explicit-any */
import pgp from 'pg-promise'

import Connection from './Connection'

// Adapter design pattern
export default class PgPromiseAdapter implements Connection {
  connection: any

  constructor() {
    this.connection = pgp()('postgres://postgres:123456@localhost:5432/app')
  }

  query(statement: string, data?: any | undefined): Promise<any> {
    return this.connection.query(statement, data)
  }

  async close(): Promise<void> {
    await this.connection.$pool.end()
  }
}
