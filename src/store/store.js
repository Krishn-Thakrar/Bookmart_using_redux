import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./slices/cartSlice";
import authSliceReducer from "./slices/authSlice"

const store = configureStore({
    reducer: {
        cart: cartReducer,
        auth: authSliceReducer,
    },
});

export default store;