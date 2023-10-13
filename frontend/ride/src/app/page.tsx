import Grid from 'components/Grid'
import Heading from 'components/Heading'
import Link from 'next/link'
import styles from './page.module.scss'

type BoxProps = {
  children: React.ReactNode
}
const Box = ({ children }: BoxProps) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '200px',
      border: '1px solid #dbdbdb'
    }}
  >
    {children}
  </div>
)

export default function Index() {
  return (
    <>
      <Heading size="medium">Home Page</Heading>
      <div className={styles.content}>
        <Grid>
          <Box>
            <Link href={{ pathname: 'signup' }}>Signup</Link>
          </Box>
          <Box>
            <Link href={{ pathname: 'passenger/ride' }}>Request Ride</Link>
          </Box>
          <Box>
            <Link href={{ pathname: 'driver/ride' }}>Accept Ride</Link>
          </Box>
          <Box>
            <Link href={{ pathname: 'rides' }}>Rides list</Link>
          </Box>
        </Grid>
      </div>
    </>
  )
}
