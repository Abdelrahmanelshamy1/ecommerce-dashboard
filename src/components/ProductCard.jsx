import { Card, Button } from "react-bootstrap";
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
      <Card.Img variant="top" src={product.thumbnail} />
      <Card.Body>
        <Card.Title>{product.title}</Card.Title>
        <Card.Text>{product.description}</Card.Text>
        <p>Price: ${product.price.toFixed(2)}</p>
        <p>Rating: {product.rating}</p>
        <p>{product.availabilityStatus}</p>
        <Button as={Link} to={`/product/${product.id}`}>
          View Details
        </Button>
        <Button onClick={handleAddToCart}>
          Add to Cart
        </Button>
      </Card.Body>
    </Card>
  );
}