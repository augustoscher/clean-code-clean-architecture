/* eslint-disable @typescript-eslint/no-explicit-any */
// port
export default interface PositionDAO {
  save(position: any): Promise<void>
  // update(position: any): Promise<void>
  getById(positionId: string): Promise<any>
}
