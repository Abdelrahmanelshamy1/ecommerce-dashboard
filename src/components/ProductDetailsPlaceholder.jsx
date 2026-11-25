import { Row, Col, Placeholder } from "react-bootstrap";

// Grey "glowing" layout shown while a product is loading
export default function ProductDetailsPlaceholder() {
  return (
    <div aria-busy="true" aria-label="Loading product">
      <Placeholder as="p" animation="glow" className="mb-4">
        <Placeholder xs={4} md={3} size="sm" />
      </Placeholder>
      <Row className="g-4 g-lg-5">
        <Col xs={12} md={6}>
          <Placeholder as="div" animation="glow" className="gallery-main">
            <Placeholder className="w-100 h-100 rounded-3" />
          </Placeholder>
          <Placeholder as="div" animation="glow" className="d-flex gap-2 mt-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Placeholder key={i} style={{ width: 64, height: 64 }} className="rounded-2" />
            ))}
          </Placeholder>
        </Col>
        <Col xs={12} md={6}>
          <Placeholder as="p" animation="glow" className="mb-2"><Placeholder xs={3} size="sm" /></Placeholder>
          <Placeholder as="h1" animation="glow" className="mb-3"><Placeholder xs={9} /></Placeholder>
          <Placeholder as="p" animation="glow" className="mb-3"><Placeholder xs={5} /></Placeholder>
          <Placeholder as="p" animation="glow" className="mb-4"><Placeholder xs={4} size="lg" /></Placeholder>
          <Placeholder as="p" animation="glow" className="mb-2">
            <Placeholder xs={12} /> <Placeholder xs={10} /> <Placeholder xs={11} /> <Placeholder xs={8} />
          </Placeholder>
          <Placeholder.Button variant="primary" xs={12} className="mt-3" aria-hidden="true" />
        </Col>
      </Row>
    </div>
  );
}
