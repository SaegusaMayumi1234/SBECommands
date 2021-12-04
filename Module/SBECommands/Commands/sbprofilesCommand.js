import { errorHypixelAPI, errorMojangAPI } from "../Modules/errorHandler"
import { getHypixelPlayer, getMojang, getSkyblockData } from "../Modules/requestHandler"
import { humanizeTime } from "../Utils/humanizeTime"
import { formatRank } from "../Utils/formatRank"
import { timestampToDate } from "../Utils/timestampToDate"

function run(args) {
    let name = args[0] == undefined ? Player.getName() : args[0]
    getMojang(name).then(mojang => {
        getSkyblockData(mojang.body.id).then(skyblock => {
            if (skyblock.body.profiles == null) {
                noProfile(mojang.body.id, mojang.body.name)
            } else {
                hasProfile(mojang.body.id, skyblock.body.profiles)
            }
        }).catch(error => {
            errorHypixelAPI(error, "while getting skyblock data")
        })
    }).catch(error => {
        errorMojangAPI(error)
    })
}

function noProfile(uuid, username) {
    getHypixelPlayer(uuid).then(player => {
        let name = player.body.player == null ? `&7${username}` : formatRank(player.body.player)
        ChatLib.chat("&c&m--------------------&r")
        ChatLib.chat(`${name} &cdoesn't have any skyblock profiles!&r`)
        ChatLib.chat("&c&m--------------------&r")
    }).catch(error => {
        errorHypixelAPI(error, "while trying to get player data")
    })
}

function hasProfile(uuid, profiles) {
    getHypixelPlayer(uuid).then(player => {
        let name = player.body.player == null ? `&7${username}` : formatRank(player.body.player)
        let chatArray = []
        profiles.forEach(profile => {
            chatArray.push(`&b${profile.cute_name}: &e~${humanizeTime(new Date().getTime() - profile.members[uuid].last_save)}`)
            chatArray.push(`&7${timestampToDate(profile.members[uuid].last_save)}`)
        });
        ChatLib.chat("&c&m--------------------&r")
        ChatLib.chat(`&bProfiles for: ${name}`)
        ChatLib.chat("&r")
        chatArray.forEach(chat => {
            ChatLib.chat(chat)
        })
        ChatLib.chat("&r")
        ChatLib.chat("&c&m--------------------&r")
    }).catch(error => {
        errorHypixelAPI(error, "while trying to get player data")
    })
}

function help() {
    const helpMessage = new Message().addTextComponent(new TextComponent(` &a◆ /sbprofiles &8(Hover for usage)&r &7↣Returns profiles for given player&r`).setHover("show_text", `&esbprofiles [username]`))
    helpMessage.chat()
}

export { run, help }