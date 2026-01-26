import { io } from "socket.io-client";

// Connect to Backend URL
// Connect to Backend URL (Base URL, not API URL)
const SOCKET_URL = "http://localhost:5000";

let socket;

export const initSocket = () => {
    if (!socket) {
        socket = io(SOCKET_URL, {
            withCredentials: true,
            reconnectionAttempts: 5
        });
        console.log('🔌 Socket Initialized');
    }
    return socket;
};

export const joinAdminRoom = () => {
    if (socket) {
        socket.emit('join_admin_room');
    }
};

export const getSocket = () => socket;
