import { Link } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";

export default function AppNavbar() {
    return (
        <Navbar collapseOnSelect expand="lg">
            <Navbar.Brand as={Link} to="/">E-commerce</Navbar.Brand>
            <Navbar.Toggle aria-controls="main-nav" />
            <Navbar.Collapse id="main-nav">
                <Nav>
                    <Nav.Link eventKey="home" as={Link} to="/">Home</Nav.Link>
                    <Nav.Link eventKey="products" as={Link} to="/products">Products</Nav.Link>
                    <Nav.Link eventKey="login" as={Link} to="/login">Login</Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}