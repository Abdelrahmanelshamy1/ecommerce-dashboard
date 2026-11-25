import { FiCheckCircle, FiAlertCircle, FiXCircle } from "react-icons/fi";

// Uses availabilityStatus from the API: "In Stock", "Low Stock" or "Out of Stock"
export default function StockBadge({ status }) {
    if (!status) return null;
    let variant = "in";
    let Icon = FiCheckCircle;
    if (status === "Low Stock") {
        variant = "low";
        Icon = FiAlertCircle;
    } else if (status === "Out of Stock") {
        variant = "out";
        Icon = FiXCircle;
    }
    return (
        <span className={`stock-badge stock-${variant}`}>
            <Icon size={13} aria-hidden="true" /> {status}
        </span>
    );
}
