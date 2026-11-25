import { Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { FiBox, FiShoppingCart, FiUsers } from "react-icons/fi";

export default function DashboardNav() {
    return (
        <Nav variant="pills" className="dashboard-nav" as="nav" aria-label="Dashboard sections">
            <Nav.Link as={NavLink} to="/dashboard/products"><FiBox aria-hidden="true" /> Products Dashboard</Nav.Link>
            <Nav.Link as={NavLink} to="/dashboard/carts"><FiShoppingCart aria-hidden="true" /> Carts Dashboard</Nav.Link>
            <Nav.Link as={NavLink} to="/dashboard/users"><FiUsers aria-hidden="true" /> Users Dashboard</Nav.Link>
        </Nav>
    )
}
