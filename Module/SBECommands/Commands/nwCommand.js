import { errorHypixelAPI, errorMaroAPI, errorMojangAPI } from "../Modules/errorHandler"
import { getHypixelPlayer, getMojang, getSkyblockData, postDecodeData, postMaroNetworth } from "../Modules/requestHandler"
import { formatRank } from "../Utils/formatRank"
import { addNotation } from "../Utils/addNotation"
import { fixUnicodeGlobal, fixUnicodeMaro } from "../Utils/unicodeFixer"

const categoriesSequence = [
    "storage",
    "inventory",
    "enderchest",
    "armor",
    "wardrobe_inventory",
    "pets",
    "talismans"
]

function run(args) {
    let name = args[0] == undefined ? Player.getName() : args[0]
    let profileArg = args[1] == undefined ? "last_save" : args[1]
    getMojang(name).then(mojang => {
        ChatLib.chat(`&3[SBEC] &aAttempting to search for ${mojang.body.name}'s networth.&r`)
        getSkyblockData(mojang.body.id).then(skyblockHy => {
            if (skyblockHy.body.profiles == null) {
                noProfile(mojang.body.id, mojang.body.name)
                return
            } else {
                if (profileArg === "last_save") {
                    //stuff
                    let profiles = skyblockHy.body.profiles
                    let profile = profiles.sort((a, b) => b.members[mojang.body.id].last_save - a.members[mojang.body.id].last_save)
                    profile = profile[0]
                    let memberData = profile.members[mojang.body.id]
                    if (memberData.inv_contents == undefined) {
                        invDisabled(mojang.body.id, profile.cute_name)
                        return
                    }
                    if (profile.banking !== undefined) {
                        memberData.banking = profile.banking
                    }
                    matchProfile(mojang.body.id, memberData)
                } else {
                    let profiles = skyblockHy.body.profiles
                    let profileMatched = null
                    profiles.forEach(profile => {
                        if (profile.cute_name.toLowerCase() == profileArg.toLowerCase()) {
                            profileMatched = profile
                        }
                    })
                    if (profileMatched != null) {
                        //stuff
                        let memberData = profileMatched.members[mojang.body.id]
                        if (memberData.inv_contents == undefined) {
                            invDisabled(mojang.body.id, profileMatched.cute_name)
                            return
                        }
                        if (profileMatched.banking !== undefined) {
                            memberData.banking = profileMatched.banking
                        }
                        matchProfile(mojang.body.id, memberData)
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

function invDisabled(uuid, profileArg) {
    getHypixelPlayer(uuid).then(player => {
        let name = player.body.player == null ? `&7${username}` : formatRank(player.body.player)
        ChatLib.chat("&c&m--------------------&r")
        ChatLib.chat(`${name} &cHas inventory API disabled in profile '${profileArg}'! UUID: ${uuid}&r`)
        ChatLib.chat("&c&m--------------------&r")
    }).catch(error => {
        errorHypixelAPI(error, "while trying to get player data")
    })
}

function matchProfile(uuid, memberData) {
    postMaroNetworth(memberData).then(maro => {
        let maroData = maro.body.data
        let maroEncode = {}
        categoriesSequence.forEach(category => {
            if (maroData.categories[category] !== undefined) {
                let topItemArr = maroData.categories[category].top_items
                let topItemFixed = []
                for (let i = 0; i < 16; i++) {
                    if (topItemArr[i] !== undefined) {
                        topItemFixed.push({
                            priceString: addNotation("oneLetters", topItemArr[i].price),
                            itemData: topItemArr[i].itemData
                        })
                    }
                }
                maroEncode[category] = topItemFixed
            }   
        })
        //postDecodeData(maroEncode).then(testDecode => {
        //    final(uuid, maro.body.data, testDecode.body)
        //}).catch(error => {
            final(uuid, maro.body.data, null)
        //})
        
    }).catch(error => {
        errorMaroAPI(error)
    })
}

function final(uuid, maroData, decodedString) {
    getHypixelPlayer(uuid).then(player => {
        let name = formatRank(player.body.player)
        let chat = []
        let chatNum = 0
        let purse = maroData.purse
        let bank = maroData.bank == null ? 0 : maroData.bank
        let total = purse + bank + maroData.sacks + maroData.networth

        chat.push(new Message())
        chat[chatNum].addTextComponent(new TextComponent(name + "&c's Networth:&r"))
        chatNum++

        chat.push(new Message())
        chat[chatNum].addTextComponent(new TextComponent("&d ⦾ &6$" + addNotation("commas", total)))
        chatNum++

        chat.push(new Message())
        chat[chatNum].addTextComponent(new TextComponent("&r"))
        chatNum++

        chat.push(new Message())
        chat[chatNum].addTextComponent(new TextComponent(`&a | &bCoins: &6${addNotation("oneLetters", purse + bank)}&r`))
        let messageDetails = " - &7(Details)&r"
        let coinsHoverMessage = `&bPurse: &6${addNotation("commas", purse)}\n&bBank: &6${addNotation("commas", bank)}`
        chat[chatNum].addTextComponent(new TextComponent(messageDetails).setHover("show_text", coinsHoverMessage))
        chatNum++

        if (maroData.categories.storage !== undefined) {
            chat.push(new Message())
            chat[chatNum].addTextComponent(new TextComponent(`&d | &bStorage: &6${addNotation("oneLetters", maroData.categories.storage.total)}&r`))
            let storageHover = []
            if (decodedString == null) {
                for (let i = 0; i < 16; i++) {
                    if (maroData.categories.storage.top_items[i] !== undefined) {
                        let name = maroData.categories.storage.top_items[i].display
                        name = fixUnicodeMaro(name) //.replace(/âœª/g, "&6✪").replace(/â�Ÿ/g, "&c✪").replace(/âšš/g, "⚚")
                        storageHover.push(name + ` &b- ${addNotation("oneLetters", maroData.categories.storage.top_items[i].price)}`)
                    }
                }
            } else {
                for (let i = 0; i < decodedString.storage.length; i++) {
                    storageHover.push(fixUnicodeGlobal(decodedString.storage[i]))
                }
            }
            chat[chatNum].addTextComponent(new TextComponent(messageDetails).setHover("show_text", storageHover.join("\n&r")))
            chatNum++
        }

        if (maroData.categories.inventory !== undefined) {
            chat.push(new Message())
            chat[chatNum].addTextComponent(new TextComponent(`&d | &bInventory: &6${addNotation("oneLetters", maroData.categories.inventory.total)}&r`))
            let inventoryHover = []
            if (decodedString == null) {
                for (let i = 0; i < 16; i++) {
                    if (maroData.categories.inventory.top_items[i] !== undefined) {
                        let name = maroData.categories.inventory.top_items[i].display
                        name = fixUnicodeMaro(name)
                        inventoryHover.push(name + ` &b- ${addNotation("oneLetters", maroData.categories.inventory.top_items[i].price)}`)
                    }
                }
            } else {
                for (let i = 0; i < decodedString.inventory.length; i++) {
                    inventoryHover.push(fixUnicodeGlobal(decodedString.inventory[i]))
                }
            }
            chat[chatNum].addTextComponent(new TextComponent(messageDetails).setHover("show_text", inventoryHover.join("\n&r")))
            chatNum++
        }

        if (maroData.categories.enderchest !== undefined) {
            chat.push(new Message())
            chat[chatNum].addTextComponent(new TextComponent(`&d | &bEnderchest: &6${addNotation("oneLetters", maroData.categories.enderchest.total)}&r`))
            let enderchestHover = []
            if (decodedString == null) {
                for (let i = 0; i < 16; i++) {
                    if (maroData.categories.enderchest.top_items[i] !== undefined) {
                        let name = maroData.categories.enderchest.top_items[i].display
                        name = fixUnicodeMaro(name)
                        enderchestHover.push(name + ` &b- ${addNotation("oneLetters", maroData.categories.enderchest.top_items[i].price)}`)
                    }
                }
            } else {
                for (let i = 0; i < decodedString.enderchest.length; i++) {
                    enderchestHover.push(fixUnicodeGlobal(decodedString.enderchest[i]))
                }
            }
            chat[chatNum].addTextComponent(new TextComponent(messageDetails).setHover("show_text", enderchestHover.join("\n&r")))
            chatNum++
        }

        if (maroData.categories.armor !== undefined) {
            chat.push(new Message())
            chat[chatNum].addTextComponent(new TextComponent(`&d | &bArmor: &6${addNotation("oneLetters", maroData.categories.armor.total)}&r`))
            let armorHover = []
            if (decodedString == null) {
                for (let i = 0; i < 16; i++) {
                    if (maroData.categories.armor.top_items[i] !== undefined) {
                        let name = maroData.categories.armor.top_items[i].display
                        name = fixUnicodeMaro(name)
                        armorHover.push(name + ` &b- ${addNotation("oneLetters", maroData.categories.armor.top_items[i].price)}`)
                    }
                }
            } else {
                for (let i = 0; i < decodedString.armor.length; i++) {
                    armorHover.push(fixUnicodeGlobal(decodedString.armor[i]))
                }
            }
            chat[chatNum].addTextComponent(new TextComponent(messageDetails).setHover("show_text", armorHover.join("\n&r")))
            chatNum++
        }

        if (maroData.categories.wardrobe_inventory !== undefined) {
            chat.push(new Message())
            chat[chatNum].addTextComponent(new TextComponent(`&d | &bWardrobe Inventory: &6${addNotation("oneLetters", maroData.categories.wardrobe_inventory.total)}&r`))
            let wardrobe_inventoryHover = []
            if (decodedString == null) {
                for (let i = 0; i < 16; i++) {
                    if (maroData.categories.wardrobe_inventory.top_items[i] !== undefined) {
                        let name = maroData.categories.wardrobe_inventory.top_items[i].display
                        name = fixUnicodeMaro(name)
                        wardrobe_inventoryHover.push(name + ` &b- ${addNotation("oneLetters", maroData.categories.wardrobe_inventory.top_items[i].price)}`)
                    }
                }
            } else {
                for (let i = 0; i < decodedString.wardrobe_inventory.length; i++) {
                    wardrobe_inventoryHover.push(fixUnicodeGlobal(decodedString.wardrobe_inventory[i]))
                }
            }
            chat[chatNum].addTextComponent(new TextComponent(messageDetails).setHover("show_text", wardrobe_inventoryHover.join("\n&r")))
            chatNum++
        }

        if (maroData.categories.pets !== undefined) {
            chat.push(new Message())
            chat[chatNum].addTextComponent(new TextComponent(`&d | &bPets: &6${addNotation("oneLetters", maroData.categories.pets.total)}&r`))
            let petsHover = []
            if (decodedString == null) {
                for (let i = 0; i < 16; i++) {
                    if (maroData.categories.pets.top_items[i] !== undefined) {
                        let name = maroData.categories.pets.top_items[i].display
                        name = "&7" + fixUnicodeMaro(name).replace("Common ", "&fCommon ").replace("Uncommon ", "&aUncommon ").replace("Rare ", "&9Rare ").replace("Epic ", "&5Epic ").replace("Legendary ", "&6Legendary ").replace("Mythic ", "&dMythic ").trim()
                        petsHover.push(name + ` &b- ${addNotation("oneLetters", maroData.categories.pets.top_items[i].price)}`)
                    }
                }
            } else {
                for (let i = 0; i < decodedString.pets.length; i++) {
                    petsHover.push(fixUnicodeGlobal(decodedString.pets[i]))
                }
            }
            
            chat[chatNum].addTextComponent(new TextComponent(messageDetails).setHover("show_text", petsHover.join("\n&r")))
            chatNum++
        }

        if (maroData.categories.talismans !== undefined) {
            chat.push(new Message())
            chat[chatNum].addTextComponent(new TextComponent(`&d | &bTalismans: &6${addNotation("oneLetters", maroData.categories.talismans.total)}&r`))
            let talismansHover = []
            if (decodedString == null) {
                for (let i = 0; i < 16; i++) {
                    if (maroData.categories.talismans.top_items[i] !== undefined) {
                        let name = maroData.categories.talismans.top_items[i].display
                        name = fixUnicodeMaro(name)
                        talismansHover.push(name + ` &b- ${addNotation("oneLetters", maroData.categories.talismans.top_items[i].price)}`)
                    }
                }
            } else {
                for (let i = 0; i < decodedString.talismans.length; i++) {
                    talismansHover.push(fixUnicodeGlobal(decodedString.talismans[i]))
                }
            }
            chat[chatNum].addTextComponent(new TextComponent(messageDetails).setHover("show_text", talismansHover.join("\n&r")))
            chatNum++
        }

        chat.push(new Message())
        chat[chatNum].addTextComponent(new TextComponent("&aPowered by &5Maro&a API&r"))
        chatNum++

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
    const helpMessage = new Message().addTextComponent(new TextComponent(` &a◆ /nw &8(Hover for usage)&r &7↣Returns networth for player. Uses Maro API&r`).setHover("show_text", `&enw [username] (profileName)`))
    helpMessage.chat()
}

export { run, help }