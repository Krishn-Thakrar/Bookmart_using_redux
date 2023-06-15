import React, { useEffect, useState } from "react";
import DialogBox from "../components/DialogBox";
import userService from "../service/user.service";
import shared from "../utils/shared";
import { useNavigate } from "react-router-dom";
// import { useAuthContext } from "../context/auth";
import { defaultFilter, recordsPerpage } from "../utils/filter";
import { toast } from "react-toastify";
import { Button, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField } from "@mui/material";
import { useSelector } from "react-redux";

function User(){
    const navigate = useNavigate();
    // const authContext = useAuthContext();
    const [filters, setFilters] = useState(defaultFilter);
    const [open, setOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(0);
    const [userList, setUserList] = useState({
        pageIndex: 0,
        pageSize: 10,
        totalPages: 1,
        items: [],
        totalItems: 0,
    });
    const authData = useSelector((state) => state.auth.user);

    useEffect(() => {
        if (filters.keyword === ""){
            delete filters.keyword;
        } 
        getAll({ ...filters });
    }, [filters]);

    const getAll = async (filters) => {
        await userService.getAllUsers(filters).then((res) => {
            if (res) {
                setUserList(res);
            }
        });
    };

    const columns = [
        { id: "FirstName", label: "First Name" },
        { id: "LastName", label: "Last Name" },
        { id: "Email", label: "Email" },
        { id: "roleName", label: "Role" },
    ];

    const onConfirmDelete = async () => {
        await userService.deleteUser(selectedId).then((res) => {
            if (res) {
                toast.success(shared.messages.DELETE_SUCCESS);
                setOpen(false);
                setFilters({ ...filters});
            }
        }).catch((e) => {
            toast.error(e);
            toast.error(shared.messages.DELETE_FAIL);
        });
    };

    return(
        <>
            <center><h1>User</h1></center><br />
            <center><TextField label="Search" variant="outlined" onChange={(e) => {setFilters({...filters, keyword: e.target.value, pageIndex: 1,});}} /></center>
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
                        {userList?.items?.map((row, index) => (
                            <TableRow key={`${row.id}-${index}`}>
                                <TableCell>{row.firstName}</TableCell>
                                <TableCell>{row.lastName}</TableCell>
                                <TableCell>{row.email}</TableCell>
                                <TableCell>{row.role}</TableCell>
                                <TableCell style={{display: "flex",justifyContent: "flex-end", columnGap: "10px"}}>
                                    <Button variant="contained" onClick={() => { navigate(`/edit-user/${row.id}`);}}>Edit</Button>
                                    {row.id !== authData.id && (
                                        <Button variant="contained" onClick={() => { setOpen(true);setSelectedId(row.id ?? 0);}}>Delete</Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                        {!userList.items.length && (
                            <TableRow>
                                <TableCell>
                                    No User
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination count={userList.totalItems || 0} rowsPerPageOptions={recordsPerpage} rowsPerPage={filters.pageSize || 0} page={filters.pageIndex - 1} onPageChange={(e, newPage) => {setFilters({...filters, pageIndex: newPage + 1});}} onRowsPerPageChange={(e) => {setFilters({...filters, pageIndex: 1, pageSize: Number(e.target.value),});}} />
            <DialogBox open={open} onClose={() => setOpen(false)} onConfirm={() => onConfirmDelete()} title = "Delete User" description = "Are you sure you want to delete this User?" />
        </>
    );
}

export default User;