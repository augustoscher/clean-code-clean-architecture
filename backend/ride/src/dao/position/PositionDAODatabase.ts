import PositionDAO from './PositionDAO'

export default class PositionDAODatabase implements PositionDAO {
  constructor() {}

  save(position: any): Promise<void> {
    throw new Error('Method not implemented.')
  }
  update(position: any): Promise<void> {
    throw new Error('Method not implemented.')
  }
  getById(positionId: string): Promise<any> {
    throw new Error('Method not implemented.')
  }
}
