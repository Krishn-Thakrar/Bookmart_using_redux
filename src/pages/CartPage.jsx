import React, { useEffect, useState } from "react";
import cartService from "../service/cart.service";
import orderService from "../service/order.service";
// import { useAuthContext } from "../context/auth";
// import { useCartContext } from "../context/cart";
import shared from "../utils/shared";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchCartData, removeFromCart, setCartData } from "../store/slices/cartSlice";
import { useDispatch, useSelector } from "react-redux";

const CartPage = () => {
  // const authContext = useAuthContext();
  // const cartContext = useCartContext();
  const navigate = useNavigate();
  const [cartList, setCartList] = useState([]);
  const [itemsInCart, setItemsInCart] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const cartData = useSelector((state) => state.cart.cartData);
  const authData = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  const getTotalPrice = (itemList) => {
    let totalPrice = 0;
    console.log(itemList);
    itemList.forEach((item) => {
      const itemPrice = item.quantity * parseInt(item.book.price);
      totalPrice = totalPrice + itemPrice;
    });
    setTotalPrice(totalPrice);
  };

  // useEffect(() => {
  //   setCartList(cartContext.cartData);
  //   setItemsInCart(cartContext.cartData.length);
  //   getTotalPrice(cartContext.cartData);
  // }, [cartContext.cartData]);

  useEffect(() => {
    setCartList(cartData);
    setItemsInCart(cartData.length);
    getTotalPrice(cartData);
  }, [cartData]);

  const removeItem = async (id) => {
    try {
      const res = await cartService.removeItem(id);
      if (res) {
        dispatch(removeFromCart(id));
        // cartContext.updateCart();
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  const updateQuantity = async (cartItem, inc) => {
    const currentCount = cartItem.quantity;
    const quantity = inc ? currentCount + 1 : currentCount - 1;
    if (quantity === 0) {
      toast.error("Item quantity should not be zero");
      return;
    }

    try {
      const res = await cartService.updateItem({
        id: cartItem.id,
        userId: cartItem.userId,
        bookId: cartItem.book.id,
        quantity,
      });
      if (res) {
        const updatedCartList = cartList.map((item) =>
          item.id === cartItem.id ? { ...item, quantity } : item
        );
        dispatch(setCartData(updatedCartList));
        // cartContext.updateCart(updatedCartList);
        const updatedPrice =
          totalPrice +
          (inc
            ? parseInt(cartItem.book.price)
            : -parseInt(cartItem.book.price));
        setTotalPrice(updatedPrice);
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  const placeOrder = async () => {
    if (authData.id) {
      const userCart = await cartService.getList(authData.id);
      if (userCart.data.result.length) {
        try {
          let cartIds = userCart.data.result.map((element) => element.id);
          const newOrder = {
            userId: authData.id,
            cartIds,
          };
          const res = await orderService.placeOrder(newOrder);
          if (res) {
            dispatch(fetchCartData(authData.id));
            // cartContext.updateCart();
            navigate("/productlist");
            toast.success(shared.messages.ORDER_SUCCESS);
          }
        } catch (error) {
          toast.error(`Order cannot be placed ${error}`);
        }
      } else {
        toast.error("Your cart is empty");
      }
    }
  };

  return (
    <>
    <div>
      <center><h1>CartPage</h1></center>
      <p>Total - {itemsInCart} items</p>
      <p>Total price: {totalPrice}</p>
      <div>
        {cartList.map((cartItem) => {
          return(
            <div>
              <div key={cartItem.id} style={{display: "flex", justifyContent: "space-evenly", border: "1px solid black", borderRadius: "2%", padding: "20px"}}>
                <div className="img">
                  <img src={cartItem.book.base64image} alt="Book" />
                </div>
                <div className="content">
                  <p>Book name : {cartItem.book.name} </p>
                  <div className="button" style={{display: "flex"}}>
                    <Button variant="contained" onClick={() => updateQuantity(cartItem, true)}>+</Button> &nbsp; &nbsp;
                    <p>{cartItem.quantity}</p>&nbsp; &nbsp;
                    <Button variant="contained" onClick={() => updateQuantity(cartItem, false)}>-</Button>
                  </div>
                </div>
                <div className="pr">
                  <div className="pay">
                    <p>MRP &#8377; {cartItem.book.price}</p>
                  </div>
                  <div className="remove">
                    <Button variant="outlined" onClick={() => removeItem(cartItem.id)}>Remove</Button>
                  </div>
                </div>
              </div>
              <br /> <br />
            </div>
          );
        })}
      </div>
      <div className="placeorder">
        <Button variant="contained" onClick={placeOrder}>Place Order</Button>
      </div>
    </div>
    </>
  );
}

export default CartPage;