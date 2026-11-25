import { useEffect, useState } from "react";
import DashboardNav from "../../components/DashboardNav";
import TableSkeleton from "../../components/TableSkeleton";
import { api } from "../../api/api";
import { Table, Button, Form, Row, Col, Container } from "react-bootstrap";
import { FiEye, FiEdit2, FiTrash2, FiPlus, FiSave, FiX, FiSearch } from "react-icons/fi";
import toast from "react-hot-toast";

// Recalculates the totals of a cart after its products changed
const recalculateCart = (cart, products) => ({
    ...cart,
    products,
    total: products.reduce((sum, p) => sum + p.total, 0),
    discountedTotal: products.reduce((sum, p) => sum + (p.discountedTotal ?? p.total), 0),
    totalProducts: products.length,
    totalQuantity: products.reduce((sum, p) => sum + p.quantity, 0),
});

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
        const cart = carts.find((c) => c.id === id);
        // Local carts don't exist on DummyJSON, so we only remove them from our list
        if (cart?.isLocal) {
            setCarts(carts.filter((c) => c.id !== id));
            if (selectedCart?.id === id) setSelectedCart(null);
            toast.success("Cart Deleted Successfully!");
            return;
        }
        try {
            await api.delete(`/carts/${id}`);
            setCarts(carts.filter((cart) => cart.id !== id));
            if (selectedCart?.id === id) setSelectedCart(null);
            toast.success("Cart Deleted Successfully!");
        } catch (error) {
            console.error("Error deleting cart:", error);
            toast.error("Couldn't Delete Cart!");
        }
    };

    const handleView = async (id) => {
        const cart = carts.find((c) => c.id === id);
        // Local carts: show our own copy (a GET would return 404 or old data)
        if (cart?.isLocal) {
            setSelectedCart(cart);
            return;
        }
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
                const cart = carts.find((c) => c.id === editingId);
                let updatedCart;
                if (cart?.isLocal) {
                    // Local cart: get the product details ourselves and merge them into the cart
                    const { data: product } = await api.get(`/products/${productId}`);
                    const addedQuantity = Number(quantity);
                    const existing = cart.products.find((p) => p.id === product.id);
                    let newProducts;
                    if (existing) {
                        newProducts = cart.products.map((p) => {
                            if (p.id !== product.id) return p;
                            const newQuantity = p.quantity + addedQuantity;
                            const total = p.price * newQuantity;
                            return { ...p, quantity: newQuantity, total, discountedTotal: total * (1 - (p.discountPercentage || 0) / 100) };
                        });
                    } else {
                        const total = product.price * addedQuantity;
                        newProducts = [...cart.products, {
                            id: product.id,
                            title: product.title,
                            price: product.price,
                            thumbnail: product.thumbnail,
                            quantity: addedQuantity,
                            total,
                            discountPercentage: product.discountPercentage,
                            discountedTotal: total * (1 - (product.discountPercentage || 0) / 100),
                        }];
                    }
                    updatedCart = recalculateCart(cart, newProducts);
                } else {
                    const response = await api.put(`/carts/${editingId}`, { merge: true, products });
                    updatedCart = { ...response.data, isLocal: true };
                }
                setCarts(carts.map((cart) => (cart.id === editingId ? updatedCart : cart)));
                if (selectedCart?.id === editingId) setSelectedCart(updatedCart);
                toast.success("Cart Updated!");
            } else {
                const response = await api.post("/carts/add", { userId: Number(formUserId), products });
                // DummyJSON gives every new cart the same id, so we create a unique one
                setCarts([{ ...response.data, id: Date.now(), isLocal: true }, ...carts]);
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
                // Only filter when the user id is a real positive number
                if (Number(userId) >= 1) {
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
        <Container className="page-container">
            <DashboardNav />
            <h1 className="page-heading">Carts Dashboard</h1>

            <section className="panel form-panel">
            <h2 className="panel-title">{editingId ? `Update cart ${editingId}` : "Add a cart"}</h2>
            <Form onSubmit={handleSubmit}>
                <Row className="g-2">
                <Col xs={12} sm={4} md={3}>
                <Form.Control
                    type="number"
                    min="1"
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
                    min="1"
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
                    min="1"
                    placeholder="Quantity"
                    aria-label="Quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                />
                </Col>
                <Col xs={12} md={3} className="d-grid">
                <Button type="submit">
                    {editingId ? <><FiSave aria-hidden="true" /> Save Changes</> : <><FiPlus aria-hidden="true" /> Add Cart</>}
                </Button>
                </Col>
                </Row>
            </Form>
            </section>

            {selectedCart && (
                <section className="panel detail-panel">
                    <div className="d-flex justify-content-between align-items-start gap-2 mb-2">
                        <h2 className="panel-title mb-0">Cart {selectedCart.id} details (User {selectedCart.userId})</h2>
                        <Button variant="light" className="btn-icon" aria-label="Close cart details" title="Close" onClick={() => setSelectedCart(null)}>
                            <FiX aria-hidden="true" />
                        </Button>
                    </div>
                    <Table responsive size="sm" className="data-table">
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
                    <p className="detail-total">Cart total: ${selectedCart.total.toFixed(2)}</p>
                </section>
            )}

            <div className="toolbar">
                <div className="input-icon">
                    <FiSearch aria-hidden="true" />
                    <Form.Control
                        type="number"
                        min="1"
                        placeholder="Filter by user ID"
                        aria-label="Filter by user ID"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                    />
                </div>
            </div>
            {loading ? (
                <TableSkeleton columns={6} />
            ) : (
                <section className="panel table-panel">
                <Table hover responsive className="data-table">
                    <thead>
                        <tr>
                            <th>Cart ID</th>
                            <th>User ID</th>
                            <th>Products</th>
                            <th>Quantity</th>
                            <th>Total</th>
                            <th className="text-end">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {carts.length === 0 && (
                            <tr><td colSpan={6} className="text-center text-secondary-muted py-4">No carts found.</td></tr>
                        )}
                        {carts.map((cart) => (
                            <tr key={cart.id}>
                                <td className="text-secondary-muted">{cart.id}</td>
                                <td>{cart.userId}</td>
                                <td>{cart.totalProducts}</td>
                                <td>{cart.totalQuantity}</td>
                                <td className="fw-medium">${cart.total.toFixed(2)}</td>
                                <td>
                                    <div className="table-actions">
                                    <Button variant="light" className="btn-icon" title="View" aria-label={`View cart ${cart.id}`} onClick={() => handleView(cart.id)}><FiEye aria-hidden="true" /></Button>
                                    <Button variant="light" className="btn-icon" title="Edit" aria-label={`Edit cart ${cart.id}`} onClick={() => handleEdit(cart)}><FiEdit2 aria-hidden="true" /></Button>
                                    <Button variant="light" className="btn-icon btn-icon-danger" title="Remove" aria-label={`Remove cart ${cart.id}`} onClick={() => handleDelete(cart.id)}><FiTrash2 aria-hidden="true" /></Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                </section>
            )}
        </Container>
    );
}
