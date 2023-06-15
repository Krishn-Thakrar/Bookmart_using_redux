import React, { useEffect, useState } from "react";
import { defaultFilter, recordsPerpage } from "../utils/filter";
import categoryService from "../service/category.service";
import bookService from "../service/book.service";
import DialogBox from "../components/DialogBox";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField } from "@mui/material";

function Book() {
    const [filters, setFilters] = useState(defaultFilter);
    const [categories, setCategories] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(0);
    const navigate = useNavigate();
    const [bookRecords, setBookRecords] = useState({
        pageIndex: 0,
        pageSize: 10,
        totalPages: 1,
        items: [],
        totalItems: 0,
    });

    useEffect(() => {
        getAllCategories();
    }, []);

    const getAllCategories = async () => {
        await categoryService.getAll().then((res) => {
          if (res) {
            setCategories(res);
          }
        });
    };

    const searchAll = (filters) => {
        bookService.getAll(filters).then((res) => {
          setBookRecords(res);
        })
    };

    useEffect(() => {
        if (filters.keyword === "") {
          delete filters.keyword;
        }
        searchAll({ ...filters });
    }, [filters]);

    const columns = [
        { id: "BookName", label: "Book Name"},
        { id: "Price", label: "Price"},
        { id: "Category", label: "Category"},
    ];

    const onConfirmDelete = () => {
        bookService.deleteBook(selectedId).then((res) => {
            toast.success("Book Deleted Successfully..");
            setOpen(false);
            setFilters({ ...filters, pageIndex: 1 })
        }).catch((e) => {
            toast.error("Failed to Delete");
        })
    };

    return(
        <>
            <center><h1>Book Page</h1></center>
            <div style={{display: "flex", justifyContent: "space-between"}}>
                <div className="total">
                    <p> Total - {bookRecords.totalItems} items</p>
                </div>
                <div className="head" style={{display: "flex", justifyContent: "flex-end", columnGap: "20px"}}>
                    <TextField label="Search" variant="outlined" onChange={(e) => {setFilters({...filters, keyword: e.target.value, pageIndex: 1,});}} />
                    <Button variant="contained" onClick={() => {navigate("/add-book")}} style={{height: "55px"}} >Add</Button>
                </div>
            </div>
            <br /><br />
            <div className="content">
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => {
                                    return <TableCell key={column.id}>{column.label}</TableCell>
                                })}
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {bookRecords?.items?.map((row, index) => (
                                <TableRow key={row.id}>
                                    <TableCell>{row.name}</TableCell>
                                    <TableCell >{row.price}</TableCell>
                                    <TableCell >{categories.find((c) => c.id === row.categoryId)?.name}</TableCell>
                                    <TableCell style={{display: "flex", columnGap: "10px"}} >
                                        <Button variant="contained" onClick={() => { navigate(`/add-book/${row.id}`);}}>Edit</Button>
                                        <Button variant="contained" onClick={() => { setOpen(true);setSelectedId(row.id);}}>Delete</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {!bookRecords.items.length && (
                                <TableRow>
                                    <TableCell>No Books</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
            <br /><br />
            <div className="pagination">
                <TablePagination count={bookRecords.totalItems} rowsPerPageOptions={recordsPerpage} rowsPerPage={filters.pageSize || 0} page={filters.pageIndex - 1} onPageChange={(e, newPage) => {setFilters({...filters, pageIndex: newPage + 1});}} onRowsPerPageChange={(e) => {setFilters({...filters, pageIndex: 1, pageSize: Number(e.target.value),});}} />
            </div>
            <DialogBox open={open} onClose={() => setOpen(false)} onConfirm={() => onConfirmDelete()} title = "Delete Book" description = "Are you sure you want to delete this book?" />
        </>
    );
}

export default Book;