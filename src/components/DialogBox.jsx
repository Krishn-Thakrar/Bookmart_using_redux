import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import React from "react";

const DialogBox = (props) => {
    const { open, onClose, onConfirm, title, description } = props;
    return(
        <>
            <Dialog open={open} onClose={() => onClose()}>
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    <DialogContentText>{description}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={() => onClose()}>Cancel</Button>
                    <Button variant="contained" onClick={() => onConfirm()}>Ok</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default DialogBox;