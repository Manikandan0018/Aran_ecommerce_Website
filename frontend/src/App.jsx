import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

import { useEffect, useState, lazy, Suspense } from "react";
import API from "./services/api";
import "react-toastify/dist/ReactToastify.css";

import FullScreenLoader from "./components/FullScreenLoader";
import Navbar from "./components/Navbar";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";

/* =============================
   LAZY LOAD PAGES
============================= */

const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Home = lazy(() => import("./pages/Home"));
const Product = lazy(() => import("./pages/Products"));
const Cart = lazy(() => import("./pages/Cart"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const Checkout = lazy(() => import("./pages/Checkout"));
const UserDashboard = lazy(() => import("./pages/UserDashboard"));
const Maintenance = lazy(() => import("./MaintenancePage/Maintenance"));
const About = lazy(() => import("./pages/About"));
const VerifyEmail = lazy(() => import("./pages/VerifyEmail"));

/* Admin Lazy */
const AdminLayout = lazy(() => import("./components/admin/AdminLayout"));
const Dashboard = lazy(() => import("./components/admin/Dashboard"));
const Users = lazy(() => import("./components/admin/Users"));
const ProductManager = lazy(() => import("./components/admin/ProductManager"));
const AdminOrders = lazy(() => import("./components/admin/AdminOrders"));

function App() {
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [loading, setLoading] = useState(true);

  /* =============================
     SERVER HEALTH CHECK
  ============================= */
  useEffect(() => {
    const checkServerStatus = async () => {
      try {
        await fetch(import.meta.env.VITE_API_URL);
        setIsMaintenance(false);
      } catch (error) {
        setIsMaintenance(false);
      } finally {
        setLoading(false);
      }
    };

    checkServerStatus();
  }, []);

  if (loading) return <FullScreenLoader />;
  if (isMaintenance) return <Maintenance />;

  return (
    <>
      <ToastContainer position="top-right" autoClose={2000} />

      {/* Suspense handles lazy loading */}
      <Suspense fallback={<FullScreenLoader />}>
        <Routes>
          {/* PUBLIC ROUTES */}
          <Route
            path="/"
            element={
              <>
                <Navbar />
                <Home />
              </>
            }
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

          {/* ADMIN ROUTES */}
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
      </Suspense>

      <Analytics />
      <SpeedInsights />
    </>
  );
}

export default App;
