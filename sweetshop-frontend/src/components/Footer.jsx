import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <h2>SweetShop</h2>
            <p>Fresh traditional Indian sweets, curated boxes and simple online checkout.</p>
          </div>

          <div>
            <h3>Shop</h3>
            <Link to="/sweets">All Sweets</Link>
            <Link to="/cart">Cart</Link>
            <Link to="/orders">Orders</Link>
          </div>

          <div>
            <h3>Support</h3>
            <p>India delivery</p>
            <p>support@sweetshop.com</p>
            <p>+91 90000 00000</p>
          </div>

          <div>
            <h3>Promise</h3>
            <p>Fresh batches, secure packaging, transparent totals and easy payment options.</p>
          </div>
        </div>
        <div className="footer-bottom">Copyright 2026 SweetShop. Full stack shopping app.</div>
      </div>
    </footer>
  );
}

export default Footer;
