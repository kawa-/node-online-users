var express = require('express');
var app = express();
var http = require('http');
var server = http.createServer(app).listen(process.env.PORT || 3030);
var io = require('socket.io')(server);

app.use(express.static(__dirname + '/public'));

var users = [];

io.on('connection', function (socket) {

    console.log("A client added. ID: " + socket.id);

    users.push(socket.id);

    /* 新しい接続が発生したら、オンラインのユーザーを全て送信 */
    console.log("New online users list emitted.");
    io.sockets.emit("online-users", users);

    socket.on("disconnect", function () {
        console.log("A client disconnected. ID:" + socket.id);
        users = users.filter(function(v, i) {
            return (v !== socket.id);
        });
        /* クライアントとの接続が切れるたびに、現在のオンラインのユーザーを全て送信 */
        console.log("New online users list emitted.");
        io.sockets.emit("online-users", users);
    });
});
