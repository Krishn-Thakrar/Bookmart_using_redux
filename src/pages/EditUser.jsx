import React, { useEffect, useState } from "react";
import userService from "../service/user.service";
import shared from "../utils/shared";
import { useNavigate, useParams } from "react-router-dom";
// import { useAuthContext } from "../context/auth";
import { toast } from "react-toastify";
import { Formik } from "formik";
import * as Yup from "yup";
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";

function EditUser(){
    const { id } = useParams();
    const navigate = useNavigate();
    // const authContext = useAuthContext();
    const [roles, setRoles] = useState([]);
    const [user, setUser] = useState();
    // const [selectedId, setSelectedId] = useState(0);

    const initialValues = {
        email: "",
        lastName: "",
        firstName: "",
        roleId: 0,
    }

    const [initialValuestate, setInitialValueState] = useState(initialValues);

    useEffect(() => {
        getRoles();
    }, []);

    useEffect(() => {
        if (id) {
          getUserById();
        }
    }, [id]);

    useEffect(() => {
        if (user && roles.length) {
          const roleId = roles.find((role) => role.name === user?.role)?.id;
    
          setInitialValueState({
            id: user.id,
            email: user.email,
            lastName: user.lastName,
            firstName: user.firstName,
            roleId,
            password: user.password,
          });
        }
    }, [user, roles]);
    
    const validationSchema = Yup.object().shape({
        email: Yup.string()
          .email("Invalid email address format")
          .required("Email is required"),
        firstName: Yup.string().required("First Name is required"),
        lastName: Yup.string().required("Last Name is required"),
        roleId: Yup.number().required("Role is required"),
    });

    const getUserById = () => {
        userService.getById(Number(id)).then((res) => {
            if (res) {
                setUser(res.data.result);
            }
          });
    };

    const getRoles = () => {
        userService.getAllRoles().then((res) => {
          if (res) {
            setRoles(res.data.result);
          }
        });
    };

    const onSubmit = (values) => {
        const updatedValue = {
            ...values,
            role: roles.find((r) => r.id === values.roleId).name,
        };
        userService.update(updatedValue).then((res) => {
            toast.success(shared.messages.UPDATED_SUCCESS);
            navigate("/user");
        }).catch((e) => {
            toast.error(e);
            toast.error(shared.messages.UPDATED_FAIL);
        });
    };
    
    return(
        <>
            <center><h1>Edit User</h1></center>
            <Formik
                initialValues={initialValuestate}
                validationSchema={validationSchema}
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
                        <div className="fl" style={{display: "flex", justifyContent: "space-evenly"}}>
                            <TextField label="Firstname" value={values.firstName} name="firstName" style={{position:"relative"}} onChange={handleChange} onBlur={handleBlur}/><br />
                            <TextField label="Lastname" value={values.lastName} name="lastName" style={{position:"relative"}} onChange={handleChange} onBlur={handleBlur}/>
                        </div>
                        <div className="fle" style={{display: "flex", justifyContent: "space-around"}}>
                            <p style={{position:"relative", color:"red", lineHeight:"2px", fontSize:"14px"}}>{errors.firstName}</p>
                            <p style={{position:"relative", color:"red", lineHeight:"2px", fontSize:"14px"}}>{errors.lastName}</p>
                        </div>
                        <div className="re" style={{marginLeft: "31ch"}}>
                            <TextField label="E-mail" name="email" value={values.email} style={{position:"relative"}} onChange={handleChange} onBlur={handleBlur}/>
                            <p style={{position:"relative", color:"red", lineHeight:"2px", fontSize:"14px", marginLeft: "5ch"}}>{errors.email}</p>
                            <FormControl style={{width:"30dvh"}}>
                            <InputLabel>Role</InputLabel>
                            <Select
                                name="roleId"
                                label="Role"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.roleId}
                            >
                                {roles.length > 0 && roles.map((role) => (
                                    <MenuItem value={role.id} key={"name" + role.id}>
                                        {role.name}
                                    </MenuItem>
                                ))}
                            </Select>
                            </FormControl>
                            <p style={{position:"relative", color:"red", lineHeight:"2px", fontSize:"14px", marginLeft: "5ch"}}>{errors.roleId}</p>
                        </div>
                        <center>
                            <Button variant="contained" type="submit" style={{marginRight: "20px"}}>Save</Button>
                            <Button variant="contained" onClick={() => {navigate("/user")}}>Cancel</Button>
                        </center>
                    </form>
                )}
            </Formik>
        </>
    );
}

export default EditUser;