import { useEffect, useState } from "react";
import { Button, Row, Col, Container, Placeholder } from "react-bootstrap";
import { Link } from "react-router-dom";
import { api } from "../api/api";
import ProductCard from "../components/ProductCard";
import ProductCardPlaceholder from "../components/ProductCardPlaceholder";
import { FiArrowRight, FiLock, FiSearch, FiZap } from "react-icons/fi";
import {
    LuSparkles, LuSprayCan, LuSofa, LuShoppingBasket, LuLampDesk, LuCookingPot, LuLaptop, LuShirt,
    LuFootprints, LuWatch, LuHeadphones, LuBike, LuDroplet, LuSmartphone, LuDumbbell, LuGlasses,
    LuTablet, LuCar, LuShoppingBag, LuGem, LuTag,
} from "react-icons/lu";

// Icon for each DummyJSON category (falls back to a tag icon)
const CATEGORY_ICONS = {
    "beauty": LuSparkles,
    "fragrances": LuSprayCan,
    "furniture": LuSofa,
    "groceries": LuShoppingBasket,
    "home-decoration": LuLampDesk,
    "kitchen-accessories": LuCookingPot,
    "laptops": LuLaptop,
    "mens-shirts": LuShirt,
    "mens-shoes": LuFootprints,
    "mens-watches": LuWatch,
    "mobile-accessories": LuHeadphones,
    "motorcycle": LuBike,
    "skin-care": LuDroplet,
    "smartphones": LuSmartphone,
    "sports-accessories": LuDumbbell,
    "sunglasses": LuGlasses,
    "tablets": LuTablet,
    "tops": LuShirt,
    "vehicle": LuCar,
    "womens-bags": LuShoppingBag,
    "womens-dresses": LuShirt,
    "womens-jewellery": LuGem,
    "womens-shoes": LuFootprints,
    "womens-watches": LuWatch,
};

const BENEFITS = [
    { icon: FiLock, title: "Secure login", text: "Your account is protected with token-based sign in." },
    { icon: FiSearch, title: "Easy browsing", text: "Search, filter by category and sort in seconds." },
    { icon: FiZap, title: "Fast checkout", text: "Review your cart and place your order quickly." },
];

export default function Home() {
    const [topProducts, setTopProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);

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

    useEffect(() => {
        const getCategories = async () => {
            try {
                const response = await api.get("/products/category-list");
                setCategories(response.data.slice(0, 8));
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        getCategories();
    }, []);

    return (
        <>
        <Container className="page-container">
            <section className="hero">
                <div className="hero-content">
                    <span className="hero-eyebrow">Souqly marketplace</span>
                    <h1>Welcome to Souqly</h1>
                    <p>Beauty, tech, home and more, all in one clear and simple store.</p>
                    <Button as={Link} to="/products" size="lg" className="btn-accent">
                        Shop now <FiArrowRight aria-hidden="true" />
                    </Button>
                </div>
            </section>

            <section className="home-section" aria-labelledby="categories-heading">
                <div className="section-head">
                    <h2 id="categories-heading" className="section-heading">Shop by category</h2>
                    <Link to="/products" className="section-link">All products <FiArrowRight aria-hidden="true" /></Link>
                </div>
                <Row className="g-2 g-md-3">
                    {categories.length === 0
                        ? Array.from({ length: 8 }).map((_, index) => (
                            <Col key={index} xs={6} sm={4} lg={3}>
                                <Placeholder as="div" animation="glow" className="category-tile">
                                    <Placeholder xs={8} />
                                </Placeholder>
                            </Col>
                        ))
                        : categories.map((cat) => {
                            const Icon = CATEGORY_ICONS[cat] || LuTag;
                            return (
                                <Col key={cat} xs={6} sm={4} lg={3}>
                                    <Link to={`/products?category=${cat}`} className="category-tile">
                                        <span className="category-icon"><Icon aria-hidden="true" /></span>
                                        <span className="category-name">{cat.replace(/-/g, " ")}</span>
                                    </Link>
                                </Col>
                            );
                        })}
                </Row>
            </section>

            <section className="home-section" aria-labelledby="top-heading">
                <div className="section-head">
                    <h2 id="top-heading" className="section-heading">Top rated products</h2>
                    <Link to="/products" className="section-link">View all <FiArrowRight aria-hidden="true" /></Link>
                </div>
                <Row className="g-3 g-md-4">
                    {loading
                        ? Array.from({ length: 4 }).map((_, index) => (
                            <Col key={index} xs={6} md={4} lg={3}>
                                <ProductCardPlaceholder />
                            </Col>
                        ))
                        : topProducts.map((product) => (
                            <Col key={product.id} xs={6} md={4} lg={3}>
                                <ProductCard product={product} />
                            </Col>
                        ))}
                </Row>
            </section>

            <section className="benefits panel" aria-label="Why Souqly">
                {BENEFITS.map(({ icon: Icon, title, text }) => (
                    <div className="benefit" key={title}>
                        <span className="benefit-icon"><Icon aria-hidden="true" /></span>
                        <div>
                            <h3 className="benefit-title">{title}</h3>
                            <p className="benefit-text">{text}</p>
                        </div>
                    </div>
                ))}
            </section>
        </Container>

        <footer className="site-footer">
            <Container className="page-container footer-inner">
                <div>
                    <Link to="/" className="footer-brand">
                        <img src="/souqly-logo.svg" alt="" width="28" height="28" /> Souqly
                    </Link>
                    <p className="footer-text">A simple, modern store built with React.</p>
                </div>
                <nav className="footer-links" aria-label="Footer">
                    <Link to="/">Home</Link>
                    <Link to="/products">Products</Link>
                    <Link to="/cart">Cart</Link>
                </nav>
                <p className="footer-copy">© {new Date().getFullYear()} Souqly. All rights reserved.</p>
            </Container>
        </footer>
        </>
    );
}
