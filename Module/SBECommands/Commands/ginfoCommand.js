import { getMojang, getGuild, getHypixelPlayer } from "../Modules/requestHandler"
import { formatRank } from "../Utils/formatRank"
import { errorHypixelAPI, errorMojangAPI } from "../Modules/errorHandler"

function run(args) {
    let name = args[0] == undefined ? Player.getName() : args[0]
    getMojang(name).then(mojang => {
        getGuild(mojang.body.id).then(guild => {
            if (guild.body.guild == null) {
                notInGuild(mojang.body.id, mojang.body.name)
            } else if (guild.body.guild != null) {
                let members = guild.body.guild.members
                let owner = members.filter(member => member.rank === "Guild Master")
                if (owner.length === 0) {
                    owner = members.filter(member => member.rank === "GUILDMASTER")
                }
                isInGuild(mojang.body.id, owner[0].uuid, guild.body.guild.name)
            }
        }).catch(error => {
            errorHypixelAPI(error, "while trying to get guild data")
        })
    }).catch(error => {
        errorMojangAPI(error)
    })
}

function notInGuild(useruuid, username) {
    getHypixelPlayer(useruuid).then(user => {
        let name = user.body.player == null ? `&7${username}` : formatRank(user.body.player)
        ChatLib.chat("&c&m--------------------&r")
        ChatLib.chat(`${name} &cis not in a Guild!&r`)
        ChatLib.chat("&c&m--------------------&r")
    }).catch(error => {
        errorHypixelAPI(error, "while trying to get player data")
    })
}

function isInGuild(useruuid, owneruuid, guildname) {
    getHypixelPlayer(useruuid).then(user => {
        getHypixelPlayer(owneruuid).then(owner => {
            ChatLib.chat("&c&m--------------------&r")
            ChatLib.chat(`&bGuild Data for: ${formatRank(user.body.player)}&r`)
            ChatLib.chat(`&bGuild: &a${guildname}&r`)
            ChatLib.chat(`&bGuild Master: ${formatRank(owner.body.player)}&r`)
            ChatLib.chat("&c&m--------------------&r")
        }).catch(error => {
            errorHypixelAPI(error, "while trying to get player data")
        })
    }).catch(error => {
        errorHypixelAPI(error, "while trying to get player data")
    })
}

function help() {
    const helpMessage = new Message().addTextComponent(new TextComponent(` &a◆ /ginfo &8(Hover for usage)&r &7↣Returns guild data for a player`).setHover("show_text", `&eginfo [username]`))
    helpMessage.chat()
}

export { run, help }