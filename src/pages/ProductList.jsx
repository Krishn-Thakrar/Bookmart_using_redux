import React, { useEffect, useMemo, useState } from 'react'
import { defaultFilter } from "../utils/filter";
import bookService from "../service/book.service";
import categoryService from '../service/category.service';
import { Button, Divider, FormControl, InputLabel, MenuItem, Pagination, Select, TextField } from '@mui/material';
import shared from "../utils/shared";
// import { useAuthContext } from "../context/auth";
// import { useCartContext } from "../context/cart";
import { toast } from 'react-toastify';
import { fetchCartData } from "../store/slices/cartSlice";
import { useDispatch, useSelector } from 'react-redux';

function ProductList(){
  const [filters, setFilters] = useState(defaultFilter);
  const [categories, setCategories] = useState([]);
  const [sortBy, setSortBy] = useState();
  // const authContext = useAuthContext();
  // const cartContext = useCartContext();
  const [response, setResponse] = useState({
    pageIndex: 0,
    pageSize: 10,
    totalPages: 1,
    items: [],
    totalItems: 0,
  });
  const authData = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();

  useEffect(() => {
    getAllCategories();
  }, []);
  
  const searchAll = (filters) => {
    bookService.getAll(filters).then((res) => {
      setResponse(res);
    })
  };

  useEffect(() => {
    if (filters.keyword === "") {
      delete filters.keyword;
    }
    searchAll({ ...filters });
  }, [filters]);

  const getAllCategories = async () => {
    await categoryService.getAll().then((res) => {
      if (res) {
        setCategories(res);
      }
    });
  };

  const books = useMemo(() => {
    const bookList = [...response.items];
    if (bookList) {
      bookList.forEach((element) => {
        element.category = categories.find(
          (a) => a.id === element.categoryId
        )?.name;
      });
      return bookList;
    }
    return [];
  }, [categories, response]);

  const sortBook = (e) => {
    setSortBy(e.target.value);
    let bookList = [...response.items];
    if (e.target.value === "a-z") {
      bookList.sort((a, b) => a.name.localeCompare(b.name));
    }
    if (e.target.value === "z-a") {
      bookList.sort((a, b) => b.name.localeCompare(a.name));
    }
    setResponse({ ...response, items: bookList });
  };

  const addToCart = (book) => {
    shared
      .addToCart(book, authData.id)
      .then((res) => {
        if (res.error) {
          toast.error(res.message);
        } else {
          // cartContext.updateCart();
          dispatch(fetchCartData(authData.id));
          toast.success(res.message);
        }
      })
      .catch((err) => {
        toast.warning(err);
      });
  };

  return (
    <div>
      <center><h1>Book List</h1></center>
      <Divider />
      <div style={{display: "flex", justifyContent: "space-between", marginTop: "10px"}}>
        <div className="total">
          <p> Total - {response.totalItems} items</p>
        </div>
        <div className="ss" style={{display: "flex", columnGap: "10px"}}>
          <TextField label="Search" variant="outlined" onChange={(e) => {setFilters({...filters, keyword: e.target.value, pageIndex: 1,});}} />
          <FormControl style={{width: "10ch"}}>
            <InputLabel>Sort By</InputLabel>
            <Select value={sortBy} onChange={sortBook}>
              <MenuItem value="a-z">a - z</MenuItem>
              <MenuItem value="z-a">z - a</MenuItem>
            </Select>
          </FormControl>
        </div>
      </div>
      <div className="all">
        {books.map((book, index) => (
          <div className="container" key={index} style={{marginTop: "20px", border: "1px solid black",borderRadius: "2%", padding: "20px", display: "flex", justifyContent: "space-between"}}>
            <div className="image" style={{display: "flex", flexDirection: "column", width: "30%"}}>
              <center>
                <img src={book.base64image} alt="Book Image" style={{width: "-webkit-fill-available", height: "100%"}}/>
              </center>
            </div>
            <div className="content" style={{display: "flex", flexDirection: "column", width: "50%"}}>
              <center>
                <h2>{book.name}</h2>
                <p>
                  {book.category}<br />
                  {book.description}<br />
                </p>
                <p style={{fontWeight: "bold"}}>
                  MRP {book.price}
                </p>
              </center>
            </div>
            <div className="button" style={{paddingTop: "3vh"}}>
            <Button variant="contained" onClick={() => addToCart(book)}>Add to Cart</Button>
            </div>
          </div>
        ))}
      </div>
      <div className="pagination">
        <center>
          <Pagination color="success" count={response.totalPages} page={filters.pageIndex} onChange={(e, newPage) => {setFilters({...filters, pageIndex: newPage,});}} />
        </center>
      </div>
    </div>
  );
};

export default ProductList;
