import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function NotFound() {
    return (
        <div className="not-found souq-surface">
            <div className="not-found-code" aria-hidden="true">404</div>
            <h1 className="mt-n3">404 - Page Not Found</h1>
            <p className="text-muted mb-4">The page you are looking for doesn't exist.</p>
            <Button as={Link} to="/" size="lg">Continue Shopping</Button>
        </div>
    );
}