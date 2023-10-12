import styles from './Grid.module.scss'

export type GridProps = {
  children: React.ReactNode
}

const Grid = ({ children }: GridProps) => {
  return <div className={styles.container}>{children}</div>
}

export default Grid
