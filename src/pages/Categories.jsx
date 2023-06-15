import React, { useEffect, useState } from "react";
import DialogBox from "../components/DialogBox";
import categoryService from "../service/category.service";
import shared from "../utils/shared";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { defaultFilter, recordsPerpage } from "../utils/filter";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField } from "@mui/material";
import { useSelector } from "react-redux";

function Categories(){
    const navigate = useNavigate();
    const [filters, setFilters] = useState(defaultFilter);
    const [open, setOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(0);
    const [categoryRecords, setCategoryRecords] = useState({
        pageIndex: 0,
        pageSize: 10,
        totalPages: 1,
        items: [],
        totalItems: 0,
    });
    const authData = useSelector((state) => state.auth.user);

    const columns = [
        { id: "name", label: "Category Name"}
    ];

    useEffect(() => {
        if (filters.keyword === ""){
            delete filters.keyword;
        } 
        searchAll({ ...filters });
    }, [filters]);

    const searchAll = (filters) => {
        categoryService.getAll(filters).then((res) => {
            setCategoryRecords(res);
        });
    };

    const onConfirmDelete = async () => {
        await categoryService.deleteCategory(selectedId).then((res) => {
            if (res) {
                toast.success(shared.messages.DELETE_SUCCESS);
                setOpen(false);
                setFilters({ ...filters });
            }
        }).catch((e) => {
            toast.error(e);
            toast.error(shared.messages.DELETE_FAIL);
        });
    };

    return(
        <>
            <center><h1>Categories</h1></center>
            <div style={{display: "flex", justifyContent: "space-between", marginTop: "10px"}}>
                <div className="total">
                    <p> Total - {categoryRecords.totalItems} categories</p>
                </div>
                <div style={{display: "flex", columnGap: "10px"}}>
                    <TextField label="Search" variant="outlined" onChange={(e) => {setFilters({...filters, keyword: e.target.value, pageIndex: 1,});}} />
                    <Button variant="contained" onClick={() => {navigate("/add-category")}} style={{height: "55px"}}>Add</Button>
                </div>
            </div>
            <br /><br />
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell key={column.id}>{column.label}</TableCell>
                            ))}
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {categoryRecords?.items?.map((row, index) => (
                            <TableRow key={`${row.id}-${index}`}>
                                <TableCell>{row.name}</TableCell>
                                <TableCell style={{display: "flex",justifyContent: "flex-end", columnGap: "10px"}}>
                                    <Button variant="contained" onClick={() => { navigate(`/add-category/${row.id}`);}}>Edit</Button>
                                    <Button variant="contained" onClick={() => { setOpen(true);setSelectedId(row.id ?? 0);}}>Delete</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {!categoryRecords.items.length && (
                            <TableRow>
                                <TableCell>
                                    No Category
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination count={categoryRecords?.totalItems || 0} rowsPerPageOptions={recordsPerpage} rowsPerPage={filters.pageSize || 0} page={filters.pageIndex - 1} onPageChange={(e, newPage) => {setFilters({...filters, pageIndex: newPage + 1});}} onRowsPerPageChange={(e) => {setFilters({...filters, pageIndex: 1, pageSize: Number(e.target.value),});}} />
            <DialogBox open={open} onClose={() => setOpen(false)} onConfirm={() => onConfirmDelete()} title = "Delete Category" description = "Are you sure you want to delete this category?" />
        </>
    );
}

export default Categories;