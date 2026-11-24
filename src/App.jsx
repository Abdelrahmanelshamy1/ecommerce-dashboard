import Home from "./pages/Home";
import Login from "./pages/Login";
import ProductCard from "./components/ProductCard";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import { Container } from "react-bootstrap";
import { Routes, Route } from "react-router-dom";
import AppNavBar from "./components/AppNavbar";
import { Toaster } from "react-hot-toast";
import { useEffect,useState } from "react";
import { api } from "./api/api";

export default function App() {
  const [userData, setUserData] = useState(null);

  useEffect (() => {
    const token = localStorage.getItem("token");
    if (token) {
      const getUserData = async () => {
        try {
          const response = await api.get("/auth/me", { 
            headers: { Authorization: `Bearer ${token}` }
          });
          setUserData(response.data);
        } catch (error) {
          console.error("Failed to fetch user data:", error);
          localStorage.removeItem("token");
        }
      }
      getUserData();
    }
  }, []);
  return (
    <Container>
      <Toaster />
      <AppNavBar />
        <Routes>
          <Route path="/" Component={Home} />
          <Route path="/products" Component={Products} />
          <Route path="/product/:id" Component={ProductDetails} />
          <Route path="/login" Component={Login} />
        </Routes>
    </Container>
  );
}