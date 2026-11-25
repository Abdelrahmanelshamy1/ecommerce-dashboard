import { Card, Placeholder } from "react-bootstrap";

// Grey "glowing" card shown while products are loading
export default function ProductCardPlaceholder() {
  return (
    <Card className="product-card" aria-hidden="true">
      <div className="product-media">
        <Placeholder as="div" animation="glow" className="w-100 h-100">
          <Placeholder className="w-100 h-100" />
        </Placeholder>
      </div>
      <Card.Body className="product-body">
        <Placeholder as="p" animation="glow" className="mb-1">
          <Placeholder xs={4} size="xs" />
        </Placeholder>
        <Placeholder as="p" animation="glow" className="mb-2">
          <Placeholder xs={10} /> <Placeholder xs={6} />
        </Placeholder>
        <Placeholder as="p" animation="glow" className="mb-2">
          <Placeholder xs={5} size="lg" />
        </Placeholder>
        <Placeholder as="p" animation="glow" className="mb-3">
          <Placeholder xs={7} size="sm" />
        </Placeholder>
        <div className="product-actions mt-auto">
          <Placeholder.Button variant="secondary" xs={8} aria-hidden="true" />
          <Placeholder.Button variant="secondary" xs={3} aria-hidden="true" />
        </div>
      </Card.Body>
    </Card>
  );
}
