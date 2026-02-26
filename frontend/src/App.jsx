import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import { Analytics } from "@vercel/analytics/react";

import { useEffect, useState } from "react";
import API from "./services/api";
import "react-toastify/dist/ReactToastify.css";

// Admin Components
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./components/admin/Dashboard";
import Users from "./components/admin/Users";
import ProductManager from "./components/admin/ProductManager";
import AdminOrders from "./components/admin/AdminOrders";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";

// Public Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Product from "./pages/Products";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Checkout from "./pages/Checkout";
import UserDashboard from "./pages/UserDashboard";
import Maintenance from "./MaintenancePage/Maintenance";
import About from "./pages/About";
import VerifyEmail from "./pages/VerifyEmail";

function App() {
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        await API.get("/");
        setIsMaintenance(false);
      } catch (error) {
        if (error.response?.status === 503) setIsMaintenance(true);
      } finally {
        setLoading(false);
      }
    };
    checkServerStatus();
  }, []);

  if (loading) return null;
  if (isMaintenance) return <Maintenance />;

  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} />

      <Routes>
        {/* PUBLIC ROUTES (With Navbar) */}
        <Route
          element={
            <>
              <Navbar />
              <Home />
            </>
          }
          path="/"
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/cart"
          element={
            <>
              <Navbar />
              <Cart />
            </>
          }
        />
        <Route
          path="/wishlist"
          element={
            <>
              <Navbar />
              <Wishlist />
            </>
          }
        />
        <Route
          path="/about"
          element={
            <>
              <Navbar />
              <About />
            </>
          }
        />
        <Route
          path="/product/:id"
          element={
            <>
              <Navbar />
              <Product />
            </>
          }
        />
        <Route
          path="/checkout"
          element={
            <>
              <Navbar />
              <Checkout />
            </>
          }
        />
        <Route
          path="/UserOrders"
          element={
            <>
              <Navbar />
              <UserDashboard />
            </>
          }
        />
        <Route path="/verify-email" element={<VerifyEmail />} />

        {/* ADMIN ROUTES (Protected & Responsive Layout) */}
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminLayout />
            </ProtectedAdminRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="products" element={<ProductManager />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="users" element={<Users />} />
        </Route>
      </Routes>

      <Analytics />
      
    </>
  );
}

export default App;
