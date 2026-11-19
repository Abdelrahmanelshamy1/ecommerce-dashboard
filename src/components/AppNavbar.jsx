import { Link } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";

export default function AppNavbar() {
    return (
        <Navbar expand="lg">
            <Navbar.Brand as={Link} to="/">E-commerce</Navbar.Brand>
            <Navbar.Toggle aria-controls="main-nav" />
            <Navbar.Collapse id="main-nav">
                <Nav>
                    <Nav.Link as={Link} to="/">Home</Nav.Link>
                    <Nav.Link as={Link} to="/products">Products</Nav.Link>
                    <Nav.Link as={Link} to="/login">Login</Nav.Link>
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}