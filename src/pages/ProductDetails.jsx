import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { api } from "../api/api";
import { Button, Row, Col, Badge, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { addToCart } from "../store/slices/cartSlice";

export default function ProductDetails() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);
    const handleAddToCart = () => {
        if (!user) {
            toast.error("Please log in to add items to your cart.");
            navigate("/login");
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

        return (
        <>
            {loading ? (
                <div className="loading-box">
                    <Spinner animation="border" variant="primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            ) : !product ? (
                <p className="text-center text-muted py-5">Product not found.</p>
            ) : (
                <div className="mt-4">
                    <Row className="g-4">
                        <Col xs={12} md={6}>
                            <img className="details-main-img" src={product.thumbnail} alt={product.title} />
                            <div className="details-thumbs">
                                {product.images.map((image, index) => (
                                    <div key={index}>
                                        <img src={image} alt={product.title} width="100" />
                                    </div>
                                ))}
                            </div>
                        </Col>
                        <Col xs={12} md={6} className="details-info">
                            <h1>{product.title}</h1>
                            <p className="text-muted">{product.description}</p>
                            <p className="details-price">Price: ${product.price.toFixed(2)}</p>
                            <p><Badge bg="danger">{product.discountPercentage}% off</Badge></p>
                            <p><Badge bg="light" text="dark" className="border">Category: {product.category}</Badge></p>
                            {product.brand && <p>Brand: {product.brand}</p>}
                            <p><span className="star">★</span> Rating: {product.rating}</p>
                            <p className="fw-semibold text-success">{product.availabilityStatus} ({product.stock} in stock)</p>
                            <div className="details-specs souq-surface">
                                <p>Minimum order: {product.minimumOrderQuantity}</p>
                                <p>Tags: {product.tags.join(", ")}</p>
                                <p>Warranty: {product.warrantyInformation}</p>
                                <p>Shipping: {product.shippingInformation}</p>
                                <p>Return policy: {product.returnPolicy}</p>
                                <p>Weight: {product.weight}</p>
                                <p className="mb-0">
                                    Dimensions: {product.dimensions.width} x {product.dimensions.height} x {product.dimensions.depth}
                                </p>
                            </div>
                            <Button variant="primary" size="lg" className="w-100" onClick={handleAddToCart}>
                                Add to Cart
                            </Button>
                        </Col>
                    </Row>

                    <h2 className="section-title">Reviews</h2>
                    <Row>
                        <Col xs={12} lg={8}>
                            {product.reviews.map((review, index) => (
                                <div key={index} className="review-card souq-surface">
                                    <p>
                                        <b>{review.reviewerName}</b> rated it <span className="star">★</span> {review.rating}/5
                                    </p>
                                    <p className="text-muted">{review.comment}</p>
                                </div>
                            ))}
                        </Col>
                    </Row>
                </div>
            )}
        </>
    )
}