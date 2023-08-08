import { maxCustomLevel, pet_items, pet_levels, pet_rarity_offset, pet_value, pet_rewards, uniquePets } from "../Constants/pet"
import { toTitleCase } from '../../../Utils/Utils'

const rarityToColor = {
    "COMMON": "f",
    "UNCOMMON": "a",
    "RARE": "9",
    "EPIC": "5",
    "LEGENDARY": "6",
    "MYTHIC": "d"
}

exports.getPets = function getPets(uuid, profileData) {
    const pets = profileData.members[uuid].pets
    let res = {
        rarity: {
            "MYTHIC": [],
            "LEGENDARY": [],
            "EPIC": [],
            "RARE": [],
            "UNCOMMON": [],
            "COMMON": []
        },
        unique: [],
        pet_score: 0,
        magic_finds: 0
    }
    pets.forEach(pet => {
        if (pet.heldItem === "PET_ITEM_TOY_JERRY" || pet.heldItem === "PET_ITEM_VAMPIRE_FANG") {
            pet.tier = "MYTHIC"
        }
        let petheldItemDisplay = pet_items[pet.heldItem] !== undefined ? `&${rarityToColor[pet_items[pet.heldItem].tier]}${pet_items[pet.heldItem].name}` : null
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
        res.rarity[pet.tier].push({
            name: toTitleCase(pet.type.toLowerCase().replace(/_/g, " ")),
            nameDisplay: `&${rarityToColor[pet.tier]}${toTitleCase(pet.type.toLowerCase().replace(/_/g, " "))}${pet.skin !== null ? " ✦" : ""} (${level})`,
            type: pet.type,
            heldItem: pet.heldItem,
            heldItemDisplay: petheldItemDisplay,
            level: level,
            tier: pet.tier
        })
    })
    let uniquePetsTemp = []
    Object.keys(res.rarity).forEach(rarity => {
        res.rarity[rarity] = res.rarity[rarity].sort((a, b) => b.level - a.level)
        const petsByRarity = res.rarity[rarity];
        const petsByRarityLength = petsByRarity.length
        for (let i = 0; i < petsByRarityLength; i++) {
            if (!uniquePetsTemp.includes(petsByRarity[i].type)) {
                uniquePetsTemp.push(petsByRarity[i].type)
                res.unique.push(petsByRarity[i])
                res.pet_score += pet_value[petsByRarity[i].tier.toLowerCase()]
            }
        }
    })
    let petsRewardArr = Array.from(Object.keys(pet_rewards))
    for (let i = 0; i < petsRewardArr.length; i++) {
        if (res.pet_score > parseInt(petsRewardArr[i])) {
            res.magic_finds = pet_rewards[petsRewardArr[i]].magic_find
        }
    }
    return res
}