import './styles.css'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <p className="site-footer__copy">© {currentYear} Mi Primer Reactor</p>
        <ul className="site-footer__links">
          <li><a href="#">Privacidad</a></li>
          <li><a href="#">Términos</a></li>
          <li><a href="#">Soporte</a></li>
        </ul>
      </div>
    </footer>
  )
}
