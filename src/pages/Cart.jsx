import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { Button, Row, Col, Container } from "react-bootstrap";
import { FiMinus, FiPlus, FiTrash2, FiShoppingBag, FiLock } from "react-icons/fi";
import { removeFromCart, clearCart, increaseQuantity, decreaseQuantity } from "../store/slices/cartSlice";
import toast from "react-hot-toast";


export default function Cart() {
    const cartItems = useSelector((state) => state.cart.items);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    const itemsCount = cartItems.reduce((count, item) => count + item.quantity, 0);

    return (
        <Container className="page-container">
            {cartItems.length === 0 ? (<div className="empty-state panel">
                <FiShoppingBag className="empty-icon" aria-hidden="true" />
                <h1 className="h4">Your cart is empty.</h1>
                <p className="text-secondary-muted">Products you add will appear here.</p>
                <Button size="lg" onClick={() => navigate("/products")}>
                    Continue Shopping
                </Button>
                </div>
            ) : (
                <>
                <h1 className="page-heading">Cart</h1>
                <Row className="g-4">
                <Col xs={12} lg={8}>
                <ul className="cart-list panel" aria-label="Cart items">
                    {cartItems.map((item) => {
                        const atMax = item.quantity >= item.stock;
                        return (
                        <li key={item.id} className="cart-item">
                            <Link to={`/product/${item.id}`} className="cart-thumb">
                                <img src={item.thumbnail} alt={item.title} loading="lazy" />
                            </Link>
                            <div className="cart-info">
                                <Link to={`/product/${item.id}`} className="cart-title">{item.title}</Link>
                                <span className="cart-unit">${item.price.toFixed(2)} each</span>
                            </div>
                            <div className="cart-qty-wrap">
                                <div className="qty-control" role="group" aria-label={`Quantity of ${item.title}`}>
                                    <button type="button" aria-label="Decrease quantity" disabled={item.quantity <= 1}
                                        onClick={() => dispatch(decreaseQuantity(item.id))}>
                                        <FiMinus aria-hidden="true" />
                                    </button>
                                    <span aria-live="polite">{item.quantity}</span>
                                    <button type="button" aria-label="Increase quantity" disabled={atMax}
                                        onClick={() => dispatch(increaseQuantity(item.id))}>
                                        <FiPlus aria-hidden="true" />
                                    </button>
                                </div>
                                {atMax && <small className="qty-hint">Max stock</small>}
                            </div>
                            <div className="cart-subtotal">${(item.price * item.quantity).toFixed(2)}</div>
                            <Button variant="light" className="btn-icon btn-icon-danger cart-remove" aria-label={`Remove ${item.title}`} title="Remove" onClick={() => {
                                  dispatch(removeFromCart(item.id));
                                  toast.success("Item removed!");
                            }}>
                                <FiTrash2 aria-hidden="true" />
                            </Button>
                        </li>
                        );
                    })}
                </ul>
                </Col>
                <Col xs={12} lg={4}>
                <aside className="cart-summary panel" aria-label="Order summary">
                <h2 className="panel-title">Order summary</h2>
                <dl className="summary-rows">
                    <div><dt>Items</dt><dd>{itemsCount}</dd></div>
                    <div><dt>Subtotal</dt><dd>${totalPrice.toFixed(2)}</dd></div>
                    <div className="summary-total"><dt>Total</dt><dd>${totalPrice.toFixed(2)}</dd></div>
                </dl>
                <Button size="lg" className="w-100" onClick={() => {
                    dispatch(clearCart());
                    toast.success("Order placed successfully!");
                    navigate("/");
                }}>
                    <FiLock aria-hidden="true" /> Proceed to Checkout
                </Button>
                </aside>
                </Col>
                </Row>
                </>
            )}
        </Container>
    );
}
