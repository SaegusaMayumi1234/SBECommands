import Settings from "../ConfigData/config"

function run(args) {
    Settings.openGUI()
}

function help() {
    const helpMessage = new Message().addTextComponent(new TextComponent(` &a◆ /sbecsettings &8(Hover for usage)&r &7↣Opening SBEC Settings GUI&r`).setHover("show_text", `&esbecsettings`))
    helpMessage.chat()
}

export { run, help }