import { Link, NavLink } from "react-router-dom";
import { Navbar, Nav, Button, Badge } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../store/slices/authSlice";

export default function AppNavbar() {
    const user = useSelector((state) => state.auth.user);
    const cartItems = useSelector((state) => state.cart.items);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    return (
        <>
            {user && (
                <div className="welcome-bar">
                    <p>Welcome, {user.firstName}!</p>
                </div>
            )}
            <Navbar collapseOnSelect expand="lg" className="souq-navbar">
                <Navbar.Brand as={Link} to="/">
                    <img src="/souqly-logo.svg" alt="" />
                    Souqly
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="main-nav" />
                <Navbar.Collapse id="main-nav">
                    <Nav className="me-auto">
                        <Nav.Link eventKey="home" as={NavLink} to="/" end>Home</Nav.Link>
                        <Nav.Link eventKey="products" as={NavLink} to="/products">Products</Nav.Link>
                    </Nav>
                    <div className="nav-actions">
                        {user && (
                            <>
                            <Button variant="outline-primary" onClick={() => {
                                navigate("/cart");
                            }}>
                                Cart <Badge bg="warning" text="dark" pill>{cartItems.length}</Badge>
                            </Button>
                            <Button variant="primary" onClick={() => navigate("/dashboard/products")}>
                                Dashboard
                            </Button>
                            <Button variant="outline-secondary" onClick={() => {
                                localStorage.removeItem("token");
                                dispatch(logout());
                                navigate("/login");
                            }}>
                                Logout
                            </Button>
                            </>
                        )}
                        {!user && (
                            <>
                            <Button variant="outline-primary" onClick={() => {
                                navigate("/login");
                            }}>
                                Login
                            </Button>
                            <Button variant="primary" onClick={() => {
                                navigate("/register");
                            }}>
                                Register
                            </Button>
                            </>
                        )}
                    </div>
                </Navbar.Collapse>
            </Navbar>
        </>
    );
}
