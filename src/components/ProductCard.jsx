import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../store/slices/cartSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";
import RatingStars from "./RatingStars";
import StockBadge from "./StockBadge";

export default function ProductCard({ product }) {
  const user = useSelector((state) => state.auth.user);
  const cartItems = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();
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

  const hasDiscount = product.discountPercentage > 0;
  const originalPrice = hasDiscount ? product.price / (1 - product.discountPercentage / 100) : null;
  const detailsUrl = `/product/${product.id}`;

  return (
    <Card className="ProductCard product-card">
      <Link to={detailsUrl} className="product-media" tabIndex={-1} aria-hidden="true">
        <img src={product.thumbnail} alt="" loading="lazy" />
        {hasDiscount && <span className="discount-pill">-{Math.round(product.discountPercentage)}%</span>}
      </Link>
      <Card.Body className="product-body">
        {product.brand && <p className="product-brand">{product.brand}</p>}
        <Card.Title as="h3" className="product-title">
          <Link to={detailsUrl}>{product.title}</Link>
        </Card.Title>
        <div className="product-price-row">
          <span className="price">${product.price.toFixed(2)}</span>
          {hasDiscount && <span className="price-old"><span className="visually-hidden">Original price </span>${originalPrice.toFixed(2)}</span>}
        </div>
        <div className="product-meta">
          <span className="product-rating">
            <RatingStars rating={product.rating} size={12} />
            <span>{product.rating.toFixed(1)}</span>
          </span>
          <StockBadge status={product.availabilityStatus} />
        </div>
        <div className="product-actions">
          <Button variant="outline-primary" as={Link} to={detailsUrl} className="flex-grow-1">
            View Details
          </Button>
          <Button variant="primary" className="btn-icon-solid" onClick={handleAddToCart}
            aria-label={`Add ${product.title} to cart`} title="Add to Cart" disabled={product.stock < 1}>
            <FiShoppingCart aria-hidden="true" />
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}
