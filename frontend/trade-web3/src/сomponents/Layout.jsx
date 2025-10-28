import { NavLink, Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="container">
      <header className="div">
        <nav>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "nav-link active-link" : "nav-link"
            }
          >
            <button>
              <p>Home</p>
            </button>
          </NavLink>

          <NavLink
            to="/seller"
            className={({ isActive }) =>
              isActive ? "nav-link active-link" : "nav-link"
            }
          >
            <button>
              <p>Seller</p>
            </button>
          </NavLink>

          <NavLink
            to="/customer"
            className={({ isActive }) =>
              isActive ? "nav-link active-link" : "nav-link"
            }
          >
            <button>
              <p>Customer</p>
            </button>
          </NavLink>
        </nav>
      </header>
      <Outlet />
    </div>
  );
}

export default Layout;
