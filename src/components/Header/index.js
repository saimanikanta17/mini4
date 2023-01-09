import {Link, withRouter} from 'react-router-dom'

import './index.css'

const Header = () => (
  <nav className={`nav-bar ${'display-flex'}`}>
    <Link to="/" className="link-style">
      <h1 className="logo">
        COVID19<span className="span-logo">INDIA</span>
      </h1>
    </Link>
    <ul className={`nav-links-container ${'display-flex'}`}>
      <Link to="/" className="link-style">
        <li>Home</li>
      </Link>
      <Link to="/about" className="link-style">
        <li>About</li>
      </Link>
    </ul>
  </nav>
)

export default withRouter(Header)
