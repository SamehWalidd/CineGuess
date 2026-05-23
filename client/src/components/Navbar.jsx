import { NavLink } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="cg-navbar navbar navbar-expand-lg">
      <div className="container">
        <div className="cg-navbar__inner">
          <NavLink to="/" className="cg-navbar__brand">
            CINE<span>GUESS</span>
          </NavLink>

          <button
            className="navbar-toggler cg-navbar__toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#cg-nav-menu"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="cg-nav-menu">
            <ul className="cg-navbar__links ms-auto">
              <li>
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) =>
                    `cg-navbar__link ${isActive ? 'active' : ''}`
                  }
                >
                  🎬 Game
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/submit"
                  className={({ isActive }) =>
                    `cg-navbar__link ${isActive ? 'active' : ''}`
                  }
                >
                  ➕ Submit
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/stats"
                  className={({ isActive }) =>
                    `cg-navbar__link ${isActive ? 'active' : ''}`
                  }
                >
                  📊 Stats
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
