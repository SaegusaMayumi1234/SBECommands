import { errorHypixelAPI, errorMojangAPI } from "../Modules/errorHandler"
import { getHypixelPlayer, getMojang, getSkyblockData } from "../Modules/requestHandler"
import { addNotation } from "../Utils/addNotation"
import { formatRank } from "../Utils/formatRank"

function run(args) {
    let name = args[0] == undefined ? Player.getName() : args[0]
    let profileArg = args[1] == undefined ? "last_save" : args[1]
    getMojang(name).then(mojang => {
        getSkyblockData(mojang.body.id).then(skyblockHy => {
            if (skyblockHy.body.profiles == null) {
                noProfile(mojang.body.id, mojang.body.name)
            } else {
                if (profileArg === "last_save") {
                    let profiles = skyblockHy.body.profiles.sort((a, b) => b.members[mojang.body.id].last_save - a.members[mojang.body.id].last_save)
                    let profileMatched = profiles[0]
                    matchProfile(mojang.body.id, profileMatched)
                } else {
                    let profiles = skyblockHy.body.profiles
                    let profileMatched = null
                    profiles.forEach(profile => {
                        if (profile.cute_name.toLowerCase() == profileArg.toLowerCase()) {
                            profileMatched = profile
                        }
                    })
                    if (profileMatched != null) {
                        matchProfile(mojang.body.id, profileMatched)
                    } else {
                        noMatchProfile(mojang.body.id, profileArg)
                    }
                }
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

function noMatchProfile(uuid, profileArg) {
    getHypixelPlayer(uuid).then(player => {
        let name = player.body.player == null ? `&7${username}` : formatRank(player.body.player)
        ChatLib.chat("&c&m--------------------&r")
        ChatLib.chat(`${name} &cdoesn't have any skyblock profile named '${profileArg}'!&r`)
        ChatLib.chat("&c&m--------------------&r")
    }).catch(error => {
        errorHypixelAPI(error, "while trying to get player data")
    })
}

function matchProfile(uuid, skyblockHy) {
    getHypixelPlayer(uuid).then(player => {
        let name = formatRank(player.body.player)
        let chat = []

        //get essence data
        if (skyblockHy.members[uuid].inv_contents == undefined) {
            chat.push(new Message().addTextComponent(new TextComponent(`&3[SBEC] &cInventory API is not enabled for: ${name}&r`)))
        } else {
            chat.push(new Message().addTextComponent(new TextComponent("&bDungeon Essence for: " + name + "&r")))
            chat.push(new Message().addTextComponent(new TextComponent(`&8Wither Essence: &a${skyblockHy.members[uuid].essence_wither ? addNotation("commas", skyblockHy.members[uuid].essence_wither) : 0}&r`)))
            chat.push(new Message().addTextComponent(new TextComponent(`&cUndead Essence: &a${skyblockHy.members[uuid].essence_undead ? addNotation("commas", skyblockHy.members[uuid].essence_undead) : 0}&r`)))
            chat.push(new Message().addTextComponent(new TextComponent(`&dDragon Essence: &a${skyblockHy.members[uuid].essence_dragon ? addNotation("commas", skyblockHy.members[uuid].essence_dragon) : 0}&r`)))
            chat.push(new Message().addTextComponent(new TextComponent(`&bIce Essence: &a${skyblockHy.members[uuid].essence_ice ? addNotation("commas", skyblockHy.members[uuid].essence_ice) : 0}&r`)))
            chat.push(new Message().addTextComponent(new TextComponent(`&6Spider Essence: &a${skyblockHy.members[uuid].essence_spider ? addNotation("commas", skyblockHy.members[uuid].essence_spider) : 0}&r`)))
            chat.push(new Message().addTextComponent(new TextComponent(`&3Diamond Essence: &a${skyblockHy.members[uuid].essence_diamond ? addNotation("commas", skyblockHy.members[uuid].essence_diamond) : 0}&r`)))
            chat.push(new Message().addTextComponent(new TextComponent(`&eGold Essence: &a${skyblockHy.members[uuid].essence_gold ? addNotation("commas", skyblockHy.members[uuid].essence_gold) : 0}&r`)))
        }
        //chat
        ChatLib.chat("&c&m--------------------&r")
        chat.forEach(msg => {
            msg.chat()
        })
        ChatLib.chat("&c&m--------------------&r")
    }).catch(error => {
        errorHypixelAPI(error, "while trying to get player data")
    })
}

function help() {
    const helpMessage = new Message().addTextComponent(new TextComponent(` &a◆ /essence &8(Hover for usage)&r &7↣Returns a player's dungeon essence values.&r`).setHover("show_text", `&eessence [username] (profileName)`))
    helpMessage.chat()
}

export { run, help }