import Coordinate from './Coordinate'

export default interface DistanceCalculator {
  calculate(from: Coordinate, to: Coordinate): number
}
