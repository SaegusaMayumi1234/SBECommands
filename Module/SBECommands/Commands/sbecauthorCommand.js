const metadata = JSON.parse(FileLib.read("SBECommands", "metadata.json"))

function run(args) {
    let chat = []
    chat.push(new Message().addTextComponent(new TextComponent(`&aName: &3${metadata.name}`)))
    chat.push(new Message().addTextComponent(new TextComponent(`&aVersion: &e${metadata.version}`)))
    chat.push(new Message().addTextComponent(new TextComponent(`&aDescription: &e${metadata.description}`)))
    chat.push(new Message().addTextComponent(new TextComponent(`&bAuthor: &b${metadata.author} &e(IcarusPhantom#9084)`)))
    chat.push(new Message().addTextComponent(new TextComponent(`&bGitHub: `)))
    chat[4].addTextComponent(new TextComponent(`&6&llink`).setClick("open_url", "https://github.com/SaegusaMayumi1234/SBECommands"))
    ChatLib.chat("&b&m--------------------&r")
    chat.forEach(msg => {
        msg.chat()
    })
    ChatLib.chat("&b&m--------------------&r")
}

function help() {
    const helpMessage = new Message().addTextComponent(new TextComponent(` &a◆ /sbecauthor &8(Hover for usage)&r &7↣Return some information about the author of this module&r`).setHover("show_text", `&esbecauthor`))
    helpMessage.chat()
}

export { run, help }