import styles from './header.module.scss';

export default function Header() {
  return(
    <div className={styles.header}>
      <img src="/images/logo.svg" alt="logo" />
    </div>
  )
}
