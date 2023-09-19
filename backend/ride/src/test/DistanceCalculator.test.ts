import DistanceCalculator from '../distance/DistanceCalculatorStraightLine'

describe('DistanceCalculatorStraightLine', () => {
  test.each([
    {
      from: { lat: 0, long: 0 },
      to: { lat: 0, long: 1 },
      expectedDistance: 111.1895769599889
    },
    {
      from: { lat: -26.91448020906993, long: -49.09012857447635 },
      to: { lat: -26.920592021792398, long: -49.06919226098154 },
      expectedDistance: 2.1841053339182332
    },
    {
      from: { lat: -26.91448020906993, long: -49.09012857447635 }, //bnu
      to: { lat: -28.117481138039185, long: -54.83625057524163 }, //sal
      expectedDistance: 582.1429498711539
    }
  ])('should calculate the distance in a straight line (km)', data => {
    const { from, to, expectedDistance } = data
    const distance = new DistanceCalculator().calculate(from, to)
    expect(distance).toBe(expectedDistance)
  })
})
