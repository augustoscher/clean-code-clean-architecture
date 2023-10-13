/* eslint-disable @typescript-eslint/no-explicit-any */
export default class OperationResult {
  constructor(readonly isSuccess: boolean, readonly error?: any) {}

  static success() {
    return new OperationResult(true)
  }

  static fail(error: any) {
    return new OperationResult(false, error)
  }
}
