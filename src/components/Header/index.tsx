import router from 'next/router';
import styles from './header.module.scss';

export default function Header() {
  const redirectToHome = () => {
    router.push('/')
  }

  return(
    <div onClick={redirectToHome} className={styles.header}>
      <img src="/images/logo.svg" alt="logo" />
    </div>
  )
}
