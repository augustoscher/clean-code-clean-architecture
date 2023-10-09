/* eslint-disable @typescript-eslint/no-explicit-any */
// port
export default interface HttpClient {
  request(
    method: string,
    url: string,
    body?: any,
    searchParams?: URLSearchParams
  ): Promise<any>
}
