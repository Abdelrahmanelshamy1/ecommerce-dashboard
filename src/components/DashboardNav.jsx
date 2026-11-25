import { Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";

export default function DashboardNav() {
    return (
        <Nav variant="pills" className="dashboard-nav souq-surface flex-column flex-sm-row">
            <Nav.Link as={NavLink} to="/dashboard/products">Products Dashboard</Nav.Link>
            <Nav.Link as={NavLink} to="/dashboard/carts">Carts Dashboard</Nav.Link>
            <Nav.Link as={NavLink} to="/dashboard/users">Users Dashboard</Nav.Link>
        </Nav>
    )
}
