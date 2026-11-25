import { useState, useEffect } from "react";
import { api } from "../api/api";
import ProductCard from "../components/ProductCard";
import { Row, Col, Button, Form, Spinner } from "react-bootstrap";

const LIMIT = 12;

export default function Products() {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [query, setQuery] = useState("");
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState("");
    const [sortBy, setSortBy] = useState("title");
    const [order, setOrder] = useState("asc");


    const handleSearch = (e) => {
        setQuery(e.target.value);
        setPage(1);
        setCategory("");
    }

    useEffect(() => {
        const getProducts = async () => {
            try {
                setLoading(true);
                let url = "/products";
                if (query) {
                    url = "/products/search";
                } else if (category) {
                    url = `/products/category/${category}`;
                }
                const response = await api.get(url, {
                    params: { limit: LIMIT, skip: (page - 1) * LIMIT, q: query, sortBy, order }
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
    , [page, query, sortBy, order, category]);

    useEffect(() => {
        const getCategories = async () => {
            try {
                const response = await api.get("/products/category-list");
                setCategories(response.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        }
        getCategories();
    }, []);

    return (
    <>
    <h1 className="page-title">Products</h1>
    <div className="filter-bar souq-surface">
    <Row className="g-3 align-items-end">
    <Col xs={12} sm={6} lg={3}>
    <Form.Select aria-label="Category" value={category} onChange={(e) => {
        setCategory(e.target.value);
        setPage(1);
        setQuery("");
    }}>
        <option value="">All categories</option>
        {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
        ))}
    </Form.Select>
    </Col>
    <Col xs={6} sm={3} lg={2}>
    <Form.Select aria-label="Sort by" value={sortBy} onChange={(e) => {
        setSortBy(e.target.value);
        setPage(1);
    }}>
        <option value="title">Sort by Title</option>
        <option value="price">Sort by Price</option>
        <option value="rating">Sort by Rating</option>
    </Form.Select>
    </Col>
    <Col xs={6} sm={3} lg={2}>
    <Form.Select aria-label="Order" value={order} onChange={(e) => {
        setOrder(e.target.value);
        setPage(1);
    }}>
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
    </Form.Select>
    </Col>
    <Col xs={12} lg={5}>
    <Form.Group controlId="product-search">
        <Form.Label className="mb-1">Search Products</Form.Label>
        <Form.Control
            type="text"
            placeholder="Search products..."
            value={query}
            onChange={handleSearch}
        />
    </Form.Group>
    </Col>
    </Row>
    </div>
    {loading ? (
        <div className="loading-box">
            <Spinner animation="border" variant="primary" role="status">
                <span className="visually-hidden">Loading products...</span>
            </Spinner>
        </div>
    ) : ( <>
        {products.length === 0 ? (
            <p className="text-center text-muted py-5">No products found.</p>
        ) : (
            <p className="text-muted small mb-3">Showing {products.length} products.</p>
        )}
        <Row className="g-4">
            {products.map((product) => (
                <Col key={product.id} xs={12} sm={6} md={4} lg={3}>
                    <ProductCard product={product} />
                </Col>
            ))}
        </Row>
        {totalPages > 1 && (
             <div className="pagination-bar">
                <div className="d-flex justify-content-center flex-wrap gap-2">
                <Button variant="outline-primary" onClick={() => setPage(1)} disabled={page === 1 || page === 2}>
                    1
                </Button>
                <Button variant="outline-primary" onClick={() => setPage((prev) => prev - 1)} disabled={page === 1}>
                    Previous
                </Button>
                <Button variant="outline-primary" onClick={() => setPage((prev) => prev + 1)} disabled={page === totalPages}>
                    Next
                </Button>
                <Button variant="outline-primary" onClick={() => setPage(totalPages)} disabled={page === totalPages || page === totalPages - 1}>
                    {totalPages}
                </Button>
                </div>
                <p className="text-muted small mt-2 mb-0">Page {page} of {totalPages}</p>
             </div>
        )}
        
    </>)}
    </>
    );
}