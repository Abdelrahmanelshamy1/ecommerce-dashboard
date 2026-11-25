import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <div>
            <h1>404 - Page Not Found</h1>
            <p>The page you are looking for doesn't exist.</p>
            <Button as={Link} to="/">Continue Shopping</Button>
        </div>
    );
}