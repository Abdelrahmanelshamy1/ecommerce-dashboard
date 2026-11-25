import { Button, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FiCompass, FiArrowLeft } from "react-icons/fi";

export default function NotFound() {
    return (
        <Container className="page-container">
            <div className="not-found panel">
                <span className="not-found-icon"><FiCompass aria-hidden="true" /></span>
                <p className="not-found-code" aria-hidden="true">404</p>
                <h1>404 - Page Not Found</h1>
                <p className="text-secondary-muted mb-4">The page you are looking for doesn't exist.</p>
                <Button as={Link} to="/" size="lg"><FiArrowLeft aria-hidden="true" /> Continue Shopping</Button>
            </div>
        </Container>
    );
}
