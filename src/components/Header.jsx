import React, { useEffect, useMemo, useState } from "react";
import Logo from '../assets/logo.png'
import { Button } from "@mui/material";
import CartImg from '@mui/icons-material/ShoppingCart';
import { Link, useNavigate } from "react-router-dom";
// import { useAuthContext } from "../context/auth";
import shared from "../utils/shared";
import { fetchCartData } from "../store/slices/cartSlice";
import { signOut } from "../store/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
// import { useCartContext } from "../context/cart";

function Header() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cartData = useSelector((state) => state.cart.cartData);
    const authData = useSelector((state) => state.auth.user);
    // const authContext = useAuthContext();
    // const cartContext = useCartContext();

    const logOut = () => {
        // authContext.signOut();
        dispatch(signOut());
    };

    useEffect(() => {
        const userId = authData.id;
        if (userId && cartData.length === 0) {
            dispatch(fetchCartData(userId));
        }
    }, [authData.id, cartData.length, dispatch]);

    const items = useMemo(() => {
        return shared.NavigationItems.filter(
            (item) => (
                !item.access.length || item.access.includes(authData.roleId)
            )
        );
    }, [authData]);
    
    return (
        <>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "25px" }}>
                <div style={{ display: "flex" }}>
                    <div style={{ marginLeft: "50px" }}>
                        <img src={Logo} alt="App Logo" style={{ height: "65px", width: "65px" }} />
                    </div>
                    <div style={{ lineHeight: "5px" }}>
                        <p>
                            <h1>TatvaSoft</h1>
                            Sculpting Thoughts....
                        </p>
                    </div>
                </div>
                <div style={{ display: "flex", columnGap: "10px", marginRight: "15px" }}>
                    {!authData.id && (
                        <>
                            <Link to="/login">
                                <Button variant="text">Login</Button>
                            </Link>
                            <Link to="/register">
                                <Button variant="text">Register</Button>
                            </Link>
                        </>
                    )}
                    {items.map((item, index) => (
                        <>
                            <Button key={index} variant="text" onClick={() => { navigate(item.route); }}>{item.name}</Button>
                        </>
                    ))}
                    <Button variant="outlined" startIcon={<CartImg />} onClick={() => { navigate("/cart-page"); }}>{cartData.length} Cart</Button>
                    {!!authData.id ? (
                        <Button variant="contained" onClick={() => { logOut(); }}>LogOut</Button>
                    ) : null}
                </div>
            </div>
            <br />
        </>
    )
}

export default Header;