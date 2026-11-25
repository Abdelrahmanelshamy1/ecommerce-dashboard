import { Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function DashboardNav() {
    return (
        <Nav>
            <Nav.Link as={Link} to="/dashboard/products">Products Dashboard</Nav.Link>
            <Nav.Link as={Link} to="/dashboard/carts">Carts Dashboard</Nav.Link>
            <Nav.Link as={Link} to="/dashboard/users">Users Dashboard</Nav.Link>
        </Nav>
    )
}