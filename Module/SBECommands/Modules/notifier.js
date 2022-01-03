import { save, get } from "./presistentData"
save()

const metadata = JSON.parse(FileLib.read("SBECommands", "metadata.json"))

const version = metadata.version
const firstMessage = [
    `&3&l&nSBECommands ${version}`,
    "",
    "&aThank for for installing SBECommands!",
    "&7You can view all the command by using &e/sbec",
    "",
    "&4This not affiliated with SBE in any ways.",
    "&cPlease don't import this if you already has SBE",
    "",
    "&aIf you have suggestions or found a bug,",
    "&aDM &bIcarusPhantom#9084"
]

const changelogMessage = [
    `&3&l&nSBECommands ${version}`,
    "",
    "&aChangelog:",
    "&b - Changing nw command api to using my own fork!",
    "&b - nw command details now give color code because I modified maro api to support this!",
    "&c - Note: nw command api can down anytime since I use free host. So please report it to me when it down!"
]

if (get("firsttime")) {
    ChatLib.chat(`&b&m${ChatLib.getChatBreak(" ")}`)
    for (let msg of firstMessage) {
        ChatLib.chat(ChatLib.getCenteredText(msg))
    }
    ChatLib.chat(`&b&m${ChatLib.getChatBreak(" ")}`)
    save("firsttime", false)
}

if (get("version") != version) {
    ChatLib.chat(`&b&m${ChatLib.getChatBreak(" ")}`)
    for (let i = 0; i < changelogMessage.length; i++) {
        if (i == 0) {
            ChatLib.chat(ChatLib.getCenteredText(changelogMessage[i]))
        } else {
            ChatLib.chat(changelogMessage[i])
        }
    }
    ChatLib.chat(`&b&m${ChatLib.getChatBreak(" ")}`)
    save("version", version)
}

export function nothing() {}