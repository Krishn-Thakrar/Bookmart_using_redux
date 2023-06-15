import React, { useState } from "react";
// import { useAuthContext } from "../context/auth";
import userService from "../service/user.service";
import shared from "../utils/shared";
import { Formik } from "formik";
import * as Yup from "yup";
import { Button, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { setUser } from "../store/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";

function UpdateProfile() {
    const navigate = useNavigate();
    // const authContext = useAuthContext();
    const authData = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();
    // const { user } = useAuthContext();

    const initialValuestate = {
        firstName: authData.firstName,
        lastName: authData.lastName,
        email: authData.email,
        newPassword: "",
        confirmPassword: "",
    };

    const [updatePassword, setUpdatePassword] = useState(false);

    const validate = Yup.object().shape({
        firstName: Yup.string()
            .min(2, "Too Short!")
            .max(50, "Too Long!")
            .required("FirstName is Required"),
        lastName: Yup.string()
            .min(2, "Too Short!")
            .max(50, "Too Long!")
            .required("LastName is Required"),
        email: Yup.string().email("Invalid email").required("Email is Required"),
        newPassword: Yup.string().min(5, "minimum 5 Charator is required"),
        confirmPassword: updatePassword
            ? Yup.string()
                .required("Required")
                .oneOf([Yup.ref("newPassword")], "Passwords not match")
            : Yup.string().oneOf([Yup.ref("newPassword")], "Passwords is not match"),
    });

    const onSubmit = async (values) => {
        const password = values.newPassword ? values.newPassword : authData.password;
        delete values.confirmPassword;
        delete values.newPassword;
        const updatedData = { ...authData, ...values, password };
        const res = await userService.updateProfile(updatedData);
        if (res) {
        //   authContext.setUser(res.data.reult);
          dispatch(setUser(res.data.result));
          toast.success(shared.messages.UPDATED_SUCCESS);
          navigate("/");
        }
    };

    return(
        <>
            <center><h1>Update Profile</h1></center>
            <Formik
                initialValues={initialValuestate}
                validationSchema={validate}
                enableReinitialize={true}
                onSubmit={onSubmit}
            >
                {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    isSubmitting,
                }) => (
                    <form onSubmit={handleSubmit}>
                        <div className="fl" style={{display: "flex", justifyContent: "center", columnGap: "300px"}}>
                            <TextField value={values.firstName} label="First Name" name="firstName" onChange={handleChange} onBlur={handleBlur} />
                            <TextField value={values.lastName} label="Last Name" name="lastName" onChange={handleChange} onBlur={handleBlur} />
                        </div>
                        <div className="fle" style={{display: "flex", justifyContent: "center", columnGap: "400px"}}>
                        <p style={{position:"relative", color:"red", lineHeight:"2px", fontSize:"14px"}}>{errors.firstName}</p>
                        <p style={{position:"relative", color:"red", lineHeight:"2px", fontSize:"14px"}}>{errors.lastName}</p>
                        </div>
                        <br /><br />
                        <div className="email" style={{marginLeft: "365px"}}>
                            <TextField value={values.email} label="Email" name="email" onChange={handleChange} onBlur={handleBlur} />
                            <p style={{position:"relative", color:"red", lineHeight:"2px", fontSize:"14px"}}>{errors.email}</p>
                        </div>
                        <br /><br />
                        <div className="pass" style={{display: "flex", justifyContent: "center", columnGap: "300px"}}>
                            <TextField value={values.newPassword} label="New Password" name="newPassword" onChange={handleChange} onBlur={handleBlur} />
                            <TextField value={values.confirmPassword} label="Confirm Password" name="confirmPassword" onChange={handleChange} onBlur={handleBlur} />
                        </div>
                        <div className="passe" style={{display: "flex", justifyContent: "center", columnGap: "380px"}}>
                        <p style={{position:"relative", color:"red", lineHeight:"2px", fontSize:"14px"}}>{errors.newPassword}</p>
                        <p style={{position:"relative", color:"red", lineHeight:"2px", fontSize:"14px"}}>{errors.confirmPassword}</p>
                        </div>
                        <br /><br />
                        <div className="button" style={{display: "flex", justifyContent: "center", columnGap: "50px"}}>
                            <Button variant="contained" type="submit">Save</Button>
                            <Button variant="contained" onClick={() => {navigate("/product-list")}}>Cancel</Button>
                        </div>
                    </form>
                )}
            </Formik>
        </>
    );
}

export default UpdateProfile;