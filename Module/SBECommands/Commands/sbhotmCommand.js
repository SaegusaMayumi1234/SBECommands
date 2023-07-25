import { getProfile } from '../Modules/APIWrapper/Route';
import { errorRead, addNotation, toTitleCase } from '../Utils/Utils';
import { leveling_xp } from '../Constants/leveling_xp'

let customCommandName = 'sbhotm';

const crsytalToColor = {
    'jade': 'a',
    'amber': '6',
    'topaz': 'e',
    'sapphire': 'b',
    'amethyst': '5',
    'jasper': 'd',
    'ruby': 'c'
};

const stateToColor = {
    'Not Found': 'c',
    'Found': 'a',
    'Placed': 'a'
};

module.exports = {
    name: 'sbhotm',
    execute(args) {
        let name = args[0] == undefined ? Player.getName() : args[0];
        let profileArg = args[1] == undefined ? 'last save' : args[1];
        getProfile(name, profileArg).then(data => {
            if (data.error) {
                errorRead(data.text);
                return;
            }
            let chat = [];
            chat.push(new Message().addTextComponent(new TextComponent('&bHOTM Data for: ' + data.formatedName + '&r')));
            chat.push(new Message().addTextComponent(new TextComponent(`&6Level &d${Math.floor(data.mining.hotm_tree.skill.level)}&6 - ${getHotmExpRemaining(data)}`)));
            chat.push(new Message().addTextComponent(new TextComponent('&2Tree Perks: ')).addTextComponent(new TextComponent('&7(Hover)&r').setHover('show_text', getHoverTreePerks(data))));
            chat.push(new Message().addTextComponent(new TextComponent('&dCrystals:&r')));
            data.mining.crystal_hollows.crystals.forEach(crystal => {
                if (crystal.name === 'Jasper Crystal' || crystal.name === 'Ruby Crystal') {
                    chat.push(new Message().addTextComponent(new TextComponent(` &3- &${crsytalToColor[crystal.name.replace(' Crystal', '').toLowerCase()]}${crystal.name.replace(' Crystal', '')}&3 - &${stateToColor[crystal.state]}${crystal.state}`)));
                } else {
                    chat.push(new Message().addTextComponent(new TextComponent(` &3- &${crsytalToColor[crystal.name.replace(' Crystal', '').toLowerCase()]}${crystal.name.replace(' Crystal', '')} (${crystal.total_placed})&3 - &${stateToColor[crystal.state]}${crystal.state}`)));
                }
            });
            chat.push(new Message().addTextComponent(new TextComponent(` &3- &cTotal Runs: &a${addNotation('commas', data.mining.crystal_hollows.crystal_runs)}&r`)));
            chat.push(new Message().addTextComponent(new TextComponent('&aPowder &6[&aAvailable&6/&bTotal&6]&a:&r')));
            chat.push(new Message().addTextComponent(new TextComponent(` &3- &2Mithril: &6[&a${addNotation('commas', data.mining.mithril_powder.current)}&6/&b${addNotation('commas', data.mining.mithril_powder.total)}&6]`)));
            chat.push(new Message().addTextComponent(new TextComponent(` &3- &dGemstone: &6[&a${addNotation('commas', data.mining.gemstone_powder.current)}&6/&b${addNotation('commas', data.mining.gemstone_powder.total)}&6]`)));
            ChatLib.chat('&c&m--------------------&r');
            chat.forEach(msg => {
                msg.chat();
            });
            ChatLib.chat('&c&m--------------------&r');
        }).catch(error => {
            ChatLib.chat(`&3[SBEC] &cUnknown error occured while trying to run ${customCommandName}! If this issue still presist report this to module author!`);
        });
    },
    inject(name) {
        customCommandName = name;
    }
}

function getHoverTreePerks(data) {
    let hoverTreePerk = [];
    data.mining.hotm_tree.perks.forEach(perk => {
        hoverTreePerk.push(`&a${perk.name}&f: &3${perk.level}`);
    });
    return hoverTreePerk.join('\n');
}

function getHotmExpRemaining(data) {
    if (data.mining.hotm_tree.skill.level < leveling_xp.leveling_caps.HOTM) {
        return `&6[&a${addNotation('commas', data.mining.hotm_tree.skill.xpCurrent)}&6/&a${addNotation('commas', data.mining.hotm_tree.skill.xpForNext)}&6]&r`;
    } else {
        return '&6Maxed!';
    }
}