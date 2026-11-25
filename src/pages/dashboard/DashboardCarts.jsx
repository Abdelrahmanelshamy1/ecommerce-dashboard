import { useEffect, useState } from "react";
import DashboardNav from "../../components/DashboardNav";
import { api } from "../../api/api";
import { Table, Button, Form } from "react-bootstrap";
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
            <h1>Carts Dashboard</h1>

            <h2>{editingId ? `Update cart ${editingId}` : "Add a cart"}</h2>
            <Form onSubmit={handleSubmit}>
                <Form.Control
                    type="number"
                    placeholder="User ID"
                    value={formUserId}
                    onChange={(e) => setFormUserId(e.target.value)}
                    disabled={editingId !== null}
                    required
                />
                <Form.Control
                    type="number"
                    placeholder="Product ID"
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                    required
                />
                <Form.Control
                    type="number"
                    placeholder="Quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                />
                <Button type="submit">{editingId ? "Save Changes" : "Add Cart"}</Button>
            </Form>

            {selectedCart && (
                <div>
                    <h2>Cart {selectedCart.id} details (User {selectedCart.userId})</h2>
                    <Table>
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
                    <p>Cart total: ${selectedCart.total.toFixed(2)}</p>
                    <Button onClick={() => setSelectedCart(null)}>Close</Button>
                </div>
            )}

            <Form.Control
                type="number"
                placeholder="Filter by user ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
            />
            {loading ? (
                <p>Loading...</p>
            ) : (
                <Table>
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
                                    <Button onClick={() => handleView(cart.id)}>View</Button>
                                    <Button onClick={() => handleEdit(cart)}>Edit</Button>
                                    <Button onClick={() => handleDelete(cart.id)}>Remove</Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </>
    );
}