import { errorHypixelAPI, errorMojangAPI } from "../Modules/errorHandler"
import { getHypixelPlayer, getMojang, getSkyblockData } from "../Modules/requestHandler"
import { formatRank } from "../Utils/formatRank"
import { maxCustomLevel, pet_items, pet_levels, pet_rarity_offset, pet_value, pet_rewards, uniquePets } from "../Constants/pet"
import { toTitleCase } from "../Utils/stringCase"

const rarityToColor = {
    "COMMON": "f",
    "UNCOMMON": "a",
    "RARE": "9",
    "EPIC": "5",
    "LEGENDARY": "6",
    "MYTHIC": "d"
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
        
        //data for: name
        chat.push(new Message().addTextComponent(new TextComponent("&bPet data for: " + name + "&r")))
        //get pet name
        let pets = skyblockHy.members[uuid].pets
        if (pets.length == 0) {
            chat.push(new Message().addTextComponent(new TextComponent("&cNo pets")))
        }
        let petsMessage = {
            "MYTHIC": [],
            "LEGENDARY": [],
            "EPIC": [],
            "RARE": [],
            "UNCOMMON": [],
            "COMMON": []
        }
        let petScore = 0
        let uniquePetsHave = []
        pets.forEach(pet => {
            if (pet.heldItem === "PET_ITEM_TOY_JERRY" || pet.heldItem === "PET_ITEM_VAMPIRE_FANG") {
                pet.tier = "MYTHIC"
            }
            let petName = `&${rarityToColor[pet.tier]}${toTitleCase(pet.type.toLowerCase().replace(/_/g, " "))}${pet.skin !== null ? " ✦" : ""}`
            let petheldItem = pet_items[pet.heldItem] !== undefined ? `&${rarityToColor[pet_items[pet.heldItem].tier]}${pet_items[pet.heldItem].name}` : null
            const maxLevel = maxCustomLevel[pet.type] || 100
            const rarityOffset = pet_rarity_offset[pet.tier.toLowerCase()]
            const levels = pet_levels.slice(rarityOffset, rarityOffset + maxLevel - 1);
            let xpTotal = 0;
            let level = 1;
            for (let i = 0; i < maxLevel; i++) {
                xpTotal += levels[i];
                if (xpTotal > pet.exp) {
                  xpTotal -= levels[i];
                  break;
                } else {
                  level++;
                }
            }
            if (level < maxLevel) {
                //
            } else {
                level = maxLevel;
            }
            petName = `${petName} (${level})`
            petsMessage[pet.tier].push({
                name: petName,
                type: pet.type,
                heldItem: petheldItem,
                level: level,
                tier: pet.tier
            })
        })
        if (petsMessage["MYTHIC"].length !== 0) {
            let petsMsgArr = petsMessage["MYTHIC"].sort((a, b) => b.level - a.level)
            petsMsgArr.forEach(petMsg => {
                if (!uniquePetsHave.includes(petMsg.type)) {
                    uniquePetsHave.push(petMsg.type)
                    petScore += pet_value[petMsg.tier.toLowerCase()]
                }
                if (petMsg.heldItem == null) {
                    chat.push(new Message().addTextComponent(new TextComponent(`&b- ${petMsg.name}`)))
                } else {
                    chat.push(new Message().addTextComponent(new TextComponent(`&c**${petMsg.name}`).setHover("show_text", `&bHeld Item: ${petMsg.heldItem}`)))
                }
            })
        }
        if (petsMessage["LEGENDARY"].length !== 0) {
            let petsMsgArr = petsMessage["LEGENDARY"].sort((a, b) => b.level - a.level)
            petsMsgArr.forEach(petMsg => {
                if (!uniquePetsHave.includes(petMsg.type)) {
                    uniquePetsHave.push(petMsg.type)
                    petScore += pet_value[petMsg.tier.toLowerCase()]
                }
                if (petMsg.heldItem == null) {
                    chat.push(new Message().addTextComponent(new TextComponent(`&b- ${petMsg.name}`)))
                } else {
                    chat.push(new Message().addTextComponent(new TextComponent(`&c**${petMsg.name}`).setHover("show_text", `&bHeld Item: ${petMsg.heldItem}`)))
                }
            })
        }
        if (petsMessage["EPIC"].length !== 0) {
            let petsMsgArr = petsMessage["EPIC"].sort((a, b) => b.level - a.level)
            petsMsgArr.forEach(petMsg => {
                if (!uniquePetsHave.includes(petMsg.type)) {
                    uniquePetsHave.push(petMsg.type)
                    petScore += pet_value[petMsg.tier.toLowerCase()]
                }
                if (petMsg.heldItem == null) {
                    chat.push(new Message().addTextComponent(new TextComponent(`&b- ${petMsg.name}`)))
                } else {
                    chat.push(new Message().addTextComponent(new TextComponent(`&c**${petMsg.name}`).setHover("show_text", `&bHeld Item: ${petMsg.heldItem}`)))
                }
            })
        }
        if (petsMessage["RARE"].length !== 0) {
            let petsMsgArr = petsMessage["RARE"].sort((a, b) => b.level - a.level)
            petsMsgArr.forEach(petMsg => {
                if (!uniquePetsHave.includes(petMsg.type)) {
                    uniquePetsHave.push(petMsg.type)
                    petScore += pet_value[petMsg.tier.toLowerCase()]
                }
                if (petMsg.heldItem == null) {
                    chat.push(new Message().addTextComponent(new TextComponent(`&b- ${petMsg.name}`)))
                } else {
                    chat.push(new Message().addTextComponent(new TextComponent(`&c**${petMsg.name}`).setHover("show_text", `&bHeld Item: ${petMsg.heldItem}`)))
                }
            })
        }
        if (petsMessage["UNCOMMON"].length !== 0) {
            let petsMsgArr = petsMessage["UNCOMMON"].sort((a, b) => b.level - a.level)
            petsMsgArr.forEach(petMsg => {
                if (!uniquePetsHave.includes(petMsg.type)) {
                    uniquePetsHave.push(petMsg.type)
                    petScore += pet_value[petMsg.tier.toLowerCase()]
                }
                if (petMsg.heldItem == null) {
                    chat.push(new Message().addTextComponent(new TextComponent(`&b- ${petMsg.name}`)))
                } else {
                    chat.push(new Message().addTextComponent(new TextComponent(`&c**${petMsg.name}`).setHover("show_text", `&bHeld Item: ${petMsg.heldItem}`)))
                }
            })
        }
        if (petsMessage["COMMON"].length !== 0) {
            let petsMsgArr = petsMessage["COMMON"].sort((a, b) => b.level - a.level)
            petsMsgArr.forEach(petMsg => {
                if (!uniquePetsHave.includes(petMsg.type)) {
                    uniquePetsHave.push(petMsg.type)
                    petScore += pet_value[petMsg.tier.toLowerCase()]
                }
                if (petMsg.heldItem == null) {
                    chat.push(new Message().addTextComponent(new TextComponent(`&b- ${petMsg.name}`)))
                } else {
                    chat.push(new Message().addTextComponent(new TextComponent(`&c**${petMsg.name}`).setHover("show_text", `&bHeld Item: ${petMsg.heldItem}`)))
                }
            })
        }
        //pets reward
        let petsReward = 0
        let petsRewardArr = Array.from(Object.keys(pet_rewards))
        for (let i = 0; i < petsRewardArr.length; i++) {
            if (petScore > parseInt(petsRewardArr[i])) {
                petsReward = pet_rewards[petsRewardArr[i]].magic_find
            }
        }
        chat.push(new Message().addTextComponent(new TextComponent(`&7Pet Score: &f${petScore} &b(+${petsReward} MF)&r`)))
        //unique pets
        chat.push(new Message().addTextComponent(new TextComponent(`&7Unique Pets: &f${uniquePetsHave.length} / ${uniquePets}&r`)))

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
    const helpMessage = new Message().addTextComponent(new TextComponent(` &a◆ /sbpets &8(Hover for usage)&r &7↣Returns information on pets for player&r`).setHover("show_text", `&esbpets [username] (profileName)`))
    helpMessage.chat()
}

export { run, help }