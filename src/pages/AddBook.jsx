import React, { useEffect, useState } from "react";
import categoryService from "../service/category.service";
import bookService from "../service/book.service";
import { useNavigate, useParams } from "react-router-dom";
import { Formik } from "formik";
import { Button, FormControl, Input, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import * as Yup from "yup";
import { toast } from "react-toastify";

function AddBook() {
    const { id } = useParams();
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    const initialValues = {
        name: "",
        price: "",
        categoryId: 0,
        description: "",
        base64image: "",
    };
    const [initialValuestate, setInitialValueState] = useState(initialValues);

    useEffect(() => {
        if (id) {
          getBookById();
        }
        categoryService.getAll().then((res) => {
          setCategories(res);
        });
    }, [id]);

    const getBookById = () => {
        bookService.getById(Number(id)).then((res) => {
          setInitialValueState({
            id: res.id,
            name: res.name,
            price: res.price,
            categoryId: res.categoryId,
            description: res.description,
            base64image: res.base64image,
          });
        });
    };

    const validate = Yup.object({
        name: Yup.string().required("Book name is required"),
        description: Yup.string().required("Description is required"),
        categoryId: Yup.number()
          .min(1, "Category is required")
          .required("Category is required"),
        price: Yup.number().required("Price is required"),
        base64image: Yup.string().required("Image is required"),
    });

    const onSubmit = (values) => {
        bookService
          .save(values)
          .then(() => {
            toast.success(
              values.id
                ? "Record update successfully"
                : "Record creates successfully"
            );
            navigate("/book");
          })
          .catch((e) => console.log(e));
    };

    const onSelectFile = (e, setFieldValue, setFiledError) => {
        const files = e.target.files;
        if (files?.length) {
          const fileSelected = e.target.files[0];
          const fileNameArray = fileSelected.name.split(".");
          const extension = fileNameArray.pop();
          if (["png", "jpg", "jpeg"].includes(extension?.toLowerCase())) {
            if (fileSelected.size > 50000) {
              toast.error("File size must be less then 50KB");
              return;
            }
            const reader = new FileReader();
            reader.readAsDataURL(fileSelected);
            reader.onload = function () {
              setFieldValue("base64image", reader.result);
            };
    
            reader.onerror = function (error) {
              throw error;
            };
          } else {
            toast.error("only jpg, jpeg and png files are allowed");
          }
        } else {
          setFieldValue("base64image", "");
        }
    };

    return(
        <>
            {id ? (<center><h1>Edit Book</h1></center>) : (<center><h1>Add Book</h1></center>)}
            <Formik
                initialValues={initialValuestate}
                validationSchema={validate}
                onSubmit={onSubmit}
                enableReinitialize={true}
            >
                {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    setFieldValue,
                    setFiledError,
                }) => (
                    <form onSubmit={handleSubmit}>
                        <div className="np" style={{display: "flex", justifyContent: "space-around"}}>
                          <TextField label="Book Name" name="name" value={values.name} style={{position:"relative"}} onChange={handleChange} onBlur={handleBlur}/>
                          <TextField label="Book Price" name="price" value={values.price} style={{position:"relative"}} onChange={handleChange} onBlur={handleBlur}/>
                        </div>
                        <div className="npe" style={{display: "flex", justifyContent: "space-around"}}>
                          <p style={{position:"relative", color:"red", lineHeight:"2px", fontSize:"14px"}}>{errors.name}</p>
                          <p style={{position:"relative", color:"red", lineHeight:"2px", fontSize:"14px"}}>{errors.price}</p>
                        </div>
                        <br /><br />
                        <div className="cf" style={{display: "flex", justifyContent: "space-evenly"}}>
                          <FormControl style={{width:"30dvh", marginLeft : "175px"}}>
                              <InputLabel>Category</InputLabel>
                              <Select
                                  name="categoryId"
                                  label="Category"
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  value={values.categoryId}
                              >
                                  {categories?.map((rl) => (
                                      <MenuItem value={rl.id} key={"categories" + rl.id}>
                                          {rl.name}
                                      </MenuItem>
                                  ))}
                              </Select>
                          </FormControl>
                          <div className="file" style={{marginLeft: "425px"}}>
                            {!values.base64image && (
                                <>
                                    <Input
                                        type="file"
                                        size="small"
                                        onBlur={handleBlur}
                                        onChange={(e) => {
                                            onSelectFile(e, setFieldValue, setFiledError);
                                        }}
                                    />
                                    <Button variant="contained">Upload</Button>
                                </>
                            )}
                            {values.base64image && (
                                <div>
                                    <img src={values.base64image} alt="" style={{ height: "140px", width: "100px" }} /> <br />
                                    <Button variant="contained" onClick={() => {setFieldValue("base64image", "");}}>Delete Image</Button>
                                </div>
                            )}
                          </div>
                        </div>
                        <div className="cfe" style={{display: "flex", justifyContent: "space-around"}}>
                          <p style={{position:"relative", color:"red", lineHeight:"2px", fontSize:"14px"}}>{errors.categoryId}</p>
                          <p style={{position:"relative", color:"red", lineHeight:"2px", fontSize:"14px"}}>{errors.base64image}</p>
                        </div>
                        <br /><br />
                        <TextField label="Book Description" name="description" multiline rows={5} value={values.description} style={{position:"relative", marginLeft: "250px", width: "140dvh"}} onChange={handleChange} onBlur={handleBlur}/><br /><br />
                        <center>
                          <Button variant="contained" type="submit">Save</Button>
                          <Button variant="contained" onClick={() => {navigate("/book")}}>Cancel</Button>
                        </center>
                    </form>
                )}
            </Formik>
        </>
    );
}

export default AddBook;