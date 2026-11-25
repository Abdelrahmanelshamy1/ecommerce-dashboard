import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api } from "../api/api";
import ProductCard from "../components/ProductCard";
import ProductCardPlaceholder from "../components/ProductCardPlaceholder";
import { Row, Col, Button, Form, Container, Breadcrumb } from "react-bootstrap";
import { FiSearch, FiX, FiChevronLeft, FiChevronRight, FiPackage } from "react-icons/fi";

const LIMIT = 12;

// One sort dropdown: each option sets both sortBy and order
const SORT_OPTIONS = [
    { value: "title-asc", label: "Name: A to Z" },
    { value: "title-desc", label: "Name: Z to A" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
    { value: "rating-desc", label: "Top Rated" },
];

export default function Products() {
    // read ?category= from the URL once, as the starting category
    const [searchParams] = useSearchParams();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [total, setTotal] = useState(0);
    const [query, setQuery] = useState("");
    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState(searchParams.get("category") || "");
    const [sortBy, setSortBy] = useState("title");
    const [order, setOrder] = useState("asc");


    const handleSearch = (e) => {
        setQuery(e.target.value);
        setPage(1);
        setCategory("");
    }

    const clearFilters = () => {
        setQuery("");
        setCategory("");
        setPage(1);
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
                setTotal(response.data.total);
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

    const hasFilters = query || category;

    return (
    <Container className="page-container">
    <Breadcrumb className="souq-breadcrumb">
        <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>Home</Breadcrumb.Item>
        <Breadcrumb.Item active>Products</Breadcrumb.Item>
    </Breadcrumb>
    <div className="page-head">
        <h1 className="page-heading mb-0">Products</h1>
        {!loading && <span className="result-count">{total} {total === 1 ? "product" : "products"}</span>}
    </div>

    <div className="filter-bar panel">
        <div className="input-icon filter-search">
            <FiSearch aria-hidden="true" />
            <Form.Control
                type="search"
                placeholder="Search products..."
                aria-label="Search products"
                value={query}
                onChange={handleSearch}
            />
        </div>
        <Form.Select className="filter-select text-capitalize" aria-label="Category" value={category} onChange={(e) => {
            setCategory(e.target.value);
            setPage(1);
            setQuery("");
        }}>
            <option value="">All categories</option>
            {categories.map((cat) => (
                <option key={cat} value={cat}>{cat.replace(/-/g, " ")}</option>
            ))}
        </Form.Select>
        <Form.Select className="filter-select" aria-label="Sort products" value={`${sortBy}-${order}`} onChange={(e) => {
            const [newSortBy, newOrder] = e.target.value.split("-");
            setSortBy(newSortBy);
            setOrder(newOrder);
            setPage(1);
        }}>
            {SORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
            ))}
        </Form.Select>
    </div>

    {hasFilters && (
        <div className="filter-chips" aria-label="Active filters">
            {query && (
                <button type="button" className="chip" onClick={() => { setQuery(""); setPage(1); }} aria-label={`Remove search filter ${query}`}>
                    Search: “{query}” <FiX aria-hidden="true" />
                </button>
            )}
            {category && (
                <button type="button" className="chip text-capitalize" onClick={() => { setCategory(""); setPage(1); }} aria-label={`Remove category filter ${category}`}>
                    {category.replace(/-/g, " ")} <FiX aria-hidden="true" />
                </button>
            )}
            <button type="button" className="chip-clear" onClick={clearFilters}>Clear filters</button>
        </div>
    )}

    {loading ? (
        <Row className="g-3 g-md-4" aria-busy="true">
            {Array.from({ length: 8 }).map((_, index) => (
                <Col key={index} xs={6} md={4} lg={3}>
                    <ProductCardPlaceholder />
                </Col>
            ))}
        </Row>
    ) : ( <>
        {products.length === 0 ? (
            <div className="empty-state panel">
                <FiPackage className="empty-icon" aria-hidden="true" />
                <p className="h5">No products found.</p>
                <p className="text-secondary-muted">Try another search or category.</p>
                {hasFilters && <Button variant="outline-primary" onClick={clearFilters}>Clear filters</Button>}
            </div>
        ) : (
        <Row className="g-3 g-md-4">
            {products.map((product) => (
                <Col key={product.id} xs={6} md={4} lg={3}>
                    <ProductCard product={product} />
                </Col>
            ))}
        </Row>
        )}
        {totalPages > 1 && (
             <nav className="pager" aria-label="Product pages">
                <Button variant="outline-primary" className="pager-num" aria-label="First page" onClick={() => setPage(1)} disabled={page === 1 || page === 2}>
                    1
                </Button>
                <Button variant="outline-primary" onClick={() => setPage((prev) => prev - 1)} disabled={page === 1}>
                    <FiChevronLeft aria-hidden="true" /> <span className="d-none d-sm-inline">Previous</span>
                </Button>
                <span className="pager-info">Page {page} of {totalPages}</span>
                <Button variant="outline-primary" onClick={() => setPage((prev) => prev + 1)} disabled={page === totalPages}>
                    <span className="d-none d-sm-inline">Next</span> <FiChevronRight aria-hidden="true" />
                </Button>
                <Button variant="outline-primary" className="pager-num" aria-label="Last page" onClick={() => setPage(totalPages)} disabled={page === totalPages || page === totalPages - 1}>
                    {totalPages}
                </Button>
             </nav>
        )}

    </>)}
    </Container>
    );
}
