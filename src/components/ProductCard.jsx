import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  return (
    <Card className="ProductCard">
      <Card.Img variant="top" src={product.thumbnail} />
      <Card.Body>
        <Card.Title>{product.title}</Card.Title>
        <Card.Text>{product.description}</Card.Text>
        <p>Price: ${product.price.toFixed(2)}</p>
        <Button as={Link} to={`/product/${product.id}`}>
          View Details
        </Button>
      </Card.Body>
    </Card>
  );
}