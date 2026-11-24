import { useState, useEffect } from "react";
import { api } from "../api/api";
import ProductCard from "../components/ProductCard";
import { Row, Col, Button, Form } from "react-bootstrap";

const LIMIT = 12;

export default function Products() {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [query, setQuery] = useState("");


    const handleSearch = (e) => {
        setQuery(e.target.value);
        setPage(1);
    }

    useEffect(() => {
        const getProducts = async () => {
            try {
                setLoading(true);
                let url = "/products";
                if (query) {
                    url = "/products/search";
                }
                const response = await api.get(url, {
                    params: { limit: LIMIT, skip: (page - 1) * LIMIT, q: query }
                });
                setProducts(response.data.products);
                setTotalPages(Math.ceil(response.data.total / LIMIT));
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        }
        getProducts();
    }
    , [page, query]);

    return (
    <>
    <h1>Products</h1>
    <Form.Group>
        <Form.Label>Search Products</Form.Label>
        <Form.Control
            type="text"
            placeholder="Search products..."
            value={query}
            onChange={handleSearch}
        />
    </Form.Group>
    {loading ? (<p>Loading products...</p>) : ( <>
        {products.length === 0 ? (
            <p>No products found.</p>
        ) : (
            <p>Showing {products.length} products.</p>
        )}
        <Row>
            {products.map((product) => (
                <Col key={product.id}>
                    <ProductCard product={product} />
                </Col>
            ))}
        </Row>
        {totalPages > 1 && (
             <>
                <Button onClick={() => setPage(1)} disabled={page === 1 || page === 2}>
                    1
                </Button>
                <Button onClick={() => setPage((prev) => prev - 1)} disabled={page === 1}>
                    Previous
                </Button>
                <Button onClick={() => setPage((prev) => prev + 1)} disabled={page === totalPages}>
                    Next
                </Button>
                <Button onClick={() => setPage(totalPages)} disabled={page === totalPages || page === totalPages - 1}>
                    {totalPages}
                </Button>
                <p>Page {page} of {totalPages}</p>
             </>   
        )}
        
    </>)}
    </>
    );
}