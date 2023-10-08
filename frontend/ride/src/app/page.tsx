import Heading from 'components/Heading'
import Link from 'next/link'

export default function Index() {
  return (
    <>
      <Heading size="medium">Home Page</Heading>
      <p>
        <Link href={{ pathname: 'account' }}>Create Account</Link>
      </p>
      <p>
        <Link href={{ pathname: 'passenger/ride' }}>Request Ride</Link>
      </p>
      <p>
        <Link href={{ pathname: 'driver/ride' }}>Accept Ride</Link>
      </p>
      <p>
        <Link href={{ pathname: 'rides' }}>Check All Rides</Link>
      </p>
    </>
  )
}
