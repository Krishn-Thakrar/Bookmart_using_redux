import React, { useState } from "react";
import { Button, TextField, List, ListItem } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import CancelIcon from '@mui/icons-material/CancelOutlined';
import bookService from "../service/book.service";
// import { useState } from "react";
// import { useAuthContext } from "../context/auth";
// import { useCartContext } from "../context/cart";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import shared from "../utils/shared";
import { fetchCartData } from "../store/slices/cartSlice";
import { useDispatch, useSelector } from "react-redux";

function SearchBar() {
    const [query, setQuery] = useState("");
    const [bookList, setBookList] = useState([]);
    const [openSearchResult, setOpenSearchResult] = useState(false);

    const searchBook = async () => {
        const res = await bookService.searchBook(query);
        setBookList(res.data.result);
    };

    const search = () => {
        searchBook();
        setOpenSearchResult(true);
    };

    const navigate = useNavigate();
    // const authContext = useAuthContext();
    // const cartContext = useCartContext();
    const authData = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();

    const addToCart = (book) => {
        if (!authData.id) {
          navigate("/login");
          toast.error("Please login before adding books to cart");
        } else {
          shared
            .addToCart(book, authData.id)
            .then((res) => {
              if (res.error) {
                toast.error(res.error);
              } else {
                toast.success("Item added in cart");
                dispatch(fetchCartData(authData.id));
                // cartContext.updateCart();
              }
            })
            .catch((err) => {
              toast.warning(err);
            });
        }
    };

    return (
        <>
            <div style={{ display: "flex", justifyContent: "center", columnGap: "10px" }}>
                <TextField id="outlined-basic" label="What are you looking for..." variant="outlined" style={{ height: "20px" }} onChange={(e) => { setQuery(e.target.value); }} />
                <Button variant="contained" color="success" startIcon={<SearchIcon />} style={{ height: "55px" }} onClick={search} >Search</Button>
                <Button variant="contained" color="error" startIcon={<CancelIcon />} style={{ height: "55px" }} onClick={() => { setOpenSearchResult(false); setQuery(); }} >Cancel</Button>
            </div>
            {openSearchResult && (
                <div style={{ position: "absolute", padding: "15px", borderRadius: "5px", backgroundColor: "aquamarine"}}>
                    {bookList?.length === 0 ? (<p>No Product Found</p>) : (
                    <List>
                        {bookList?.length > 0 && bookList.map((item, index) => (
                            <ListItem key={index}>
                                <div>
                                    <div>
                                        <p>{item.name}</p>
                                        <p>{item.description}</p>
                                    </div>
                                    <div>
                                        <p>{item.price}</p>
                                        <Button sx={{ color: "#f14d54", textTransform: "capitalize" }} onClick={() => addToCart(item)} >
                                            Add to Cart
                                        </Button>
                                    </div>
                                </div>
                            </ListItem>
                        ))}
                    </List>
                    )}
                </div>
            )}
        </>
    );
};

export default SearchBar;