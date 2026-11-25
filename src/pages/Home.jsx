import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function Home() {
    return (
        <div>
            <h1>Welcome to our E-commerce Store</h1>
            <p>Browse hundreds of products, add them to your cart, and check out.</p>
            <Button as={Link} to="/products">Shop now</Button>
        </div>
    );
}