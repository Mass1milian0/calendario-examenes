const HOST = location.origin
const axiosApp = axios.create({
    baseURL: HOST,
});
async function loadUniMenuOptions() {
    let options = await axiosApp.get("/api/getDistinctGrados")
    options = options.data.data[0]
    const uniMenu = document.querySelector("#universidad")
    for (let i of options) {
        let element = document.createElement("option");
        element.innerText = i.universidad
        uniMenu.appendChild(element);
    }
}
function buildTr(params) {
    let element = document.createElement("tr")
    for (let i of params) {
        el = document.createElement("td")
        el.innerText = i
        element.appendChild(el);
    }
    let delBtn = document.createElement("button")
    delBtn.classList.add("delBtn")
    delBtn.innerText = "Delete"
    delBtn.addEventListener("click", function () {
        axiosApp.post("/api/deleteData", {
            universidad: this.parentElement.cells[0].innerHTML,
            facultad: this.parentElement.cells[3].innerHTML,
            nombreExamen: this.parentElement.cells[1].innerHTML,
            fechaExamen: this.parentElement.cells[2].innerHTML,
            curso: this.parentElement.cells[4].innerHTML
        })
        this.parentElement.remove()
    })
    element.appendChild(delBtn);
    return element
}

async function loadTable(init = true, data = undefined) {
    const regex = /[0-9]{4}-[0-9]{2}-[0-9]{2}/i;
    const table = document.querySelector("#mainTableShow")
    if (init) {
        let data = await axiosApp.get("/api/getDataFromTable/examenes")
        data = data.data.data[0]
        for (let i of data) {
            let tr = buildTr([i.universidad, i.nombreExamen, regex.exec(i.fechaExamen), i.facultad, i.curso, i.convocatoriaEspecial, i.convocatoriaExtraordinaria])
            table.appendChild(tr)
        }
    } else {
        for (let i of data) {
            let tr = buildTr([i.universidad, i.nombreExamen, regex.exec(i.fechaExamen), i.facultad, i.curso, i.convocatoriaEspecial, i.convocatoriaExtraordinaria])
            table.appendChild(tr)
        }
    }
}
function addToTable(data) {
    const regex = /[0-9]{4}-[0-9]{2}-[0-9]{2}/i;
    const table = document.querySelector("#mainTableShow")
    let tr = buildTr([data.universidad, data.nombreExamen, regex.exec(data.fechaExamen), data.facultad, data.curso, data.convocatoriaEspecial, data.convocatoriaExtraordinaria])
    table.appendChild(tr)
}
function reloadTable(data) {
    document.querySelector("#mainTableShow").innerHTML =
    `
    <tr class="index">
        <th>Universidad</th>
        <th>Nombre</th>
        <th>Fecha</th>
        <th>Carrera</th>
        <th>Curso</th>
        <th>Especial</th>
        <th>Extraordinaria</th>
    </tr>
    
    `
    loadTable(false,data)
}
async function filterTableBy() {
    let activeFilters = []
    let data = await axiosApp.get("/api/getDataFromTable/examenes")
    data = data.data.data[0]
    if (document.querySelector("#universidad").selectedIndex != 0) {
        activeFilters.push((element) => {
            if (element.universidad != document.querySelector("#universidad").options[document.querySelector("#universidad").selectedIndex].text) {
                return true
            }
        })
    }
    if (document.querySelector("#carrera").selectedIndex != 0) {
        activeFilters.push((element) => {
            if (element.facultad != document.querySelector("#carrera").options[document.querySelector("#carrera").selectedIndex].text) {
                return true
            }
        })
    }
    if (document.querySelector("#curso").selectedIndex != 0) {
        activeFilters.push((element) => {
            if (element.curso != document.querySelector("#curso").options[document.querySelector("#curso").selectedIndex].text[0]) {
                return true
            }
        })
    }
    const filteredArray = data.filter((event) => activeFilters.every((filter) => !filter(event)));
    reloadTable(filteredArray)
}
function loadOptions(options) {
    let option = document.querySelector("#carrera")
    for (let i of options) {
        let element = document.createElement("option");
        element.innerText = i["facultad"]
        option.appendChild(element);
    }
}

document.querySelector("#submit").addEventListener("click", function (e) {
    let invalid = false
    let universidad = document.querySelector("#universidad").options[document.querySelector("#universidad").selectedIndex].text
    let facultad = document.querySelector("#carrera").options[document.querySelector("#carrera").selectedIndex].text
    let curso = document.querySelector("#curso").selectedIndex
    let nombreExamen = document.querySelector("#nombreExamen").value
    let fechaExamen = document.querySelector("#date").value
    let convocatoriaEspecial = Number(document.querySelector("#Especial").checked)
    let convocatoriaExtraordinaria = Number(document.querySelector("#Extraordinaria").checked)
    function validate(cssSelector) {
        try {
            if (document.querySelector(cssSelector).options[document.querySelector(cssSelector).selectedIndex].text == 0) {
                document.querySelector(cssSelector).labels[0].classList.toggle("missing")
                return true
            }
        } catch (error) {
            if (document.querySelector(cssSelector).value.length == 0) {
                document.querySelector(cssSelector).labels[0].classList.toggle("missing")
                return true
            }
        }
    }
    invalid = validate("#universidad")
    invalid = validate("#carrera")
    invalid = validate("#curso")
    invalid = validate("#nombreExamen")
    invalid = validate("#date")
    if (invalid) {
        return
    }
    else {
        axiosApp.post("/api/postData", {
            universidad, facultad, nombreExamen, fechaExamen, convocatoriaEspecial, convocatoriaExtraordinaria, curso
        })
    }
    addToTable({ universidad, nombreExamen, fechaExamen, facultad, curso, convocatoriaEspecial, convocatoriaExtraordinaria })
})

function resetOptions() {
    let selectors = document.querySelector("#carrera")
    selectors.innerHTML = "<option>Selecione Una</option>"
}
document.querySelector("#universidad").addEventListener("change", async function () {
    resetOptions()
    if (this.selectedIndex != 0) {
        filterTableBy(this.options[this.selectedIndex].text)
        response = await axiosApp.post("/api/getSelectFromTable", {
            table: "facultades",
            data: "facultad",
            condition1: "universidad",
            condition2: this.options[this.selectedIndex].text
        })
    }
    loadOptions(response.data.data[0])
})
document.querySelector("#carrera").addEventListener("change", async function () {
    if (this.selectedIndex != 0) {
        filterTableBy(this.options[this.selectedIndex].text)
    }
})
document.querySelector("#curso").addEventListener("change", async function () {
    if (this.selectedIndex != 0) {
        filterTableBy(this.options[this.selectedIndex].text)
    }
})

window.onload = async function () {
    await loadUniMenuOptions()
    await loadTable()
};