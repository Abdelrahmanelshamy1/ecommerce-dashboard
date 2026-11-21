import Home from "./pages/Home";
import Login from "./pages/Login";
import ProductDetails from "./pages/ProductDetails";
import Products from "./pages/Products";
import { Container } from "react-bootstrap";
import { Routes, Route } from "react-router-dom";
import AppNavBar from "./components/AppNavbar";
import { Toaster } from "react-hot-toast";
import { useEffect,useState } from "react";

export default function App() {
  const [userData, setUserData] = useState(null);

  useEffect (() => {
    const token = localStorage.getItem("token");
    if (token) {
      const getUserData = async () => {
        const reponse = await fetch("https://dummyjson.com/auth/me", {
          headers: {
            "Authorization": `Bearer ${token}`,
          
          },
        });
        const data = await reponse.json();
        if (data.ok){
          console.log("User data:", data);
          setUserData(data);
        } else{
          console.log("Failed to fetch user data:", data);
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