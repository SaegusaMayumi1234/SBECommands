import PogObject from '../../PogData'

let presistentData = new PogObject("SBECommands", {
    "apikey": null,
    "firsttime": true,
    "version": "1.0.0"
}, "ConfigData/data.json")

function save(param, variable) {
    if (param === "apikey") {
        presistentData.apikey = variable
    } else if (param === "firsttime") {
        presistentData.firsttime = variable
    } else if (param === "version") {
        presistentData.version = variable
    }
    presistentData.save()
}

function get(param) {
    if (param === "apikey") {
        return presistentData.apikey
    } else if (param === "firsttime") {
        return presistentData.firsttime
    } else if (param === "version") {
        return presistentData.version
    }
}

export { save, get }