
const users = [];

const addUser = ({ id, name, room }) => {
    name = name.trim().toLowerCase();

    const checkExistingUser = users.find((user) => user.room === room && user.name === name);
    if (room === '' || name === '') {
        return { error: 'Username and Room ID is required.' }
    }

    if (checkExistingUser) {
        return { error: 'Username is already taken.' }
    }

    const user = { id, name, room };
    users.push(user);
    console.log(users);

    return { user }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id);
    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}



const getUser = (id) => users.find(user => user.room === id);

const getUsersInRoom = (room) => users.filter((user) => user.room === room);


module.exports = { addUser, removeUser, getUser, getUsersInRoom }