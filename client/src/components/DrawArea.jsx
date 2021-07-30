import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import Tools from './Tools'
import { useLocation } from 'react-router-dom';
import queryString from "query-string";


// Clear function not working properly.

export default function DrawArea(props) {

    const socket = io.connect("https://drawing-app-backend.herokuapp.com/");
    const [drawing, setDrawing] = useState(false)
    const [penWidth, setPenWidth] = useState(5);
    const [color, setColor] = useState("black")
    const [points, setPoints] = useState([])
    const [roomName, setRoomName] = useState("");
    const [users, setUsers] = useState([])
    const location = useLocation();
    const canvasRef = useRef(null);
    const contextRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        window.addEventListener("DOMContentLoaded", () => {
            canvas.width = window.innerWidth - 200;
            canvas.height = window.innerHeight - 100;
        })
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth - 200;
            canvas.height = window.innerHeight - 100;
        })

        const context = canvas.getContext("2d");

        context.lineJoin = context.lineCap = "round";
        context.strokeStyle = color;
        context.rect(0, 0, canvasRef.current.width, canvasRef.current.height)
        contextRef.current = context;
        console.log("I am in drawing area");

        socket.on('canvas-data', (data) => {
            const image = new Image();
            const ctx = canvasRef.current.getContext("2d");
            image.onload = () => {
                ctx.drawImage(image, 0, 0)
            }
            image.src = data;
        });
    }, [])

    useEffect(() => {
        socket.on('connect', () => {
            console.log("Connected to socket")
        })
        const { roomId, userName } = queryString.parse(location.search);
        console.log("Name: " + roomId + " Room name: " + userName);
        setRoomName(roomId)

        socket.emit('join-room', roomId, userName);
        socket.on('joined-user', ({ room, users }) => {
            setUsers(users);
        })
    }, [])

    function midPointBtw(p1, p2) {
        return {
            x: p1.x + (p2.x - p1.x) / 2,
            y: p1.y + (p2.y - p1.y) / 2
        };
    }


    const startDrawing = ({ nativeEvent }) => {
        const { offsetX, offsetY } = nativeEvent;

        setPoints((prev) => {
            return [...prev, { x: offsetX, y: offsetY }]
        });

        contextRef.current.lineJoin = contextRef.current.lineCap = 'round';
        contextRef.current.lineWidth = penWidth;
        contextRef.current.strokeStyle = color;

        setDrawing(true)
    }

    function stopDrawing() {

        setDrawing(false)
        setPoints([])

    }
    const draw = ({ nativeEvent }) => {
        if (!drawing) return;

        const { offsetX, offsetY } = nativeEvent;
        setPoints((prev) => {
            return [...prev, { x: offsetX, y: offsetY }]
        });

        var p1 = points[0];
        var p2 = points[1];

        contextRef.current.beginPath()
        contextRef.current.moveTo(p1.x, p1.y)
        for (var i = 1, len = points.length; i < len; i++) {

            var midPoint = midPointBtw(p1, p2);
            contextRef.current.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);
            p1 = points[i];
            p2 = points[i + 1];
        }
        contextRef.current.lineTo(p1.x, p1.y);
        contextRef.current.stroke();

        setTimeout(() => {
            var base64ImageData = canvasRef.current.toDataURL();
            socket.emit('canvas-data', base64ImageData, roomName)
            console.log(roomName);
        }, 1000)

    }

    // Clear canvas button 
    function clearCanvas() {
        contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
    // Drawing mode button
    function drawMode() {
        setColor("black")
        setWidth(5)
    }
    // Erase mode button
    function erase() {
        setColor("white")
        setWidth(10);
    }
    // Custom color's
    function preMadeColor(event) {
        setColor(event.target.style.backgroundColor);
    }
    // Custom color's
    function changeColorFromPicker(event) {
        setColor(event.target.value);
    }
    // Setting width
    function setWidth(width) {
        setPenWidth(width)
    }

    return (
        <div>
            <Tools roomName={roomName} usersJoined={users} clearCanvasArea={clearCanvas} brushMode={drawMode} eraseMode={erase} setColor={preMadeColor} colorPicker={changeColorFromPicker} penWidth={setWidth} />

            <canvas
                id="canvas"
                onMouseDown={startDrawing}
                onMouseUp={stopDrawing}
                onMouseMove={draw}
                onTouchStart={startDrawing}
                onTouchEnd={stopDrawing}
                onTouchMove={draw}
                className="canvas"
                ref={canvasRef}></canvas>
        </div>
    )
}