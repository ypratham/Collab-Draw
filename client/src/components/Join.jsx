import React, { useState } from 'react';
import Input from './Input';
import Button from './Button';
import {
    BrowserRouter as Router,
    Link
} from "react-router-dom";


export default function Join(props) {
    const [roomName, setRoomName] = useState("");
    const [userName, setUserName] = useState("");
    const [bool, setBool] = useState(false)

    function handleChange(event) {
        setRoomName(event.target.value);
    }
    function getUserName(event) {
        setUserName(event.target.value)
    }
    function handleClick() {
        if (roomName === "" || userName === "") {
            alert("Please enter details");
            setBool(true)
        } else {
            setBool(false)

        }
    }
    return (

        <div className="joinRoom">

            <h1>Join / Create room</h1>
            <Input label="Room name" change={handleChange} />
            <Input label="User name" change={getUserName} />
            <Link style={{ pointerEvents: bool ? 'none' : 'initial' }} exact="true" to={`/room?roomId=${roomName}&userName=${userName}`} >
                <Button onClick={handleClick} />
            </Link>

        </div>

    )
}