import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import SliderC from './SliderC';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

export default function Tools(props) {

    const [open, setOpen] = useState(false);

    const customColors = {
        blueInk: { backgroundColor: "#000F55" },
        red: { backgroundColor: "red" },
        blackInk: { backgroundColor: "black" }
    }
    function passWidth(value) {
        props.penWidth(value);
    }

    function UserListDialogue(props) {
        const { open, users, onClose } = props;


        function handleClose() {
            onClose();
        }
        return (
            <Dialog aria-labelledby="simple-dialog-title" onClose={handleClose} open={open} >
                <DialogTitle>List of user's</DialogTitle>
                {users.map(value => {
                    return (
                        <List>
                            <ListItem key={value}>
                                <Avatar>{value.name.toUpperCase().charAt(0)}</Avatar>

                                <ListItemText style={{ marginLeft: "10px" }} primary={value.name.toUpperCase()} />
                            </ListItem>
                        </List>
                    )
                })}
            </Dialog>
        )
    }
    function handleOpen() {
        setOpen(true);
    }
    function handleClose() {
        setOpen(false);
    }



    return (

        <div className="penTools">

            <Button variant="contained" onClick={handleOpen} color="primary" component="span">Peoples</Button>
            <h3>Room: {props.roomName}</h3>
            {/* Clear button */}
            <Button variant="contained" onClick={props.clearCanvasArea} color="primary" component="span">Clear</Button>

            {/* Draw and erase button */}
            <div className="drawTools">
                <Button variant="contained" color="primary" onClick={props.brushMode} component="span" > Draw </Button>
                <Button variant="contained" color="primary" onClick={props.eraseMode} component="span" > Erase </Button>
            </div>

            {/* Colors */}
            <div className="colorGroup">
                <button className="customColor" onClick={props.setColor} style={customColors.blueInk}></button>

                <button className="customColor" onClick={props.setColor} style={customColors.red} ></button>

                <button className="customColor" onClick={props.setColor} style={customColors.blackInk} ></button>

                <input type="color" onChange={props.colorPicker}  ></input>
            </div>
            <div className="widthTool">
                <SliderC widthValue={passWidth} />
            </div>

            <UserListDialogue open={open} users={props.usersJoined} onClose={handleClose} />
        </div >

    )
}