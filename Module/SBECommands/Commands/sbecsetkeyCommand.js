import { errorHypixelAPI } from '../Modules/errorHandler'
import { save } from '../Modules/presistentData'
import { getApiKeyStatus } from '../Modules/requestHandler'

function run(args) {
    if (args[0] == undefined) {
        ChatLib.chat("&3[SBEC] &a&cImproper Usage. /sbecsetkey [key]&r")
        return
    }
    if (args[0].length != 36) {
        ChatLib.chat("&3[SBEC] &a&cInvalid API Key. Please insert your valid Hypixel API Key&r")
        return
    }
    getApiKeyStatus(args[0]).then(res => {
        if (res.body.success) {
            ChatLib.chat("&3[SBEC] &aThe Hypixel API key has been saved!&r")
            save("apikey", args[0])
        }
    }).catch(error => {
        errorHypixelAPI(error, "while trying to verify your apikey")
    })
}

register("chat",(apikey)=>{
	ChatLib.chat("&3[SBEC] &aThe Hypixel API key has been saved!&r")
	save("apikey", apikey)
}).setChatCriteria("&aYour new API key is &r&b${apikey}&r")

function help() {
    const helpMessage = new Message().addTextComponent(new TextComponent(` &a◆ /sbecsetkey &8(Hover for usage)&r &7↣Set Hypixel API Key&r`).setHover("show_text", `&esbecsetkey [key]`))
    helpMessage.chat()
}

export { run, help }