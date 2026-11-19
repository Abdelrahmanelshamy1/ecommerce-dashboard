import Home from "./pages/Home";
import Login from "./pages/Login";
import ProductDetails from "./pages/ProductDetails";
import Products from "./pages/Products";
import { Container } from "react-bootstrap";
import { BrowserRouter, Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <Container>
      <Routes>
        <Route path="/" Component={Home} />
        <Route path="/products" Component={Products} />
        <Route path="/product/:id" Component={ProductDetails} />
        <Route path="/login" Component={Login} />
      </Routes>
    </Container>
  );
}