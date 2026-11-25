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
    <h1>Products</h1>
    <Form.Select value={category} onChange={(e) => {
        setCategory(e.target.value);
        setPage(1);
        setQuery("");
    }}>
        <option value="">All categories</option>
        {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
        ))}
    </Form.Select>
    <Form.Select value={sortBy} onChange={(e) => {
        setSortBy(e.target.value);
        setPage(1);
    }}>
        <option value="title">Sort by Title</option>
        <option value="price">Sort by Price</option>
        <option value="rating">Sort by Rating</option>
    </Form.Select>
    <Form.Select value={order} onChange={(e) => {
        setOrder(e.target.value);
        setPage(1);
    }}>
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
    </Form.Select>
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