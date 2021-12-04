import { errorHypixelAPI, errorHypixelSenitherAPI, errorMojangAPI } from "../Modules/errorHandler"
import { getHypixelPlayer, getMojang, getSkyblockData, getSkyblockSenitherData } from "../Modules/requestHandler"
import { formatRank } from "../Utils/formatRank"
import { leveling_xp } from '../Constants/leveling_xp'
import { addNotation } from "../Utils/addNotation"

const skillSequence = [
    "Farming",
    "Mining",
    "Combat",
    "Foraging",
    "Fishing",
    "Enchanting",
    "Alchemy",
    "Taming"
]

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
        //skills
        skillSequence.forEach(skill => {
            let levelMessage = `&a${skill}: `
            let hoverMessage = null
            let level = skyblockSe.skills[skill.toLowerCase()].level
            let exp = skyblockSe.skills[skill.toLowerCase()].experience
            if (skyblockSe.skills.apiEnabled) {
                if (level < leveling_xp.leveling_caps[skill.toLowerCase()]) {
                    levelMessage += "&3&l" + level.toFixed(2).replace(".", "&b.") + "&r"
                    let currLevel = Math.floor(level)
                    let nextLevel = currLevel + 1
                    let nextExp = leveling_xp.leveling_xp[nextLevel]
                    let expBeforeNextLevel = leveling_xp.leveling_xp.slice(0, currLevel + 1)
                    expBeforeNextLevel = expBeforeNextLevel.reduce((a, b) => a + b)
                    expBeforeNextLevel = exp - expBeforeNextLevel
                    let nextPercent = Math.round(expBeforeNextLevel / nextExp * 100)
                    let proggressLevel = "&f-&f-&f-&f-&f-&f-&f-&f-&f-&f-&f-&f-&f-&f-&f-&f-&f-&f-&f-&f-"
                    let needChange = Math.round(nextPercent / 5)
                    for (let i = 0; i < needChange; i++) {
                        proggressLevel = proggressLevel.replace("f", "2")
                    }
                    hoverMessage = `&7Progress to Level ${nextLevel}: &e${nextPercent}%\n${proggressLevel} &e${addNotation("commas", expBeforeNextLevel)}&6/&e${addNotation("commas", nextExp)}`
                } else {
                    levelMessage += "&6&l" + level.toFixed(2) + " &7(Hover)&r"
                    hoverMessage = `&6MAXED OUT!\n&e${addNotation("commas", exp)}&6/&e0`
                }
            } else {
                levelMessage += `&7&l${level.toFixed(2)}&r`
                hoverMessage = "&6N/A"
            }
            chat.push(new Message().addTextComponent(new TextComponent(levelMessage).setHover("show_text", hoverMessage)))
        })
        //average skills
        chat.push(new Message().addTextComponent(new TextComponent(`&bAverage Skill Level: &6&l${skyblockSe.skills.average_skills.toFixed(2)}&r`)))
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
    const helpMessage = new Message().addTextComponent(new TextComponent(` &a◆ /sbskills &8(Hover for usage)&r &7↣Returns information on skills for player&r`).setHover("show_text", `&esbskills [username] (profileName)`))
    helpMessage.chat()
}

export { run, help }