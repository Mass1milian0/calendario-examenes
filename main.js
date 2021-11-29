const HOST = location.origin
const axiosApp = axios.create({
  baseURL: HOST,
});
let eventsCache;
function objectBuilderForCalendarEvents(universidad, facultad, nombreExamen, fechaExamen, convocatoriaEspecial, convocatoriaExtraordinaria, curso) {
  const regex = /[0-9]{4}-[0-9]{2}-[0-9]{2}/i;
  UID = universidad + "," + facultad + "," + nombreExamen + "," + curso + "," + convocatoriaEspecial + "," + convocatoriaExtraordinaria + "," + regex.exec(fechaExamen)
  let event
  if (convocatoriaEspecial) {
    event = {
      id: UID,
      name: facultad,
      description: universidad + " , " + nombreExamen + ", " + facultad + ",\n" + "CONVOCATORIA ESPECIAL ," + "\n" + curso + "º de carrera",
      date: regex.exec(fechaExamen),
      type: "event"
    }
  } else if (convocatoriaExtraordinaria) {
    event = {
      id: UID,
      name: facultad,
      description: universidad + " , " + nombreExamen + ", " + facultad + " ,\n" + "CONVOCATORIA EXTRAORDINARIA ," + "\n" + curso + "º de carrera",
      date: regex.exec(fechaExamen),
      type: "event"
    }
  } else {
    event = {
      id: UID,
      name: facultad,
      description: universidad + " , " +  nombreExamen + ", " + facultad + " ,\n" + "ORDINARIA ," + "\n" + curso + "º de carrera",
      date: regex.exec(fechaExamen),
      type: "event"
    }
  }
  return event
}
async function initCalendar(data,nonDestructive = false) {
  let destructed = false
  let lastDateSelected;
  let events = data
  if (nonDestructive == false) {
    events = []
    for (let i of data) {
      events.push(objectBuilderForCalendarEvents(i.universidad, i.facultad, i.nombreExamen, i.fechaExamen, i.convocatoriaEspecial, i.convocatoriaExtraordinaria, i.curso))
    }
    eventsCache = events
  } else {
    lastDateSelected = $('#evoCalendar').evoCalendar('getActiveDate')
    destructed = true
    $('#evoCalendar').evoCalendar('destroy')
  }
  if(!destructed) {
    $('#evoCalendar').evoCalendar({
      calendarEvents: events,
      theme: "Midnight Blue",
      language: 'es',
      format: "yyyy/mm/dd"
    });
  } else {
    $('#evoCalendar').evoCalendar({
      calendarEvents: events,
      theme: "Midnight Blue",
      language: 'es',
      format: "yyyy/mm/dd",
    });
    $('#evoCalendar').evoCalendar('selectDate', lastDateSelected)
  }
}
function filterNonDestructive() {
  let activeFilters = []
  if (document.querySelector("#university").selectedIndex != 0) {
    activeFilters.push((element) => {
      let UID = element.id.split(',')
      if (UID[0] != document.querySelector("#university").options[document.querySelector("#university").selectedIndex].text) {
        return true
      }
    })
  }
  if (document.querySelector("#grado").selectedIndex != 0) {
    activeFilters.push((element) => {
      let UID = element.id.split(',')
      if (UID[1] != document.querySelector("#grado").options[document.querySelector("#grado").selectedIndex].text) {
        return true
      }
    })
  } 
  if (document.querySelector("#curso").selectedIndex != 0) {
    activeFilters.push((element) => {
      let UID = element.id.split(',')
      if (UID[3] != document.querySelector("#curso").options[document.querySelector("#curso").selectedIndex].text[0]) {
        return true
      }
    })
  }
  activeFilters.push((element) => {
    let UID = element.id.split(',')
    if (UID[4] != document.querySelector("#convEspecial").checked) {
      return true
    }
  })
  activeFilters.push((element) => {
    let UID = element.id.split(',')
    if (UID[5] != document.querySelector("#convExtra").checked) {
      return true
    }
  })
  const filteredArray = eventsCache.filter((event) => activeFilters.every((filter) => !filter(event)));
  initCalendar(filteredArray,true)
}
function buildOption(text) {
  let option = document.createElement('option');
  option.innerHTML = text;
  return option
}
function resetOptions() {
  let selectors = document.querySelector("#grado")
  selectors.innerHTML = "<option>Selecione Una</option>"
}
async function loadOptions() {
  let data = await axiosApp.get("/api/getDistinctGrados")
  data = data.data.data[0]
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
$('#university').on('change', async function () {
  resetOptions()
  let data = await axiosApp.post("/api/getSelectFromTable", {
    table: "facultades",
    data: "facultad",
    condition1: "universidad",
    condition2: this.options[this.selectedIndex].text
  })
  data = data.data.data[0]
  loadFacultad(data)
  filterNonDestructive()
})
$("#grado").on('change', function () {
  filterNonDestructive()
})
$("#curso").on('change', function () {
  filterNonDestructive()
})
$("#convEspecial").on('change', function () {
  filterNonDestructive()
})
$("#convExtra").on('change', function () {
  filterNonDestructive()
})
window.onload = async function () {
  eventsCache = await axiosApp.get("/api/getDataFromTable/examenes")
  eventsCache = eventsCache.data.data[0]
  initCalendar(eventsCache)
  loadOptions()
};
