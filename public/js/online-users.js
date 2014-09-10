var socket_io_url = 'http://localhost:3030';
var socket = null;

if (/iPhone|iPod|iPad/i.test(navigator.userAgent)) {
    socket = io.connect(socket_io_url, {transports: ["websocket"]});
} else {
    socket = io.connect(socket_io_url, {forceJSONP: true});
}

setTimeout(function () {

    /* 初めて接続した時の挙動 */
    socket.on("connect", function () {
        /*
        - ログにIDを表示
        - HTMLにオンラインかどうかを表示
        - HTMLにIDを表示
         */
        console.log("connected. ID: " + socket.io.engine.id);
        $("#is-online").html("Yes");
        $("#client-id").html(socket.io.engine.id);
    });

    /* オンラインユーザー一覧が送られてきたとき */
    socket.on("online-users", function(users) {
        console.log("Received current online users");
        //console.log(users);
        /* オンラインユーザー一覧をテーブルで表示 */
        if (users.length > 0) {
            $("#online-users-table").val("");
            var table = '<table border="1" cellspacing="3" cellpadding="20">';
            for (var i = 0; i < users.length; i++) {
                //console.log(users[i]);
                /* 自分であれば、(← YOU) という文字列を付加する */
                if(users[i] === socket.io.engine.id){
                    table += '<tr><td>' + users[i] + ' (← YOU)</td></tr>';
                } else {
                    table += '<tr><td>' + users[i] + '</td></tr>';
                }
            }
            table += '</table>';
            $("#online-users-table").html(table);
        }
    });

    /* サーバーとの接続が切れた場合(クライアントから切る場合とサーバーが落ちた場合)の挙動 */
    socket.on('disconnect', function () {
        console.log("Disconnected.");
        $("#is-online").html("No");
    });

    /* 何らかのエラーが発生した場合 */
    socket.on('error', function (err) {
        console.log("Error. Detail: ");
        console.log(err);
    });

}, 0);

/* jQuery の挙動 */
$( document ).ready(function() {
    /* 起動時にはHTMLのオンラインをNoに設定 */
    $("#is-online").html("No");

    /* disconnectボタンが押されたら、ログとHTMLに接続断を示し、サーバーに対してdisconnect */
    $("#btn-disconnect").click(function(){
        console.log("You have disconnected.");
        $("#is-online").html("No");
        socket.disconnect();
    });
});

