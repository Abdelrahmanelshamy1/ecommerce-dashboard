import Home from "./pages/Home";
import Login from "./pages/Login";
import ProductDetails from "./pages/ProductDetails";
import Products from "./pages/Products";
import { Container } from "react-bootstrap";
import { Routes, Route } from "react-router-dom";
import AppNavBar from "./components/AppNavbar";
import { Toaster } from "react-hot-toast";

export default function App() {
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