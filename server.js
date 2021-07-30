
const express = require("express")
const app = express();

app.get("/", (req, res) => {
    res.send("<h1>Hello world</h1>")
})

const httpServer = require("http").createServer(app)
const io = require("socket.io")(httpServer, {
    cors: {
        origin: '*',
        method: ["GET", "POST"],
        allowedHeaders: ["Access-Control-Allow-Origin"],
    },
});

const { addUser, removeUser, getUser, getUsersInRoom } = require("./User")

io.on("connection", socket => {

    socket.on('canvas-data', (data, room) => {
        const user = getUser(socket.id)
        io.to(room).emit('canvas-data', data)
    });

    socket.on('join-room', (roomName, name) => {
        const { error, user } = addUser({ id: socket.id, name: name, room: roomName })

        socket.join(roomName);
        io.to(roomName).emit('joined-user', { room: roomName, users: getUsersInRoom(roomName) })
    })
    socket.on('disconnect', () => {
        const user = removeUser(socket.id);

        if (user) {
            io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` });
            io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });
        }
        console.log('user disconnected');
    });
})


const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
    console.log("Listening on port " + PORT);
})