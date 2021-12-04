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
    "&b - First Release!",
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
    for (let msg of changelogMessage) {
        ChatLib.chat(ChatLib.getCenteredText(msg))
    }
    ChatLib.chat(`&b&m${ChatLib.getChatBreak(" ")}`)
    save("version", version)
}

export function nothing() {}