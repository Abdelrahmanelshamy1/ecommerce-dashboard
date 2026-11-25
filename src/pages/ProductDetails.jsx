import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { api } from "../api/api";
import { Button } from "react-bootstrap";
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
                <p>Loading...</p>
            ) : !product ? (
                <p>Product not found.</p>
            ) : (
                <div>
                    <img src={product.thumbnail} alt={product.title} />
                    {product.images.map((image, index) => (
                        <div key={index}>
                            <img src={image} alt={product.title} width="100" />
                        </div>
                    ))}
                    <h1>{product.title}</h1>
                    <p>{product.description}</p>
                    <p>Price: ${product.price.toFixed(2)}</p>
                    <p>{product.discountPercentage}% off</p>
                    <p>Category: {product.category}</p>
                    {product.brand && <p>Brand: {product.brand}</p>}
                    <p>Rating: {product.rating}</p>
                    <p>{product.availabilityStatus} ({product.stock} in stock)</p>
                    <p>Minimum order: {product.minimumOrderQuantity}</p>
                    <p>Tags: {product.tags.join(", ")}</p>
                    <p>Warranty: {product.warrantyInformation}</p>
                    <p>Shipping: {product.shippingInformation}</p>
                    <p>Return policy: {product.returnPolicy}</p>
                    <p>Weight: {product.weight}</p>
                    <p>
                        Dimensions: {product.dimensions.width} x {product.dimensions.height} x {product.dimensions.depth}
                    </p>
                    <Button variant="primary" onClick={handleAddToCart}>
                        Add to Cart
                    </Button>

                    <h2>Reviews</h2>
                    {product.reviews.map((review, index) => (
                        <div key={index}>
                            <p>
                                <b>{review.reviewerName}</b> rated it {review.rating}/5
                            </p>
                            <p>{review.comment}</p>
                        </div>
                    ))}
                </div>
            )}
        </>
    )
}