import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Table, Row, Col } from "react-bootstrap";
import { removeFromCart, clearCart } from "../store/slices/cartSlice";
import toast from "react-hot-toast";


export default function Cart() {
    const cartItems = useSelector((state) => state.cart.items);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    return (
        <>
            {cartItems.length === 0 ? (<div className="empty-state souq-surface">
                <p className="fs-5 text-muted">Your cart is empty.</p>
                <Button size="lg" onClick={() => navigate("/products")}>
                    Continue Shopping
                </Button>
                </div>
            ) : (
                <>
                <h1 className="page-title">Cart</h1>
                <Row className="g-4">
                <Col xs={12} lg={8}>
                <div className="table-surface souq-surface">
                <Table hover responsive className="align-middle">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th>Subtotal</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {cartItems.map((item) => (
                            <tr key={item.id}>
                                <td className="fw-semibold">{item.title}</td>
                                <td>${item.price.toFixed(2)}</td>
                                <td>{item.quantity}</td>
                                <td className="fw-semibold">${(item.price * item.quantity).toFixed(2)}</td>
                                <td className="text-end">
                                    <Button variant="outline-danger" size="sm" onClick={() => {
                                          dispatch(removeFromCart(item.id));
                                          toast.success("Item removed!");
                                    }}>
                                        Remove
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                </div>
                </Col>
                <Col xs={12} lg={4}>
                <div className="cart-summary souq-surface">
                <h3 className="h4 mb-4">Total: ${totalPrice.toFixed(2)}</h3>
                <Button size="lg" className="w-100" onClick={() => {
                    dispatch(clearCart());
                    toast.success("Order placed successfully!");
                    navigate("/");
                }}>
                    Proceed to Checkout
                </Button>
                </div>
                </Col>
                </Row>
                </>
            )}
        </>
    );
}
