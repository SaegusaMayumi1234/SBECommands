import { getProfile } from "../Modules/APIWrapper/Route";
import { errorRead, addNotation } from "../Utils/Utils";

const trophyFishName = {
    'karate_fish': {
        'color': 'd',
        'name': 'Karate Fish'
    },
    'obfuscated_fish_3': {
        'color': 'd',
        'name': 'Obfuscated 3'
    },
    'slugfish': {
        'color': '6',
        'name': 'Slugfish'
    },
    'moldfin': {
        'color': '6',
        'name': 'Moldfin'
    },
    'soul_fish': {
        'color': '5',
        'name': 'Soul Fish'
    },
    'obfuscated_fish_2': {
        'color': '5',
        'name': 'Obfuscated 2'
    },
    'sulphur_skitter': {
        'color': '5',
        'name': 'Sulphur Skitter'
    },
    'steaming_hot_flounder': {
        'color': '5',
        'name': 'Steaming-Hot Flounder'
    },
    'skeleton_fish': {
        'color': '5',
        'name': 'Skeleton FIsh'
    },
    'golden_fish': {
        'color': '9',
        'name': 'Golden Fish'
    },
    'volcanic_stonefish': {
        'color': '9',
        'name': 'Volcanic Stonefish'
    },
    'vanille': {
        'color': 'a',
        'name': 'Vanille'
    },
    'mana_ray': {
        'color': 'a',
        'name': 'Mana Ray'
    },
    'lava_horse': {
        'color': 'a',
        'name': 'Lavahorse'
    },
    'flyfish': {
        'color': 'a',
        'name': 'Flyfish'
    },
    'obfuscated_fish_1': {
        'color': 'f',
        'name': 'Obfuscated 1'
    },
    'gusher': {
        'color': 'f',
        'name': 'Gusher'
    },
    'blobfish': {
        'color': 'f',
        'name': 'Blobfish'
    },
}

let customCommandName = 'trophyfish';

module.exports = {
    name: 'trophyfish',
    execute(args) {
        let name = args[0] == undefined ? Player.getName() : args[0];
        let profileArg = args[1] == undefined ? "last save" : args[1];
        getProfile(name, profileArg).then(data => {
            if (data.error) {
                errorRead(data.text);
                return;
            }
            let chat = [];
            chat.push(new Message().addTextComponent(new TextComponent("&bTrophy Fish Data for: " + data.formatedName + "&r")));

            const trophyFishData = data.raw.members[data.uuid].trophy_fish;
            
            Object.keys(trophyFishName).forEach(fishType => {
                let trophyChat = `&${trophyFishName[fishType].color}${trophyFishName[fishType].name} `
                if (trophyFishData[fishType]) {
                    trophyChat += `&7(${addNotation('commas', trophyFishData[fishType])})&f: `
                    trophyChat += `&8${addNotation('commas', trophyFishData[fishType + '_bronze'] || 0)}&f-`
                    trophyChat += `&7${addNotation('commas', trophyFishData[fishType + '_silver'] || 0)}&f-`
                    trophyChat += `&6${addNotation('commas', trophyFishData[fishType + '_gold'] || 0)}&f-`
                    trophyChat += `&b${addNotation('commas', trophyFishData[fishType + '_diamond'] || 0)}&r`
                } else {
                    trophyChat += '&c- NOT FOUND&r'
                }
                chat.push(new Message().addTextComponent(new TextComponent(trophyChat)))
            })

            chat.push(new Message().addTextComponent(new TextComponent(`&bTotal Fish: &e&l${addNotation('commas', trophyFishData.total_caught || 0)}`)))
            
            ChatLib.chat("&c&m--------------------&r");
            chat.forEach(msg => {
                msg.chat();
            });
            ChatLib.chat("&c&m--------------------&r");
        }).catch(error => {
            ChatLib.chat(`&3[SBEC] &cUnknown error occured while trying to run ${customCommandName}! If this issue still presist report this to module author!`)
        });
    },
    inject(name) {
        customCommandName = name;
    }
}