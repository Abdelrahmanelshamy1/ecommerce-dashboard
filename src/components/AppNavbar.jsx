import { Link } from "react-router-dom";
import { Navbar, Nav, Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../store/slices/authSlice";

export default function AppNavbar() {
    const user = useSelector((state) => state.auth.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    return (
        <>
            {user && (
                <div>
                    <p>Welcome, {user.firstName}!</p>
                </div>
            )}
            <Navbar collapseOnSelect expand="lg">
                <Navbar.Brand as={Link} to="/">E-commerce</Navbar.Brand>
                <Navbar.Toggle aria-controls="main-nav" />
                <Navbar.Collapse id="main-nav">
                    <Nav>
                        <Nav.Link eventKey="home" as={Link} to="/">Home</Nav.Link>
                        <Nav.Link eventKey="products" as={Link} to="/products">Products</Nav.Link>
                        {!user && (
                            <Nav.Link eventKey="login" as={Link} to="/login">Login</Nav.Link>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
            {user && (
                <Button variant="danger" onClick={() => {
                    localStorage.removeItem("token");
                    dispatch(logout());
                    navigate("/login");
                }}>
                    Logout
                </Button>
            )}
        </>
    );
}