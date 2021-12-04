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
        let name = formatRank(player.body.player)
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

        chat.push(new Message().addTextComponent(new TextComponent(`&bData for: ${name}&r`)))

        let skillHover = ""
        skillSequence.forEach(skill => {
            let levelHover = `&a${skill}: `
            let level = skyblockSe.skills[skill.toLowerCase()].level
            if (skyblockSe.skills.apiEnabled) {
                if (level < leveling_xp.leveling_caps[skill.toLowerCase()]) {
                    levelHover += "&3&l" + level.toFixed(2).replace(".", "&b.") + "&r"
                } else {
                    levelHover += "&6&l" + level.toFixed(2) + "&r"
                }
            } else {
                levelHover += `&7&l${level.toFixed(2)}&r`
            }
            skill == "Taming" ? skillHover += `${levelHover}` : skillHover += `${levelHover}\n`
        })
        chat.push(new Message().addTextComponent(new TextComponent(`&bAverage Skill Level: &6&l${skyblockSe.skills.average_skills.toFixed(2)}`).setHover("show_text", skillHover)))

        let slayerHover = ""
        slayerSequence.forEach(slayer => {
            let slayerAPI = skyblockSe.slayers.bosses[slayerToBosses[slayer]]
            slayer == "Enderman" ? slayerHover += `&b${slayer} XP: &9&l${addNotation("commas", slayerAPI.experience)}` : slayerHover += `&b${slayer} XP: &9&l${addNotation("commas", slayerAPI.experience)}\n`
        })
        chat.push(new Message().addTextComponent(new TextComponent(`&bTotal Slayer XP: &6&l${addNotation("commas", skyblockSe.slayers.total_experience)}&r`).setHover("show_text", slayerHover)))

        let catacombsHover = ""
        catacombsHover += ` &6☣ Archer Level: &e${skyblockSe.dungeons == null ? 0 : skyblockSe.dungeons.classes.archer.level.toFixed(2)}\n`
        catacombsHover += ` &c⚔ Berserk Level: &e${skyblockSe.dungeons == null ? 0 : skyblockSe.dungeons.classes.berserker.level.toFixed(2)}\n`
        catacombsHover += ` &a❤ Healer Level: &e${skyblockSe.dungeons == null ? 0 : skyblockSe.dungeons.classes.healer.level.toFixed(2)}\n`
        catacombsHover += ` &b✎ Mage Level: &e${skyblockSe.dungeons == null ? 0 : skyblockSe.dungeons.classes.mage.level.toFixed(2)}\n`
        catacombsHover += ` &7❈ Tank Level: &e${skyblockSe.dungeons == null ? 0 : skyblockSe.dungeons.classes.tank.level.toFixed(2)}`
        chat.push(new Message().addTextComponent(new TextComponent(`&bCatacombs Level: &6&l${skyblockSe.dungeons == null ? 0 : skyblockSe.dungeons.types.catacombs.level.toFixed(2)}&r`).setHover("show_text", catacombsHover)))

        let weightHover = ""
        weightHover += `&a&m--------------------&r\n`
        weightHover += `&3Weight System\n`
        weightHover += `&aSkill: &3${(skyblockSe.skills.weight + skyblockSe.skills.weight_overflow).toFixed(2)}\n`
        weightHover += `&aDungeon: &3${skyblockSe.dungeons == null ? 0 : (skyblockSe.dungeons.weight + skyblockSe.dungeons.weight_overflow).toFixed(2)}\n`
        weightHover += `&aSlayer: &3${(skyblockSe.slayers.weight + skyblockSe.slayers.weight_overflow).toFixed(2)}\n`
        weightHover += `&cSystem provided by Senither\n`
        weightHover += `&a&m--------------------&r`
        chat.push(new Message().addTextComponent(new TextComponent(`&bTotal Weight: &6&l${(skyblockSe.weight + skyblockSe.weight_overflow).toFixed(2)}&r`).setHover("show_text", weightHover)))

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
    const helpMessage = new Message().addTextComponent(new TextComponent(` &a◆ /weight &8(Hover for usage)&r &7↣Returns weight for player&r`).setHover("show_text", `&eweight [username] (profileName)`))
    helpMessage.chat()
}

export { run, help }