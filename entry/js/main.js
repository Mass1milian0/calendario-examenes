const HOST = location.origin.replace(/^http/, 'ws');

load_socket();

function load_socket() {
    socket = new WebSocket(HOST, "main");

    socket.addEventListener("open", function (event) {
        console.log("connected");
    });

    socket.addEventListener("message", function (event) {
        let msg = JSON.parse(event.data);
        if (msg.operation == "wssUpdate") {
            console.log("recieved");
            let universidades = msg.content.universidades;
            //TODO handleContent
        }
    });
}