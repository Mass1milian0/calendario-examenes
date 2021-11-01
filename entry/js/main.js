const HOST = location.origin.replace(/^http/, 'ws') + "/wss/";
let socket
function loadUniMenuOptions(options) {
    const uniMenu = document.querySelector("#universidad")
    for (let i of options) {
        element = document.createElement("option");
        element.innerText = i.nombreUniversidad
        uniMenu.appendChild(element);
    }
}

function loadOptions(context, options, get) {
    console.log("Loading Options...");
    let option = document.querySelector(context)
    for (let i of options[0]) {
        element = document.createElement("option");
        element.innerText = i[get]
        option.appendChild(element);
    }
}
function resetOptions() {
    let selectors = document.querySelectorAll("select")
    for (let i of selectors) {
        if (i.id != "universidad" || i.id != "curso")
            i.innerHTML = "<option>Selecione Una</option>"
    }
}
document.querySelector("#universidad").addEventListener("change", function () {
    console.log("Sent msg to WS");
    resetOptions()
    if (this.selectedIndex != 0) {
        socket.send(JSON.stringify({
            operation: "getFromDb",
            context: "#carrera",
            get: "facultad",
            content: "SELECT facultad FROM facultades where universidad = '" + this.options[this.selectedIndex].text + "'"
        }))
    }
})


load_socket();

function load_socket() {
    socket = new WebSocket(HOST, "main");

    socket.addEventListener("open", function (event) {
        console.log("connected");
    });

    socket.addEventListener("message", function (event) {
        let msg = JSON.parse(event.data);
        console.log("Recived message: " + msg);
        if (msg.operation == "wssUpdate") {
            console.log("recieved");
            let universidades = msg.content.universidades;
            console.log(universidades[0]);
            loadUniMenuOptions(universidades[0])
        }
        if (msg.operation == "updateFromDb") {
            loadOptions(msg.context,msg.content,msg.get)
        }
    });
}