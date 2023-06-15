import React, { useEffect, useState } from "react";
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import authService from "../service/auth.service";
import userService from "../service/user.service";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Register(){
    const navigate = useNavigate()
    const [roleList, setRoleList] = useState([]);

    const initialValues = {
        firstName: '',
        lastName: '',
        roleId: '',
        email: '',
        password: '',
        confirmPassword: '',
    }

    const validationSchema = yup.object().shape({
        firstName: yup.string()
        .required("Firstname is required."),
        lastName: yup.string()
        .required("Lastname is required."),
        roleId: yup.number()
        .required("Role is required"),
        email: yup.string()
        .email("Invalid email address format.")
        .required("Email is required."),
        password: yup.string()
        .min(5, "Minimum 5 characters are required.")
        .required("Password is required."),
        confirmPassword: yup.string()
        .oneOf(
            [yup.ref("password"), null],
            "Password and Confirm password must be matched."
        )
        .required("Confirm password is required."),
    })
    
    const onSubmit = (values) => {
        delete values.confirmPassword;
        authService.create(values).then((values) => {
            toast.success("Registered Successfully")
            navigate("/login")
        }).catch((error)=>{
            console.log(error)
            toast.error(error.response.data.error)
        })
    };

    const getRoles = () => {
        userService.getAllRoles().then((res) => {
            setRoleList(res.data.result);
        }).catch((err) => {
            console.log(err);
        });
    };

    useEffect(() => {
        getRoles();
    }, []);

    return(
        <>
        <div className="newreg">
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
                    <center><h1>Personal Details</h1>
                    <div className="fl" style={{display: "flex", justifyContent: "space-evenly"}}>
                        <TextField label="Firstname" name="firstName" style={{position:"relative"}} onChange={handleChange} onBlur={handleBlur}/><br />
                        <TextField label="Lastname" name="lastName" style={{position:"relative"}} onChange={handleChange} onBlur={handleBlur}/>
                    </div>
                    <div className="fle" style={{display: "flex", justifyContent: "space-around"}}>
                        <p style={{position:"relative", color:"red", lineHeight:"2px", fontSize:"14px"}}>{errors.firstName}</p>
                        <p style={{position:"relative", color:"red", lineHeight:"2px", fontSize:"14px"}}>{errors.lastName}</p>
                    </div>
                    <h1>Login Details</h1>
                    </center>
                    <div className="re" style={{marginLeft: "31ch"}}>
                        <FormControl style={{width:"30dvh"}}>
                        <InputLabel>Role</InputLabel>
                        <Select
                            name="roleId"
                            label="Role"
                            onBlur={handleBlur}
                            onChange={handleChange}
                        >
                            {roleList.length > 0 && roleList.map((role) => (
                                <MenuItem value={role.id} key={"name" + role.id}>
                                    {role.name}
                                </MenuItem>
                            ))}
                        </Select>
                        </FormControl>
                        <p style={{position:"relative", color:"red", lineHeight:"2px", fontSize:"14px", marginLeft: "5ch"}}>{errors.roleId}</p>
                        <TextField label="E-mail" name="email" style={{position:"relative"}} onChange={handleChange} onBlur={handleBlur}/>
                        <p style={{position:"relative", color:"red", lineHeight:"2px", fontSize:"14px", marginLeft: "5ch"}}>{errors.email}</p>
                    </div>
                    <center>
                    <div className="cp" style={{display: "flex", justifyContent: "space-evenly"}}>
                        <TextField label="Password" name="password" type="password" style={{position:"relative", marginLeft: "0ch"}} onChange={handleChange} onBlur={handleBlur} />
                        <TextField label="Confirm Password" name="confirmPassword" type="password" style={{position:"relative", marginLeft: "31ch"}} onChange={handleChange} onBlur={handleBlur}/>
                    </div>
                    <div className="cpe" style={{display: "flex", justifyContent: "space-around"}}>
                    <p style={{position:"relative", color:"red", lineHeight:"2px", fontSize:"14px", marginLeft: "3ch"}}>{errors.password}</p>
                    <p style={{position:"relative", color:"red", lineHeight:"2px", fontSize:"14px", marginLeft: "8ch"}}>{errors.confirmPassword}</p>
                    </div>
                    <Button variant="outlined" type="submit">Register</Button></center>
                </form>
                }
            </Formik>
        </div>
        </>
    );
}
