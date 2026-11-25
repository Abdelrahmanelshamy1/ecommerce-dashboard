import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { api } from "../api/api";
import { Button, Row, Col, Container, Breadcrumb, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { addToCart } from "../store/slices/cartSlice";
import { FiShoppingCart, FiTruck, FiShield, FiRotateCcw, FiPackage, FiArrowLeft } from "react-icons/fi";
import ProductCard from "../components/ProductCard";
import ProductDetailsPlaceholder from "../components/ProductDetailsPlaceholder";
import RatingStars from "../components/RatingStars";
import StockBadge from "../components/StockBadge";

const formatDate = (date) =>
    new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

export default function ProductDetails() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    // UI only: which gallery image is shown big
    const [selectedImage, setSelectedImage] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);
    const cartItems = useSelector((state) => state.cart.items);
    const handleAddToCart = () => {
        if (!user) {
            toast.error("Please log in to add items to your cart.");
            navigate("/login");
            return;
        }
        // don't show "Added" when the cart already holds all available stock
        const inCart = cartItems.find((item) => item.id === product.id);
        if (product.stock < 1 || (inCart && inCart.quantity >= product.stock)) {
            toast.error("No more stock available.");
            return;
        }
        dispatch(addToCart(product));
        toast.success("Added to cart!");
    }

    useEffect(() => {

        const getProduct = async () => {
            try {
                const response = await api.get(`/products/${id}`);
                setProduct(response.data);
            } catch (error) {
                console.error("Error fetching product:", error);
            } finally {
                setLoading(false);
            }
        }
        getProduct();
    }, [id])

    // when opening another product (e.g. from "Related products"), start at the top of the page
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    // Related products: same category, without the current product
    const category = product?.category;
    useEffect(() => {
        if (!category) return;
        const getRelated = async () => {
            try {
                const response = await api.get(`/products/category/${category}`, { params: { limit: 5 } });
                setRelatedProducts(response.data.products.filter((p) => p.id !== Number(id)).slice(0, 4));
            } catch (error) {
                console.error("Error fetching related products:", error);
            }
        };
        getRelated();
    }, [category, id]);

        if (loading) {
            return (
                <Container className="page-container">
                    <ProductDetailsPlaceholder />
                </Container>
            );
        }

        if (!product) {
            return (
                <Container className="page-container">
                    <div className="empty-state panel">
                        <FiPackage className="empty-icon" aria-hidden="true" />
                        <p className="h5">Product not found.</p>
                        <Button as={Link} to="/products" variant="outline-primary"><FiArrowLeft aria-hidden="true" /> Back to products</Button>
                    </div>
                </Container>
            );
        }

        const images = product.images?.length ? product.images : [product.thumbnail];
        const mainImage = images.includes(selectedImage) ? selectedImage : images[0];
        const hasDiscount = product.discountPercentage > 0;
        const originalPrice = hasDiscount ? product.price / (1 - product.discountPercentage / 100) : null;
        const categoryName = product.category.replace(/-/g, " ");

        return (
        <Container className="page-container details-page">
            <Breadcrumb className="souq-breadcrumb">
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>Home</Breadcrumb.Item>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/products" }}>Products</Breadcrumb.Item>
                <Breadcrumb.Item linkAs={Link} linkProps={{ to: `/products?category=${product.category}` }} className="text-capitalize">{categoryName}</Breadcrumb.Item>
                <Breadcrumb.Item active>{product.title}</Breadcrumb.Item>
            </Breadcrumb>

            <Row className="g-4 g-lg-5">
                <Col xs={12} md={6}>
                    <div className="gallery-main">
                        <img src={mainImage} alt={product.title} />
                        {hasDiscount && <span className="discount-pill">-{Math.round(product.discountPercentage)}%</span>}
                    </div>
                    {images.length > 1 && (
                        <div className="gallery-thumbs" role="group" aria-label="Product images">
                            {images.map((image, index) => (
                                <button
                                    type="button"
                                    key={index}
                                    className={image === mainImage ? "active" : ""}
                                    aria-label={`Show image ${index + 1} of ${images.length}`}
                                    aria-pressed={image === mainImage}
                                    onClick={() => setSelectedImage(image)}
                                >
                                    <img src={image} alt="" />
                                </button>
                            ))}
                        </div>
                    )}
                </Col>

                <Col xs={12} md={6}>
                    {product.brand && <p className="details-brand">{product.brand}</p>}
                    <h1 className="details-title">{product.title}</h1>
                    <div className="details-rating">
                        <RatingStars rating={product.rating} size={16} />
                        <span className="fw-semibold">{product.rating.toFixed(1)}</span>
                        <a href="#reviews">({product.reviews.length} {product.reviews.length === 1 ? "review" : "reviews"})</a>
                    </div>

                    <div className="details-price-row">
                        <span className="details-price">${product.price.toFixed(2)}</span>
                        {hasDiscount && (
                            <>
                                <span className="price-old"><span className="visually-hidden">Original price </span>${originalPrice.toFixed(2)}</span>
                                <span className="discount-pill static">{product.discountPercentage}% off</span>
                            </>
                        )}
                    </div>

                    <div className="mb-3 d-flex align-items-center gap-2 flex-wrap">
                        <StockBadge status={product.availabilityStatus} />
                        <span className="meta-text">{product.stock} in stock</span>
                    </div>

                    <ul className="info-rows">
                        <li><FiTruck aria-hidden="true" /><span><strong>Shipping:</strong> {product.shippingInformation}</span></li>
                        <li><FiShield aria-hidden="true" /><span><strong>Warranty:</strong> {product.warrantyInformation}</span></li>
                        <li><FiRotateCcw aria-hidden="true" /><span><strong>Returns:</strong> {product.returnPolicy}</span></li>
                        <li><FiPackage aria-hidden="true" /><span><strong>Minimum order:</strong> {product.minimumOrderQuantity}</span></li>
                    </ul>

                    <div className="details-buy">
                        <div className="details-buy-price d-md-none">
                            <span className="details-price">${product.price.toFixed(2)}</span>
                        </div>
                        <Button variant="primary" size="lg" className="details-buy-button" onClick={handleAddToCart} disabled={product.stock < 1}>
                            <FiShoppingCart aria-hidden="true" /> Add to Cart
                        </Button>
                    </div>
                </Col>
            </Row>

            <Row className="g-4 g-lg-5 details-lower">
                <Col xs={12} lg={7}>
                    <h2 className="section-heading-sm">Description</h2>
                    <p className="details-description">{product.description}</p>
                </Col>
                <Col xs={12} lg={5}>
                    <h2 className="section-heading-sm">Specifications</h2>
                    <Table className="specs-table" size="sm">
                        <tbody>
                            <tr><th scope="row">SKU</th><td>{product.sku}</td></tr>
                            {product.brand && <tr><th scope="row">Brand</th><td>{product.brand}</td></tr>}
                            <tr><th scope="row">Category</th><td className="text-capitalize">{categoryName}</td></tr>
                            <tr><th scope="row">Weight</th><td>{product.weight}</td></tr>
                            <tr><th scope="row">Dimensions</th><td>{product.dimensions.width} x {product.dimensions.height} x {product.dimensions.depth}</td></tr>
                            <tr><th scope="row">Tags</th><td>{product.tags.join(", ")}</td></tr>
                        </tbody>
                    </Table>
                </Col>
            </Row>

            <section id="reviews" className="home-section" aria-labelledby="reviews-heading">
                <h2 id="reviews-heading" className="section-heading">Reviews</h2>
                {product.reviews.length === 0 ? (
                    <p className="text-secondary-muted">No reviews yet.</p>
                ) : (
                    <Row className="g-3">
                        {product.reviews.map((review, index) => (
                            <Col key={index} xs={12} md={6} lg={4}>
                                <article className="review-card panel">
                                    <RatingStars rating={review.rating} size={14} />
                                    <p className="review-comment">{review.comment}</p>
                                    <p className="review-meta">
                                        <strong>{review.reviewerName}</strong>
                                        <span> · </span>
                                        <time dateTime={review.date}>{formatDate(review.date)}</time>
                                    </p>
                                </article>
                            </Col>
                        ))}
                    </Row>
                )}
            </section>

            {relatedProducts.length > 0 && (
                <section className="home-section" aria-labelledby="related-heading">
                    <h2 id="related-heading" className="section-heading">Related products</h2>
                    <Row className="g-3 g-md-4">
                        {relatedProducts.map((related) => (
                            <Col key={related.id} xs={6} md={4} lg={3}>
                                <ProductCard product={related} />
                            </Col>
                        ))}
                    </Row>
                </section>
            )}
        </Container>
    )
}
