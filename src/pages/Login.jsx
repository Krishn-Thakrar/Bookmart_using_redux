import React, { useEffect } from "react";
import { Button, Divider, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import authService from "../service/auth.service";
import { toast } from "react-toastify";
import { Link, useLocation, useNavigate } from "react-router-dom";
// import { useAuthContext } from "../context/auth";
import { setUser } from "../store/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import shared from "../utils/shared";

export default function Login(){
    const navigate = useNavigate()
    // const authContext = useAuthContext();
    const { pathname }  = useLocation();
    const authData = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();

    useEffect(() => {
        const str = JSON.parse(localStorage.getItem("user"));
        if (str?.id) {
            dispatch(setUser(str));
            navigate("/productlist");
        }
        const access = shared.hasAccess(pathname,authData);
        if (!access) {
            navigate("/");
            return;
        }
    }, []);
    
    const initialValues = {
        email: '',
        password: '',
    }

    const validationSchema = yup.object().shape({
        email: yup.string()
        .email("Invalid email address format.")
        .required("Email is required."),
        password: yup.string()
        .min(5, "Minimum 5 characters are required.")
        .required("Password is required."),
    })

    const onSubmit = (values) => {
        authService.login(values).then((values)=>{
            delete values._id;
            delete values.__v;
            dispatch(setUser(values))
            navigate("/productlist")
            toast.success("Logged in successfully");
            toast.info("Welcome to Bookmart")
        }).catch((error)=>{
            console.log(error)
            toast.error(error.response.data.error)
        })
    };
    return(
        <>
        <div style={{marginTop: "15px"}}>
            <center>
                Home &nbsp; {">"} &nbsp; Login
                <h1>
                    Login or Create an Account
                </h1>
            </center>
        </div>
        <div style={{display: "flex", justifyContent: "space-evenly", marginTop: "10px"}}>
            <div>
                <h3>New Customer</h3>
                <Divider style={{marginBottom: "20px"}} />
                Registration is free and easy.
                <ul>
                    <li>Faster Checkout</li>
                    <li>Save Multiple shipping addresses</li>
                    <li>View and track orders and more</li>
                </ul>
                <Link to="/register">
                    <Button variant="contained" style={{marginTop: "80px"}}>Create An Account</Button>
                </Link>
            </div>
            <div>
                <h3>Registered Customers</h3>
                <Divider style={{marginBottom: "20px"}} />
                <p>If you have account with us, please log in.</p>
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}
                >
                    {({
                        values,
                        errors,
                        touched,
                        handleBlur,
                        handleChange,
                        handleSubmit,
                    }) =>
                    <form onSubmit={handleSubmit}>
                    <TextField label="E-mail" name="email" style={{position:"relative"}} onChange={handleChange} onBlur={handleBlur}/>
                    <p style={{position:"relative", color:"red", lineHeight:"2px", fontSize:"14px"}}>{errors.email}</p>
                    <TextField label="Password" name="password" type="password" style={{position:"relative"}} onChange={handleChange} onBlur={handleBlur} />
                    <p style={{position:"relative", color:"red", lineHeight:"2px", fontSize:"14px"}}>{errors.password}</p> <br />
                    <Button variant="contained" type="submit">Login</Button>
                    </form>
                    }
                </Formik>
            </div>
        </div>
        </>
    );
}