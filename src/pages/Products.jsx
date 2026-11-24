import { useState, useEffect } from "react";
import { api } from "../api/api";
import ProductCard from "../components/ProductCard";
import { Row, Col } from "react-bootstrap";

export default function Products() {

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await api.get("/products");
        setProducts(response.data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    }
    getProducts();
  }
  , []);

  return (
    <>
      <h1>Products</h1>
      {loading ? (<p>Loading products...</p>) : (
        <Row>
          {products.map((product) => (
            <Col key={product.id}>
              <ProductCard product={product} />
            </Col>
          ))}
        </Row>
      )}    
    </>

  );
}