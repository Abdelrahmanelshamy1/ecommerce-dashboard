import { Card, Button, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../store/slices/cartSlice";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function ProductCard({ product }) {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleAddToCart = () => {
        if (!user) {
            toast.error("Please log in to add items to your cart.");
            navigate("/login");
            return;
        }
        dispatch(addToCart(product));
        toast.success("Added to cart!");
    }

  return (
    <Card className="ProductCard">
      <Card.Img variant="top" src={product.thumbnail} alt={product.title} loading="lazy" />
      <Card.Body>
        <Card.Title title={product.title}>{product.title}</Card.Title>
        <Card.Text>{product.description}</Card.Text>
        <p className="product-price">Price: ${product.price.toFixed(2)}</p>
        <p className="product-rating"><span className="star">★</span> Rating: {product.rating}</p>
        <p>
          <Badge
            bg={product.availabilityStatus === "In Stock" ? "success" : product.availabilityStatus === "Low Stock" ? "warning" : "secondary"}
            text={product.availabilityStatus === "Low Stock" ? "dark" : undefined}
          >
            {product.availabilityStatus}
          </Badge>
        </p>
        <div className="product-actions">
          <Button variant="outline-primary" as={Link} to={`/product/${product.id}`}>
            View Details
          </Button>
          <Button variant="primary" onClick={handleAddToCart}>
            Add to Cart
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}