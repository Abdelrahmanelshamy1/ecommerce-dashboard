import { useEffect, useState } from "react";
import { Button, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { api } from "../api/api";
import ProductCard from "../components/ProductCard";

export default function Home() {
    const [topProducts, setTopProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getTopProducts = async () => {
            try {
                const response = await api.get("/products", {
                    params: { limit: 4, sortBy: "rating", order: "desc" }
                });
                setTopProducts(response.data.products);
            } catch (error) {
                console.error("Error fetching top products:", error);
            } finally {
                setLoading(false);
            }
        };
        getTopProducts();
    }, []);

    return (
        <div>
            <h1>Welcome to our E-commerce Store</h1>
            <p>Browse hundreds of products</p>
            <Button as={Link} to="/products">Shop now</Button>

            <h2>Top rated products</h2>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <Row>
                    {topProducts.map((product) => (
                        <Col key={product.id}>
                            <ProductCard product={product} />
                        </Col>
                    ))}
                </Row>
            )}
        </div>
    );
}