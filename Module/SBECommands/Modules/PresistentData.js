import PogObject from '../../PogData'

let presistentData = new PogObject("SBECommands", {
    "apikey": null,
}, "ConfigData/data.json")

function save(param, variable) {
    if (param === "apikey") {
        presistentData.apikey = variable
    }
    presistentData.save()
}

function get(param) {
    if (param === "apikey") {
        return presistentData.apikey
    }
}

export { save, get }