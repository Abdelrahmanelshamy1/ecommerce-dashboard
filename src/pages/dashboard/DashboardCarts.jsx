import { useEffect, useState } from "react";
import DashboardNav from "../../components/DashboardNav";
import { api } from "../../api/api";
import { Table, Button, Form, Row, Col, Spinner } from "react-bootstrap";
import toast from "react-hot-toast";

export default function DashboardCarts() {
    const [carts, setCarts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState("");
    // NEW: the cart we are viewing in detail
    const [selectedCart, setSelectedCart] = useState(null);
    // NEW: form fields for add / update
    const [formUserId, setFormUserId] = useState("");
    const [productId, setProductId] = useState("");
    const [quantity, setQuantity] = useState("");
    const [editingId, setEditingId] = useState(null);

    const handleDelete = async (id) => {
        try {
            await api.delete(`/carts/${id}`);
            setCarts(carts.filter((cart) => cart.id !== id));
            toast.success("Cart Deleted Successfully!");
        } catch (error) {
            console.error("Error deleting cart:", error);
            toast.error("Couldn't Delete Cart!");
        }
    };

    const handleView = async (id) => {
        try {
            const response = await api.get(`/carts/${id}`);
            setSelectedCart(response.data);
        } catch (error) {
            console.error("Error fetching cart:", error);
            toast.error("Couldn't load cart!");
        }
    };

    const handleEdit = (cart) => {
        setEditingId(cart.id);
        setFormUserId(cart.userId);
        setProductId("");
        setQuantity("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const products = [{ id: Number(productId), quantity: Number(quantity) }];
        try {
            if (editingId) {
                const response = await api.put(`/carts/${editingId}`, { merge: true, products });
                setCarts(carts.map((cart) => (cart.id === editingId ? response.data : cart)));
                toast.success("Cart Updated!");
            } else {
                const response = await api.post("/carts/add", { userId: Number(formUserId), products });
                setCarts([response.data, ...carts]);
                toast.success("Cart Added!");
            }
            setFormUserId("");
            setProductId("");
            setQuantity("");
            setEditingId(null);
        } catch (error) {
            console.error("Error saving cart:", error);
            toast.error("Something went wrong!");
        }
    };

    useEffect(() => {
        const getCarts = async () => {
            try {
                setLoading(true);
                let url = "/carts";
                if (userId) {
                    url = `/carts/user/${userId}`;
                }
                const response = await api.get(url);
                setCarts(response.data.carts);
            } catch (error) {
                console.error("Error fetching carts:", error);
            } finally {
                setLoading(false);
            }
        };
        getCarts();
    }, [userId]);

    return (
        <>
            <DashboardNav />
            <h1 className="page-title">Carts Dashboard</h1>

            <div className="dashboard-panel souq-surface">
            <h2>{editingId ? `Update cart ${editingId}` : "Add a cart"}</h2>
            <Form onSubmit={handleSubmit}>
                <Row className="g-3">
                <Col xs={12} sm={4} md={3}>
                <Form.Control
                    type="number"
                    placeholder="User ID"
                    aria-label="User ID"
                    value={formUserId}
                    onChange={(e) => setFormUserId(e.target.value)}
                    disabled={editingId !== null}
                    required
                />
                </Col>
                <Col xs={12} sm={4} md={3}>
                <Form.Control
                    type="number"
                    placeholder="Product ID"
                    aria-label="Product ID"
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                    required
                />
                </Col>
                <Col xs={12} sm={4} md={3}>
                <Form.Control
                    type="number"
                    placeholder="Quantity"
                    aria-label="Quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                />
                </Col>
                <Col xs={12} md={3} className="d-grid">
                <Button type="submit">{editingId ? "Save Changes" : "Add Cart"}</Button>
                </Col>
                </Row>
            </Form>
            </div>

            {selectedCart && (
                <div className="dashboard-panel detail-panel souq-surface">
                    <h2>Cart {selectedCart.id} details (User {selectedCart.userId})</h2>
                    <Table hover responsive size="sm">
                        <thead>
                            <tr>
                                <th>Product</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedCart.products.map((product) => (
                                <tr key={product.id}>
                                    <td>{product.title}</td>
                                    <td>${product.price}</td>
                                    <td>{product.quantity}</td>
                                    <td>${product.total.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <p className="fw-bold">Cart total: ${selectedCart.total.toFixed(2)}</p>
                    <Button variant="outline-secondary" size="sm" onClick={() => setSelectedCart(null)}>Close</Button>
                </div>
            )}

            <Row className="mb-3">
            <Col xs={12} sm={6} md={4}>
            <Form.Control
                type="number"
                placeholder="Filter by user ID"
                aria-label="Filter by user ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
            />
            </Col>
            </Row>
            {loading ? (
                <div className="loading-box">
                    <Spinner animation="border" variant="primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </div>
            ) : (
                <div className="table-surface souq-surface">
                <Table hover striped responsive>
                    <thead>
                        <tr>
                            <th>Cart ID</th>
                            <th>User ID</th>
                            <th>Products</th>
                            <th>Quantity</th>
                            <th>Total</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {carts.map((cart) => (
                            <tr key={cart.id}>
                                <td>{cart.id}</td>
                                <td>{cart.userId}</td>
                                <td>{cart.totalProducts}</td>
                                <td>{cart.totalQuantity}</td>
                                <td>${cart.total.toFixed(2)}</td>
                                <td>
                                    <div className="table-actions">
                                    <Button variant="outline-primary" size="sm" onClick={() => handleView(cart.id)}>View</Button>
                                    <Button variant="outline-secondary" size="sm" onClick={() => handleEdit(cart)}>Edit</Button>
                                    <Button variant="outline-danger" size="sm" onClick={() => handleDelete(cart.id)}>Remove</Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                </div>
            )}
        </>
    );
}