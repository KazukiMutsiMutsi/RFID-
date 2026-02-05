import Link from "next/link";
import styles from "./Header.module.css";

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <Link href="/">School RFID</Link>
        </div>

        <nav aria-label="Main navigation" className={styles.nav}>
          <ul>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/#about">About</Link>
            </li>
            <li>
              <a href="#login" className={styles.signIn}>
                Sign in
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
