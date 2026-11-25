import { Placeholder } from "react-bootstrap";

// Simple loading skeleton for dashboard tables
export default function TableSkeleton({ rows = 6, columns = 5 }) {
    return (
        <div className="panel table-panel" aria-busy="true" aria-label="Loading table">
            {Array.from({ length: rows }).map((_, row) => (
                <Placeholder as="div" animation="glow" key={row} className="table-skeleton-row">
                    {Array.from({ length: columns }).map((_, col) => (
                        <Placeholder key={col} xs={col === 1 ? 4 : 2} className="rounded" />
                    ))}
                </Placeholder>
            ))}
        </div>
    );
}
