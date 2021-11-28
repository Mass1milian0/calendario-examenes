const HOST = location.origin.replace(/^http/, 'ws') + "/wss/";
let socket;

load_socket();

myEvents = [
  {
    id: "required-id-1",
    name: "New Year",
    date: "Wed Jan 01 2020 00:00:00 GMT-0800 (Pacific Standard Time)",
    type: "holiday",
    description: "lorem ipsum dolor sit amet er sit amet, consectetur adipisicing el iter",
    everyYear: true
  },
  {
    id: "required-id-2",
    name: "Valentine's Day",
    date: "Fri Feb 14 2020 00:00:00 GMT-0800 (Pacific Standard Time)",
    type: "holiday",
    everyYear: true,
    color: "#222"
  },
  {
    id: "required-id-3",
    name: "Custom Date",
    badge: "08/03 - 08/05",
    date: ["August/03/2020", "August/05/2020"],
    description: "Description here",
    type: "event"
  },
  // more events here
],

  $('#evoCalendar').evoCalendar({
    calendarEvents: myEvents,
    theme: "Midnight Blue",
    language: 'es'
  });
function buildOption(text) {
  let option = document.createElement('option');
  option.innerHTML = text;
  return option
}
function resetOptions() {
  let selectors = document.querySelector("#grado")
  selectors.innerHTML = "<option>Selecione Una</option>"
}
function loadOptionsFromWss(data) {
  const universidades = $('#university')
  for (let i of data) {
    universidades.append(buildOption(i.universidad))
  }
}
function loadFacultad(data) {
  const facultad = $('#grado')
  for (let i of data) {
    facultad.append(buildOption(i.facultad))
  }
}
$('#university').on('change', function () {
  resetOptions()
  socket.send(JSON.stringify({
    operation: "getFromDb",
    forServer: false,
    context: "#carrera",
    get: "facultad",
    content: "SELECT facultad FROM facultades where universidad = '" + this.options[this.selectedIndex].text + "'"
  }))
})
function load_socket() {
  socket = new WebSocket(HOST, "main");

  socket.addEventListener("open", function (event) {
    console.log("connected");
  });

  socket.addEventListener("message", function (event) {
    let msg = JSON.parse(event.data);
    if (msg.operation == "wssWelcome") {
      loadOptionsFromWss(msg.content.universidades[0])
    }
    if (msg.operation == 'updateFromDb') {
      loadFacultad(msg.content[0])
    }
  });
}