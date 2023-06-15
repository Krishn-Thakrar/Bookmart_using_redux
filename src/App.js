import { BrowserRouter, Route, Routes } from "react-router-dom";
import React from "react";
import Login from "./pages/Login";
import ProductList from "./pages/ProductList";
import Register from "./pages/Register";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import SearchBar from "./components/SearchBar";
import Book from "./pages/Book";
import AddBook from "./pages/AddBook"
import Categories from "./pages/Categories";
import AddCategories from "./pages/AddCategories";
import User from "./pages/User";
import EditUser from "./pages/EditUser";
import CartPage from "./pages/CartPage";
import UpdateProfile from "./pages/UpdateProfile";
import { Provider, useSelector } from "react-redux";
import store from "./store/store";
import gif from "./assets/gif1.gif";
import "./App.css";

function App(){
  const authData = useSelector((state) => state.auth.user);
  return(
    <>
      <div className="main">
        <BrowserRouter>
          <Provider store={store}>
            <ToastContainer />
            <div className="loader-wrapper" id="load">
              <img src={gif} alt="Loading...." />
            </div>
            <Header />
            <SearchBar />
            <Routes>
              <Route path="/" Component={Login}></Route>
              <Route path="/register" Component={Register}></Route>
              <Route path="/productlist" Component={authData.id ? ProductList : Login}></Route>
              <Route path="/login" Component={Login}></Route>
              <Route path="/book" Component={authData.id ? Book : Login}></Route>
              <Route path="/add-book" Component={authData.id ? AddBook : Login}></Route>
              <Route path="/add-book/:id" Component={authData.id ? AddBook : Login}></Route>
              <Route path="/categories" Component={authData.id ? Categories : Login}></Route>
              <Route path="/add-category" Component={authData.id ? AddCategories : Login}></Route>
              <Route path="/add-category/:id" Component={authData.id ? AddCategories : Login}></Route>
              <Route path="/user" Component={authData.id ? User : Login}></Route>
              <Route path="/edit-user/:id" Component={authData.id ? EditUser : Login}></Route>
              <Route path="/cart-page" Component={authData.id ? CartPage : Login}></Route>
              <Route path="/update-profile" Component={authData.id ? UpdateProfile : Login}></Route>
            </Routes>
            <Footer />
          </Provider>
        </BrowserRouter>
      </div>
    </>
  );
}

export default App;