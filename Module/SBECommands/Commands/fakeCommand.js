function run(args) {
    ChatLib.chat(args.join(" "))
}

function help() {
    const helpMessage = new Message().addTextComponent(new TextComponent(` &a◆ /fake &8(Hover for usage)&r &7↣Returns new faked string. Color Codes enabled&r`).setHover("show_text", `&efake`))
    helpMessage.chat()
}

export { run, help }