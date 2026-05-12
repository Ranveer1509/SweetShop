import { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { CartContext } from "../context/cartContextValue";

function Navbar() {
  const { cartCount, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const isLoggedIn = Boolean(token);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    clearCart?.(false);
    navigate("/login");
  };

  const isActive = (path) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark sticky-top">
      <div className="container">
        <Link className="navbar-brand" to="/">
          SweetShop
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className={`nav-link ${isActive("/") ? "active" : ""}`} to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive("/sweets") ? "active" : ""}`} to="/sweets">
                Shop
              </Link>
            </li>
            {isLoggedIn && (
              <li className="nav-item">
                <Link className={`nav-link ${isActive("/orders") ? "active" : ""}`} to="/orders">
                  Orders
                </Link>
              </li>
            )}
            {role === "ADMIN" && (
              <li className="nav-item">
                <Link className={`nav-link ${isActive("/admin") ? "active" : ""}`} to="/admin">
                  Admin
                </Link>
              </li>
            )}
          </ul>

          <ul className="navbar-nav align-items-lg-center gap-lg-2">
            {isLoggedIn && (
              <li className="nav-item">
                <Link className="btn btn-cart" to="/cart">
                  Cart
                  {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
                </Link>
              </li>
            )}

            {!isLoggedIn ? (
              <>
                <li className="nav-item">
                  <Link className="btn btn-outline-light" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-warning" to="/register">
                    Register
                  </Link>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <button className="btn btn-outline-light" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
