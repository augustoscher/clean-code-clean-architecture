/* eslint-disable @typescript-eslint/no-explicit-any */
import HttpClient from 'application/http/client'

export default class FetchAdapter implements HttpClient {
  baseUrl: string

  constructor() {
    this.baseUrl = process.env.BASE_URL || 'http://localhost:3000'
  }

  async request(
    method: string,
    url: string,
    body?: any,
    searchParams?: URLSearchParams
  ): Promise<any> {
    const requestUrl = new URL(`${this.baseUrl}${url}`)
    if (searchParams) requestUrl.search = searchParams.toString()
    const response = await fetch(requestUrl, {
      method,
      headers: {
        'content-type': 'application/json;charset=UTF-8'
      },
      body: body ? JSON.stringify(body) : undefined
    })
    if (!response.ok) {
      return Promise.reject(new Error('Request failed'))
    }
    const data = await response.json()
    return data
  }
}
