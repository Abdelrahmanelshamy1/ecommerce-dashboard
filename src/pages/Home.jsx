import { useEffect, useState } from "react";
import { Button, Row, Col, Spinner } from "react-bootstrap";
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
            <section className="hero">
                <h1>Welcome to Souqly</h1>
                <p className="mb-4">Browse hundreds of products</p>
                <Button as={Link} to="/products" size="lg">Shop now</Button>
            </section>

            <h2 className="section-title">Top rated products</h2>
            {loading ? (
                <div className="loading-box">
                    <Spinner animation="border" variant="primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            ) : (
                <Row className="g-4">
                    {topProducts.map((product) => (
                        <Col key={product.id} xs={12} sm={6} lg={3}>
                            <ProductCard product={product} />
                        </Col>
                    ))}
                </Row>
            )}
        </div>
    );
}