import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    items: []
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action) => {
            const product = action.payload;
            const existingProduct = state.items.find((item) => item.id === product.id);
            if (existingProduct) {
                // never go above the available stock
                if (existingProduct.quantity >= existingProduct.stock) return;
                existingProduct.quantity += 1;
            } else {
                if (product.stock < 1) return;
                state.items.push({ ...product, quantity: 1 });
            }
        },
        increaseQuantity: (state, action) => {
            const item = state.items.find((item) => item.id === action.payload);
            if (!item || item.quantity >= item.stock) return;
            item.quantity += 1;
        },
        decreaseQuantity: (state, action) => {
            const item = state.items.find((item) => item.id === action.payload);
            // quantity never goes below 1: removing is done by the Remove button
            if (!item || item.quantity <= 1) return;
            item.quantity -= 1;
        },
        removeFromCart: (state, action) => {
            const productId = action.payload;
            state.items = state.items.filter((item) => item.id !== productId);
        },
        clearCart: (state) => {
            state.items = [];
        }
    }
});

export const { addToCart, increaseQuantity, decreaseQuantity, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
