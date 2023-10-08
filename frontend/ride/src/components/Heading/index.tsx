import styles from './Heading.module.scss'
import classNames from 'classnames/bind'

export type HeadingProps = {
  children: React.ReactNode
  size?: 'small' | 'medium'
}

const cx = classNames.bind(styles)

const Heading = ({ children, size = 'small' }: HeadingProps) => (
  <h2
    className={cx('heading', {
      headingMedium: size === 'medium'
    })}
  >
    {children}
  </h2>
)

export default Heading
