import { Server } from "socket.io"


let connections = {}           //STORED CONNECTED USERS IN EACH ROOM
let messages = {}              //Stores message history per room.
let timeOnline = {}            //Tracks how long a user stayed connected.


//connect To Socket(server)
export const connectToSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "*",                  //ALLOWED ALL IP'S
            methods: ["GET", "POST"],
            allowedHeaders: ["*"],
            credentials: true
        }
    });


    //When a Client Connects
    io.on("connection", (socket) => {

        console.log("SOMEONE CONNECTED")

        socket.on("join-call", (path) => {       //when the user joins a room.

            if (connections[path] === undefined) {
                connections[path] = []                //PATH CREATED(ROOM)
            }
            connections[path].push(socket.id)       //Add this user into the room

            timeOnline[socket.id] = new Date();     //Store when they joined


            //Notify all users in the room
            for (let a = 0; a < connections[path].length; a++) {
                io.to(connections[path][a]).emit("user-joined", socket.id,  
                connections[path])
            }


            //Send old chat history to the newly joined user
            if (messages[path] !== undefined) {
                for (let a = 0; a < messages[path].length; ++a) {
                    io.to(socket.id).emit("chat-message", messages[path][a]['data'],
                        messages[path][a]['sender'], messages[path][a]['socket-id-sender'])
                }
            }

        })


        //Used for video/audio connections.
        socket.on("signal", (toId, message) => {
            io.to(toId).emit("signal", socket.id, message);
        })


        //Chat messaging
        socket.on("chat-message", (data, sender) => {


            //Find the room that this socket belongs to
            const [matchingRoom, found] = Object.entries(connections)
                .reduce(([room, isFound], [roomKey, roomValue]) => {


                    if (!isFound && roomValue.includes(socket.id)) {
                        return [roomKey, true];
                    }

                    return [room, isFound];

                }, ['', false]);

            if (found === true) {
                if (messages[matchingRoom] === undefined) {
                    messages[matchingRoom] = []
                }

                //Save the message in history
                messages[matchingRoom].push({ 'sender': sender, "data": data, "socket-id-sender": socket.id })
                console.log("message", matchingRoom, ":", sender, data)


                //Broadcast to all users in room
                connections[matchingRoom].forEach((elem) => {
                    io.to(elem).emit("chat-message", data, sender, socket.id)
                })
            }

        })

        //When a user closes the tab or leaves
        socket.on("disconnect", () => {

            //Calculate how long they were online
            var diffTime = Math.abs(timeOnline[socket.id] - new Date())

            var key

            //Find the room they were part of
            for (const [k, v] of JSON.parse(JSON.stringify(Object.entries(connections)))) {

                for (let a = 0; a < v.length; ++a) {
                    if (v[a] === socket.id) {
                        key = k

                        //Notify others that this user left
                        for (let a = 0; a < connections[key].length; ++a) {
                            io.to(connections[key][a]).emit('user-left', socket.id)
                        }

                        var index = connections[key].indexOf(socket.id)

                        //Remove socket from connections
                        connections[key].splice(index, 1)


                        //Delete the room if empty
                        if (connections[key].length === 0) {
                            delete connections[key]
                        }
                    }
                }

            }


        })


    })


    return io;
}
