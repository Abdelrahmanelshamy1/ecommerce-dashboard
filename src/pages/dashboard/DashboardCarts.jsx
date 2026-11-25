import { useEffect, useState } from "react";
import DashboardNav from "../../components/DashboardNav";
import { api } from "../../api/api";
import { Table, Button, Form } from "react-bootstrap";
import toast from "react-hot-toast";

export default function DashboardCarts() {
    const [carts, setCarts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState("");

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