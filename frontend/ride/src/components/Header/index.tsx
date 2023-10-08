import Link from 'next/link'
import styles from './Header.module.scss'

const Header = () => {
  return (
    <nav className={styles.nav}>
      <div className={styles.navContent}>
        <div className={styles.logo}>
          <Link className={styles.link} href="/">
            <b>HOME</b>
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Header
