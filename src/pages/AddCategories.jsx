import React, { useEffect, useState } from "react";
import categoryService from "../service/category.service";
import * as Yup from "yup";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Formik } from "formik";
import { Button, TextField } from "@mui/material";

function AddCategories(){
    const { id } = useParams();
    const navigate = useNavigate();
    const initialValues = {
        name: "",
    };

    const [initialValuestate, setInitialValueState] = useState(initialValues);

    useEffect(() => {
        if (id) {
            getCategoryById();
        }
    }, [id]);

    const validate = Yup.object({
        name: Yup.string().required("Category Name is required"),
    });

    const getCategoryById = () => {
        categoryService.getById(Number(id)).then((res) => {
            setInitialValueState({
                id: res.data.result.id,
                name: res.data.result.name,
            });
        });
    };

    const onSubmit = (values) => {
        categoryService.save(values).then((res) => {
            toast.success(values.id ? "Record Updated Successfully" : "Record Created Successfully");
            navigate("/categories");
        }).catch((e) => {
            console.log(e);
            toast.error(e);
        })
    }

    return(
        <>
            {id ? <center><h1>Edit Category</h1></center> : <center><h1>Add Category</h1></center>}
            <Formik
                initialValues={initialValuestate}
                validationSchema={validate}
                onSubmit={onSubmit}
                enableReinitialize={true}>
                    {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        setFieldValue,
                        setFiledError
                    }) => (
                        <form onSubmit={handleSubmit}>
                            <TextField name="name" label="Category Name" onBlur={handleBlur} onChange={handleChange} value={values.name} /><br />
                            <p style={{position:"relative", color:"red", lineHeight:"2px", fontSize:"14px"}}>{errors.name}</p>
                            <br /><br />
                            <Button variant="contained" type="submit" style={{marginRight: "15px"}}>Save</Button>
                            <Button variant="contained" onClick={() => {navigate("/categories")}}>Cancel</Button>
                        </form>
                    )}
            </Formik>
        </>
    );
}

export default AddCategories;