import { Link, NavLink } from "react-router-dom";
import { Navbar, Nav, Button, NavDropdown, Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../store/slices/authSlice";
import { FiShoppingCart, FiUser, FiLogOut, FiGrid } from "react-icons/fi";

export default function AppNavbar() {
    const user = useSelector((state) => state.auth.user);
    const cartItems = useSelector((state) => state.cart.items);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    return (
        <header className="site-header">
            <div className="announcement-bar">
                <p>Browse, compare and shop everyday products in one place.</p>
            </div>
            <Navbar collapseOnSelect expand="lg" className="souq-navbar">
                <Container className="page-container">
                    <Navbar.Brand as={Link} to="/">
                        <img src="/souqly-logo.svg" alt="" width="32" height="32" />
                        Souqly
                    </Navbar.Brand>

                    {/* Cart + menu button: always visible, also on mobile */}
                    <div className="navbar-end order-lg-2">
                        {user && (
                            <Button variant="link" className="cart-button" aria-label={`Cart, ${cartItems.length} items`} onClick={() => {
                                navigate("/cart");
                            }}>
                                <FiShoppingCart aria-hidden="true" />
                                {cartItems.length > 0 && <span className="cart-count">{cartItems.length}</span>}
                            </Button>
                        )}
                        <Navbar.Toggle aria-controls="main-nav" />
                    </div>

                    <Navbar.Collapse id="main-nav" className="order-lg-1">
                        <Nav className="me-auto main-links">
                            <Nav.Link eventKey="home" as={NavLink} to="/" end>Home</Nav.Link>
                            <Nav.Link eventKey="products" as={NavLink} to="/products">Products</Nav.Link>
                        </Nav>
                        <Nav className="account-links">
                            {user && (
                                <NavDropdown
                                    align="end"
                                    id="account-menu"
                                    title={<span className="account-toggle"><FiUser aria-hidden="true" /> Hi, {user.firstName}</span>}
                                >
                                    <NavDropdown.Item eventKey="dashboard" onClick={() => navigate("/dashboard/products")}>
                                        <FiGrid aria-hidden="true" /> Dashboard
                                    </NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item eventKey="logout" onClick={() => {
                                        localStorage.removeItem("token");
                                        dispatch(logout());
                                        navigate("/login");
                                    }}>
                                        <FiLogOut aria-hidden="true" /> Logout
                                    </NavDropdown.Item>
                                </NavDropdown>
                            )}
                            {!user && (
                                <div className="auth-buttons">
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
                                </div>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </header>
    );
}
