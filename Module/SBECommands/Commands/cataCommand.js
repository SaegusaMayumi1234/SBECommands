import { errorHypixelAPI, errorHypixelSenitherAPI, errorMojangAPI } from "../Modules/errorHandler"
import { getHypixelPlayer, getMojang, getSkyblockData, getSkyblockSenitherData } from "../Modules/requestHandler"
import { formatRank } from "../Utils/formatRank"
import { leveling_xp } from '../Constants/leveling_xp'
import { addNotation } from "../Utils/addNotation"
import { timestampToTime } from "../Utils/timestampToTime"
import { toTitleCase } from "../Utils/stringCase"

const classSequence = [
    "archer",
    "berserker",
    "healer",
    "mage",
    "tank"
]


const classToMessage = {
    "archer": "&6 ☣ Archer",
    "berserker": "&c ⚔ Berserk",
    "healer": "&a ❤ Healer",
    "mage": "&b ✎ Mage",
    "tank": "&7 ❈ Tank"
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
        chat.push(new Message().addTextComponent(new TextComponent("&b Data for: " + name + "&r")))
        //catacombs
        let cataLevel = skyblockSe.dungeons == null ? 0 : skyblockSe.dungeons.types.catacombs.level
        let cataExp = skyblockSe.dungeons == null ? 0 : skyblockSe.dungeons.types.catacombs.experience
        let cataMessage = `&d ☠ Cata Level: &e${cataLevel.toFixed(2)}&r`
        let cataHover
        if (cataLevel < leveling_xp.leveling_caps.catacombs) {
            let currLevel = Math.floor(cataLevel)
            let nextLevel = currLevel + 1
            let nextExp = leveling_xp.catacombs[nextLevel]
            let expBeforeNextLevel = leveling_xp.catacombs.slice(0, currLevel + 1)
            expBeforeNextLevel = expBeforeNextLevel.reduce((a, b) => a + b)
            expBeforeNextLevel = cataExp - expBeforeNextLevel
            cataHover = `&a[&6${addNotation("commas", expBeforeNextLevel)}&a/&d${addNotation("commas", nextExp)}&a]`
        } else {
            cataHover = `&a[&6${addNotation("commas", cataExp)}&a/&d0&a]`
        }
        chat.push(new Message().addTextComponent(new TextComponent(cataMessage).setHover("show_text", cataHover)))
        //space
        chat.push(new Message().addTextComponent(new TextComponent(`&r`)))
        //class average
        let classAverage
        classSequence.forEach(classDungeon => {
            classAverage = (classAverage || 0) + (skyblockSe.dungeons == null ? 0 : skyblockSe.dungeons.classes[classDungeon].level)
        })
        classAverage = classAverage / 5
        chat.push(new Message().addTextComponent(new TextComponent(`&2 Φ Class Average: &e${classAverage.toFixed(2)}&r`)))
        //class Level
        classSequence.forEach(classDungeon => {
            let classLevel = skyblockSe.dungeons == null ? 0 : skyblockSe.dungeons.classes[classDungeon].level
            let classExp = skyblockSe.dungeons == null ? 0 : skyblockSe.dungeons.classes[classDungeon].experience
            let classMessage = `${classToMessage[classDungeon]} Level: &e${classLevel.toFixed(2)}&r`
            let classHover
            if (classLevel < leveling_xp.leveling_caps.catacombs) {
                let currLevel = Math.floor(classLevel)
                let nextLevel = currLevel + 1
                let nextExp = leveling_xp.catacombs[nextLevel]
                let expBeforeNextLevel = leveling_xp.catacombs.slice(0, currLevel + 1)
                expBeforeNextLevel = expBeforeNextLevel.reduce((a, b) => a + b)
                expBeforeNextLevel = classExp - expBeforeNextLevel
                classHover = `&a[&6${addNotation("commas", expBeforeNextLevel)}&a/&d${addNotation("commas", nextExp)}&a]`
            } else {
                classHover = `&a[&6${addNotation("commas", classExp)}&a/&d0&a]`
            }
            chat.push(new Message().addTextComponent(new TextComponent(classMessage).setHover("show_text", classHover)))
        })
        //space
        chat.push(new Message().addTextComponent(new TextComponent(`&r`)))
        //Floor Completion
        let catacombsData = skyblockHy.members[uuid].dungeons.dungeon_types.catacombs
        let floorCompletionHover = "&cCompletions:"
        for (let i = 1; i < 8; i++) {
            let completionFloor = 0

            if (catacombsData.tier_completions !== undefined) {
                completionFloor = catacombsData.tier_completions[i] !== undefined ? catacombsData.tier_completions[i] : 0
            }
            floorCompletionHover += `\n&e${i}] &a${completionFloor}`
        }
        chat.push(new Message().addTextComponent(new TextComponent(`&b Floor &bCompletions: &7(Hover)&r`).setHover("show_text", floorCompletionHover)))
        //fastest S
        let fastesSHover = "&cS:"
        for (let i = 1; i < 8; i++) {
            let time = null

            if (catacombsData.fastest_time_s !== undefined) {
                time = catacombsData.fastest_time_s[`${i}`] !== undefined ? catacombsData.fastest_time_s[`${i}`] : null
            }
            time = timestampToTime(time)
            fastesSHover += `\n&e${i}] &a${time}`
        }
        chat.push(new Message().addTextComponent(new TextComponent(`&b Fastest &6S  &bCompletions: &7(Hover)&r`).setHover("show_text", fastesSHover)))
        //fastest S+
        let fastesSplusHover = "&cS+:"
        for (let i = 1; i < 8; i++) {
            let time = null

            if (catacombsData.fastest_time_s_plus !== undefined) {
                time = catacombsData.fastest_time_s_plus[`${i}`] !== undefined ? catacombsData.fastest_time_s_plus[`${i}`] : null
            }
            time = timestampToTime(time)
            fastesSplusHover += `\n&e${i}] &a${time}`
        }
        chat.push(new Message().addTextComponent(new TextComponent(`&b Fastest &6S+  &bCompletions: &7(Hover)&r`).setHover("show_text", fastesSplusHover)))
        //space
        chat.push(new Message().addTextComponent(new TextComponent(`&r`)))
        //Master mode section
        chat.push(new Message().addTextComponent(new TextComponent(`&4 --Master Mode--&r`)))
        //Master Floor Completion
        let mastercatacombsData = skyblockHy.members[uuid].dungeons.dungeon_types.master_catacombs
        let masterfloorCompletionHover = "&4Master &cCompletions:"
        for (let i = 1; i < 8; i++) {
            let completionFloor = 0

            if (mastercatacombsData.tier_completions !== undefined) {
                completionFloor = mastercatacombsData.tier_completions[i] !== undefined ? mastercatacombsData.tier_completions[i] : 0
            }
            masterfloorCompletionHover += `\n&e${i}] &a${completionFloor}`
        }
        chat.push(new Message().addTextComponent(new TextComponent(`&b Floor &bCompletions: &7(Hover)&r`).setHover("show_text", masterfloorCompletionHover)))
        //Master fastest S
        let masterfastesSHover = "&cS:"
        for (let i = 1; i < 8; i++) {
            let time = null

            if (mastercatacombsData.fastest_time_s !== undefined) {
                time = mastercatacombsData.fastest_time_s[`${i}`] !== undefined ? mastercatacombsData.fastest_time_s[`${i}`] : null
            }
            time = timestampToTime(time)
            masterfastesSHover += `\n&e${i}] &a${time}`
        }
        chat.push(new Message().addTextComponent(new TextComponent(`&b Fastest &6S  &bCompletions: &7(Hover)&r`).setHover("show_text", masterfastesSHover)))
        //Master fastest S+
        let masterfastesSplusHover = "&cS+:"
        for (let i = 1; i < 8; i++) {
            let time = null

            if (mastercatacombsData.fastest_time_s_plus !== undefined) {
                time = mastercatacombsData.fastest_time_s_plus[`${i}`] !== undefined ? mastercatacombsData.fastest_time_s_plus[`${i}`] : null
            }
            time = timestampToTime(time)
            masterfastesSplusHover += `\n&e${i}] &a${time}`
        }
        chat.push(new Message().addTextComponent(new TextComponent(`&b Fastest &6S+  &bCompletions: &7(Hover)&r`).setHover("show_text", masterfastesSplusHover)))
        //total Secrets
        let totalSecret = skyblockSe.dungeons !== null ? skyblockSe.dungeons.secrets_found : 0
        chat.push(new Message().addTextComponent(new TextComponent(`&a Total Secrets Found: &e${addNotation("commas", totalSecret)}&r`)))
        //wither Perk
        let perks = skyblockHy.members[uuid].perks !== undefined ? skyblockHy.members[uuid].perks : null
        let perksHover = null
        if (perks !== null) {
            let perksArray = Array.from(Object.keys(perks))
            let perkHoverTemp = []
            perksArray.forEach(perk => {
                perkHoverTemp.push(`&3${toTitleCase(perk.replace(/_/g, " "))} &f: &a${perks[perk]}`)
            })
            perksHover = perkHoverTemp.join("\n")
        } else {
            perksHover = "null"
        }
        chat.push(new Message().addTextComponent(new TextComponent(` &8Wither Perks: &7(Hover)&r`).setHover("show_text", perksHover)))
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
    const helpMessage = new Message().addTextComponent(new TextComponent(` &a◆ /cata &8(Hover for usage)&r &7↣Returns catacombs data for player&r`).setHover("show_text", `&ecata [username] (profileName)`))
    helpMessage.chat()
}

export { run, help }