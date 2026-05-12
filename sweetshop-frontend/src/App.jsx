import React, { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation } from "react-router-dom";

import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import AdminDashboard from "./pages/AdminDashboard";
import AdminManageSweets from "./pages/AdminManageSweets";
import AdminOrders from "./pages/AdminOrders";
import Cart from "./pages/Cart";
import Home from "./pages/Home";
import Login from "./pages/Login";
import OrderSuccess from "./pages/OrderSuccess";
import Orders from "./pages/Orders";
import Register from "./pages/Register";
import SweetDetail from "./pages/SweetDetail";
import Sweets from "./pages/Sweets";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

const isAuthenticated = () => Boolean(localStorage.getItem("token"));
const isAdmin = () => localStorage.getItem("role") === "ADMIN";

const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  if (!isAuthenticated()) return <Navigate to="/login" replace />;
  if (!isAdmin()) return <Navigate to="/" replace />;
  return children;
};

const NotFound = () => (
  <section className="empty-state container">
    <p className="eyebrow">404</p>
    <h2>Page not found</h2>
    <p className="text-muted">The page you are looking for is not available.</p>
  </section>
);

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Navbar />

      <main className="app-shell">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/sweets" element={<Sweets />} />
          <Route path="/sweet/:id" element={<SweetDetail />} />

          <Route
            path="/cart"
            element={
              <PrivateRoute>
                <Cart />
              </PrivateRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <PrivateRoute>
                <Orders />
              </PrivateRoute>
            }
          />
          <Route
            path="/order-success"
            element={
              <PrivateRoute>
                <OrderSuccess />
              </PrivateRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/sweets"
            element={
              <AdminRoute>
                <AdminManageSweets />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <AdminRoute>
                <AdminOrders />
              </AdminRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </BrowserRouter>
  );
}

export default App;
