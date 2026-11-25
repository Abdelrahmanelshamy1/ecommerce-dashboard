import Home from "./pages/Home";
import Login from "./pages/Login";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import { Container } from "react-bootstrap";
import { Routes, Route } from "react-router-dom";
import AppNavBar from "./components/AppNavbar";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import { api } from "./api/api";
import { useDispatch } from "react-redux";
import { setUser } from "./store/slices/authSlice";
import ProtectedRoute from "./components/ProtectedRoute";
import Cart from "./pages/Cart";

export default function App() {
  const dispatch = useDispatch();

  useEffect (() => {
    const token = localStorage.getItem("token");
    if (token) {
      const getUserData = async () => {
        try {
          const response = await api.get("/auth/me", { 
            headers: { Authorization: `Bearer ${token}` }
          });
          dispatch(setUser(response.data));
        } catch (error) {
          console.error("Failed to fetch user data:", error);
          localStorage.removeItem("token");
        }
      }
      getUserData();
    }
  }, [dispatch]);
  return (
    <Container>
      <Toaster />
      <AppNavBar />
        <Routes>
          <Route path="/" Component={Home} />
          <Route path="/products" Component={Products} />
          <Route path="/product/:id" Component={ProductDetails} />
          <Route path="/login" Component={Login} />
          <Route path="/cart" Component={() => (
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          )} />
        </Routes>
    </Container>
  );
}