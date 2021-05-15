const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const {
    onlineUsers
} = require('./routes/loginSignup.js');

const app = express();
const server = http.createServer(app);
const io = socketio(server);
const PORT = process.env.PORT || 6784


app.set('view engine', 'hbs');


app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use(express.static(path.join(__dirname, '/public')));
app.use('/chatpage', express.static(path.join(__dirname, '/public/chatpage.html')));
app.use('/', require('./routes/loginSignup.js').route);


// let usersPass = {}
let users = []
let newUser
let socketMap = {}

let icons = ["CA", "CAshield", "CM", "cyclops", "daredevil", "deadpool", "hulk", "hulkhand", "ironman", "magneto", "spidey", "stormbreaker", "thanos", "thor", "wolverine", "gauntlet", "Cmarvel", "groot", "Htorch", "Jgrey", "Lcage", "mystique", "rogue"]

function getRandomIcon() {
    return icons[Math.floor(Math.random() * 23)]
}

let iconMap = {}

io.on('connection', (socket) => {

    // function login(s, u) {
    //     s.join(u)
    //     socketMap[u] = s.id
    //     iconMap[u] = getRandomIcon()
    //     s.emit('logged-in', {
    //         user: u,
    //         currentIcon: iconMap[u]
    //     })
    // }

    socket.on('login', (data) => {
        if(!data.alreadyUser){
            console.log('1.1')
            newUser = onlineUsers[onlineUsers.length - 1]
            users.push(newUser)
        }
        else{
            console.log('1.2')
            newUser = data.alreadyUser
        }
        // if (usersPass[data.username]) {
        //     if (usersPass[data.username] == data.password) {
        //         login(socket, data.username)
        //     } else {
        //         socket.emit('login failed')
        //     }
        // } else {
        //     usersPass[data.username] = data.password
        // users.push(data.username)
        // login(socket, data.username)
        socket.join(newUser)
        socketMap[newUser] = socket.id
        iconMap[newUser] = getRandomIcon()
        socket.emit('logged-in', {
            user: newUser,
            iconMap
        })
        // }
    })

    socket.on('new-logged-in', (user) => {
        console.log('3')
        socket.emit('yes-new-logged-in', {
            users,
            iconMap
        })
        socket.broadcast.emit('yes-logged-in', {
            users,
            user: newUser,
            iconMap
        })
    })

    // setInterval(() => {
    //     users = []
    //     socketMap = {}
    //     io.emit('checkIfOnline')
    // }, 60000);

    // socket.on('replyToCheck', (data) => {
    //     users.push(data.user)
    //     socketMap[data.user] = data.id
    //     io.emit('yes-logged-in', {
    //         users,
    //         iconMap
    //     })
    // })

    socket.on('msg_send', (data) => {
        data.icon = iconMap[data.from]
        if (data.to != 'Everyone') {
            io.to(data.to).emit('msg_rcvd', data)
        } else {
            data.from = 'Everyone'
            socket.broadcast.emit('msg_rcvd', data)
        }
    })

    socket.on('userLeft', (data) => {
        // delete usersPass[data]
        delete iconMap[data]
        const index = onlineUsers.indexOf(data);
        const index1 = users.indexOf(data);
        delete socketMap[data]
        onlineUsers.splice(index, 1);
        users.splice(index1, 1);
        io.emit('yes-logged-in', {
            users,
            iconMap
        })
    })
})


server.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
});
