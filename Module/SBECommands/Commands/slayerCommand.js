import { errorHypixelAPI, errorHypixelSenitherAPI, errorMojangAPI } from "../Modules/errorHandler"
import { getHypixelPlayer, getMojang, getSkyblockData, getSkyblockSenitherData } from "../Modules/requestHandler"
import { formatRank } from "../Utils/formatRank"
import { leveling_xp } from '../Constants/leveling_xp'
import { addNotation } from "../Utils/addNotation"

const slayerSequence = [
    "Zombie",
    "Spider",
    "Wolf",
    "Enderman"
]

const slayerToBosses = {
    "Zombie": "revenant",
    "Spider": "tarantula",
    "Wolf": "sven",
    "Enderman": "enderman"
}

function run(args) {
    let name = args[0] == undefined ? Player.getName() : args[0]
    let profileArg = args[1] == undefined ? "last_save" : args[1]
    getMojang(name).then(mojang => {
        getSkyblockData(mojang.body.id).then(skyblockHy => {
            if (skyblockHy.body.profiles == null) {
                noProfile(mojang.body.id, mojang.body.name)
            } else {
                if (profileArg === "last_save") {
                    getSkyblockSenitherData(mojang.body.id, "last_save").then(skyblockSe => {
                        let lastProfName = skyblockSe.body.data.name
                        let profileMatched = null
                        skyblockHy.body.profiles.forEach(profile => {
                            if (profile.cute_name.toLowerCase() == lastProfName.toLowerCase()) {
                                profileMatched = profile
                            }
                        })
                        matchProfile(mojang.body.id, profileMatched, skyblockSe.body.data)
                    }).catch(error => {
                        errorHypixelSenitherAPI(error, "while getting skyblock data")
                    })
                } else {
                    let profiles = skyblockHy.body.profiles
                    let profileMatched = null
                    profiles.forEach(profile => {
                        if (profile.cute_name.toLowerCase() == profileArg.toLowerCase()) {
                            profileMatched = profile
                        }
                    })
                    if (profileMatched != null) {
                        getSkyblockSenitherData(mojang.body.id, null).then(skyblockSe => {
                            let profileMatchedSe = null
                            skyblockSe.body.data.forEach(profile => {
                                if (profile.name.toLowerCase() == profileMatched.cute_name.toLowerCase()) {
                                    profileMatchedSe = profile
                                }
                            })
                            matchProfile(mojang.body.id, profileMatched, profileMatchedSe)
                        }).catch(error => {
                            errorHypixelSenitherAPI(error, "while getting skyblock data")
                        })
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

function matchProfile(uuid, skyblockHy, skyblockSe) {
    getHypixelPlayer(uuid).then(player => {
        let name = formatRank(player.body.player)
        let chat = []
    
        //data for: name
        chat.push(new Message().addTextComponent(new TextComponent("&bData for: " + name + "&r")))
        //total slayer xp
        chat.push(new Message().addTextComponent(new TextComponent(`&bTotal Slayer XP: &6&l${addNotation("commas", skyblockSe.slayers.total_experience)}&r`)))
        //space
        chat.push(new Message().addTextComponent(new TextComponent(`&r`)))
        //slayers
        slayerSequence.forEach(slayer => {
            let slayerAPI = skyblockSe.slayers.bosses[slayerToBosses[slayer]]
            let slayerMessage = `&b${slayer} XP: &9&l${addNotation("commas", slayerAPI.experience)}\n&7(Hover for tier analysis)&r`
            let currLevel = Math.floor(slayerAPI.level)
            let hoverMessage = `&7Current LVL: &e${currLevel}\n`
            if (currLevel < 9) {
                let nextLevel = currLevel + 1
                let nextExp = leveling_xp.slayer_xp[slayer.toLowerCase()][nextLevel - 1]
                let nextPercent = Math.round(slayerAPI.experience / nextExp * 100)
                let proggressLevel = "&f-&f-&f-&f-&f-&f-&f-&f-&f-&f-&f-&f-&f-&f-&f-&f-&f-&f-&f-&f-"
                let needChange = Math.round(nextPercent / 5)
                for (let i = 0; i < needChange; i++) {
                    proggressLevel = proggressLevel.replace("f", "5")
                }
                hoverMessage += `&r\n&7${slayer} Slayer XP to LVL ${nextLevel}:\n${proggressLevel} &d${addNotation("commas", slayerAPI.experience)}&5/&d${addNotation("commas", nextExp)}\n`
            } else {
                hoverMessage += `&a&lReached max level!\n`
            }
            let approxCoins
            for (let i = 0; i < 5; i++) {
                let tier = "tier_" + (i + 1)
                hoverMessage += `&aTier ${i + 1} Kills: &b${slayerAPI.kills[tier]}\n`
                approxCoins = (approxCoins || 0) + slayerAPI.kills[tier] * leveling_xp.slayer_boss_price[i]
            }
            hoverMessage += `&r\n&3Approximate Coins Spent: &a${addNotation("commas", approxCoins)}`
            chat.push(new Message().addTextComponent(new TextComponent(slayerMessage).setHover("show_text", hoverMessage)))
        })
        //Approximate coins
        chat.push(new Message().addTextComponent(new TextComponent(`&3Approximate Coins Spent: &a${addNotation("commas", skyblockSe.slayers.total_coins_spent)}&r`)))
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
    const helpMessage = new Message().addTextComponent(new TextComponent(` &a◆ /slayer &8(Hover for usage)&r &7↣Returns information on slayer for player&r`).setHover("show_text", `&eslayer [username] (profileName)`))
    helpMessage.chat()
}

export { run, help }