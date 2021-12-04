import { errorHypixelAPI, errorMojangAPI } from "../Modules/errorHandler"
import { getHypixelPlayer, getMojang, getSkyblockData } from "../Modules/requestHandler"
import { formatRank } from "../Utils/formatRank"
import { toTitleCase } from "../Utils/stringCase"
import { leveling_xp } from "../Constants/leveling_xp"
import { addNotation } from "../Utils/addNotation"
import { nodeToName } from "../Constants/hotm"

const crystalSequence = [
    "jade",
    "amber",
    "topaz",
    "sapphire",
    "amethyst",
    "jasper",
    "ruby"
]

const crsytalToColor = {
    "jade": "a",
    "amber": "6",
    "topaz": "e",
    "sapphire": "b",
    "amethyst": "5",
    "jasper": "d",
    "ruby": "c"
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
        let chatNum = 0

        //data for: name
        chat.push(new Message().addTextComponent(new TextComponent("&bHOTM Data for: " + name + "&r")))
        chatNum++
        //get hotm level and exp
        let hotmexp = skyblockHy.members[uuid].mining_core.experience || 197000
        hotmexp = hotmexp >= 197000 ? hotmexp - 197000 : hotmexp
        let levelsExp = leveling_xp.HOTM
        let hotmLevel = 0
        for (let i = 0; i < levelsExp.length; i++) {
            if (hotmexp >= levelsExp[i]) {
                hotmLevel++;
            } else {
                break;
            }
        }
        let hotmExpRemaining = ""
        if (hotmLevel < leveling_xp.leveling_caps.HOTM) {
            let nextExp = leveling_xp.HOTM[hotmLevel]
            hotmExpRemaining = `&6[&a${addNotation("commas", hotmexp)}&6/&a${addNotation("commas", nextExp)}&6]&r`
        } else {
            hotmExpRemaining = "&6Maxed!"
        }
        chat.push(new Message().addTextComponent(new TextComponent(`&6Level &d${hotmLevel}&6 - ${hotmExpRemaining}`)))
        chatNum++
        //tree perks
        let treePerks = skyblockHy.members[uuid].mining_core.nodes
        let treePerksArr = Array.from(Object.keys(treePerks))
        let hoverTreePerk = []
        treePerksArr.forEach(perk => {
            if (nodeToName[perk] !== undefined) {
                hoverTreePerk.push(`&a${nodeToName[perk]}&f: &3${treePerks[perk]}`)
            }
        })
        chat.push(new Message().addTextComponent(new TextComponent(`&2Tree Perks: `)))
        chat[chatNum].addTextComponent(new TextComponent(`&7(Hover)&r`).setHover("show_text", hoverTreePerk.join("\n")))
        //crystall
        chat.push(new Message().addTextComponent(new TextComponent(`&dCrystals:&r`)))
        crystalSequence.forEach(crsytal => {
            if (skyblockHy.members[uuid].mining_core.crystals !== undefined) {
                if (crsytal == "jasper" || crsytal == "ruby") {
                    let state = "&cNot Found!"
                    if (skyblockHy.members[uuid].mining_core.crystals[crsytal + "_crystal"].state == "FOUND") {
                        state = "&aFound!"
                    }
                    chat.push(new Message().addTextComponent(new TextComponent(` &3- &${crsytalToColor[crsytal]}${toTitleCase(crsytal)}&3 - ${state}`)))
                } else {
                    let state = "&cNot Found!"
                    let places = 0
                    if (skyblockHy.members[uuid].mining_core.crystals[crsytal + "_crystal"].state !== undefined) {
                        if (skyblockHy.members[uuid].mining_core.crystals[crsytal + "_crystal"].state == "FOUND") {
                            state = "&aFound!"
                        }
                        places = skyblockHy.members[uuid].mining_core.crystals[crsytal + "_crystal"].total_placed
                    }
                    chat.push(new Message().addTextComponent(new TextComponent(` &3- &${crsytalToColor[crsytal]}${toTitleCase(crsytal)} (${places})&3 - ${state}`)))
                }
            } else {
                if (crsytal == "jasper" || crsytal == "ruby") {
                    chat.push(new Message().addTextComponent(new TextComponent(` &3- &${crsytalToColor[crsytal]}${toTitleCase(crsytal)}&3 - &cNot Found!`)))
                } else {
                    chat.push(new Message().addTextComponent(new TextComponent(` &3- &${crsytalToColor[crsytal]}${toTitleCase(crsytal)} (0)&3 - &cNot Found!`)))
                }
            }
        })
        //Total Runs
        let totalRuns = player.body.player.achievements.skyblock_crystal_nucleus ? player.body.player.achievements.skyblock_crystal_nucleus : 0
        chat.push(new Message().addTextComponent(new TextComponent(` &3- &cTotal Runs: &a${addNotation("commas", totalRuns)}&r`)))
        //powder
        chat.push(new Message().addTextComponent(new TextComponent(`&aPowder &6[&aAvailable&6/&bTotal&6]&a:&r`)))
        let availableMithrilPw = skyblockHy.members[uuid].mining_core.powder_mithril_total ? addNotation("commas", skyblockHy.members[uuid].mining_core.powder_mithril_total) : 0
        let totalMithrilPw = skyblockHy.members[uuid].mining_core.powder_spent_mithril ? addNotation("commas", skyblockHy.members[uuid].mining_core.powder_spent_mithril) : availableMithrilPw
        chat.push(new Message().addTextComponent(new TextComponent(` &3- &2Mithril: &6[&a${availableMithrilPw}&6/&b${totalMithrilPw}&6]`)))
        let availableGemstonePw = skyblockHy.members[uuid].mining_core.powder_gemstone_total ? addNotation("commas", skyblockHy.members[uuid].mining_core.powder_gemstone_total) : 0
        let totalGemstonePw = skyblockHy.members[uuid].mining_core.powder_spent_gemstone ? addNotation("commas", skyblockHy.members[uuid].mining_core.powder_spent_gemstone) : availableGemstonePw
        chat.push(new Message().addTextComponent(new TextComponent(` &3- &dGemstone: &6[&a${availableGemstonePw}&6/&b${totalGemstonePw}&6]`)))
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
    const helpMessage = new Message().addTextComponent(new TextComponent(` &a◆ /sbhotm &8(Hover for usage)&r &7↣Returns information on a player's Heart of the Mountain.&r`).setHover("show_text", `&esbhotm [username] (profileName)`))
    helpMessage.chat()
}

export { run, help }