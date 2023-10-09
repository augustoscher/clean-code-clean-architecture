/* eslint-disable @typescript-eslint/no-explicit-any */
export default interface UseCase {
  execute(param?: any): Promise<any> | any | undefined
}
