import './styles.css'

export function Header() {
  return (
    <header className="site-header">
      <nav className="site-nav">
        <div className ="brand">
          <a href='#' className='brand-link'>
            <span className='brand-logo'>R</span>
            <span className='brand-text'>Mi Primer Reactor </span>
          </a>
          </div>

          <ul className="site-menu">
            <li><a href="#">Mi primer Reactor</a></li>
            <li><a href="#">Contacto</a></li>
            <li><a href="#">Referencia</a></li>
          </ul>

        <div className="actions">
          <a href="#" className="btn-primary">Comenzar</a>
        </div>

      </nav>
    </header>
  )
}
