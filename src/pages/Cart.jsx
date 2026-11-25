import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Table } from "react-bootstrap";
import { removeFromCart, clearCart } from "../store/slices/cartSlice";
import toast from "react-hot-toast";


export default function Cart() {
    const cartItems = useSelector((state) => state.cart.items);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

    return (
        <>
            {cartItems.length === 0 ? (<>
                <p>Your cart is empty.</p>
                <Button onClick={() => navigate("/products")}>
                    Continue Shopping
                </Button>
                </>
            ) : (
                <>
                <h1>Cart</h1>
                <Table>
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
                                <td>{item.title}</td>
                                <td>${item.price.toFixed(2)}</td>
                                <td>{item.quantity}</td>
                                <td>${(item.price * item.quantity).toFixed(2)}</td>
                                <td>
                                    <Button onClick={() => {
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
                <h3>Total: ${totalPrice.toFixed(2)}</h3>
                <Button onClick={() => {
                    dispatch(clearCart());
                    toast.success("Order placed! Proceeding to checkout!");
                    navigate("/checkout");
                }}>
                    Proceed to Checkout
                </Button>
                </>
            )}
        </>
    );
}
