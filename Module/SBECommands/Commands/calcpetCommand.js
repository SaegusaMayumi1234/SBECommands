import { pet_rarity_offset, pet_levels, max_pet_level } from '../Constants/pet';
import { addNotation } from '../Utils/Utils';

let customCommandName = 'calcpet';

const allowed = [
    "com",
    "unc",
    "rare",
    "epic",
    "leg",
    "myt",
    "common",
    "uncommon",
    "legendary",
    "mythic"
];

const replaceRarity = {
    "com": "common",
    "unc": "uncommon",
    "leg": "legendary",
    "myt": "mythic"
};

module.exports = {
    name: 'calcpet',
    execute(args) {
        if (args[0] == undefined || args[1] == undefined || args[2] == undefined) {
            ChatLib.chat(`&3[SBEC] &a&cImproper Usage. /${customCommandName} [com/unc/rare/epic/leg/myt] [startLevel] [endLevel]`);
            return;
        }
        if (allowed.includes(args[0])) {
            args[0] = replaceRarity[args[0]] !== undefined ? replaceRarity[args[0]] : args[0];
        }
        if (isNaN(args[1]) || isNaN(args[2]) || max_pet_level[args[0]] < args[1] || max_pet_level[args[0]] < args[2] || args[1] < 0) {
            ChatLib.chat("&3[SBEC] &a&cAn Error Occurred&r");
            return;
        }
        let petExpArray = [0, 0];
        let constantPetExpArray = pet_levels.slice(pet_rarity_offset[args[0]], pet_rarity_offset[args[0]] + max_pet_level[args[0]] - 1);
        petExpArray.push(...constantPetExpArray);
        let expRemainingArray = petExpArray.slice(parseInt(args[1]) + 1, parseInt(args[2]) + 1);
        let expRemaining = expRemainingArray.length == 0 ? 0 : addNotation("commas", expRemainingArray.reduce((a, b) => a + b));
        ChatLib.chat("&c&m--------------------&r");
        ChatLib.chat(`&b&lPet XP Required: &6&l${expRemaining}&r`);
        ChatLib.chat("&c&m--------------------&r");
    },
    inject(name) {
        customCommandName = name;
    }
}