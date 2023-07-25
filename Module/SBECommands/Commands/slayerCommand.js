import { getProfile } from '../Modules/APIWrapper/Route';
import { leveling_xp } from '../Constants/leveling_xp';
import { errorRead, toTitleCase, makePBar, addNotation } from '../Utils/Utils';
import { slayerSequence } from '../Constants/sequence';

let customCommandName = 'slayer';

module.exports = {
    name: 'slayer',
    execute(args) {
        let name = args[0] == undefined ? Player.getName() : args[0];
        let profileArg = args[1] == undefined ? 'last save' : args[1];
        getProfile(name, profileArg).then(data => {
            if (data.error) {
                errorRead(data.text);
                return;
            }
            let chat = [];
            chat.push(new Message().addTextComponent(new TextComponent('&bSlayer Data for: ' + data.formatedName + '&r')));
            chat.push(new Message().addTextComponent(new TextComponent(`&bTotal Slayer XP: &6&l${addNotation('commas', data.slayers.total_experience)}&r`)));
            chat.push(new Message().addTextComponent(new TextComponent('&r')));
            slayerSequence.forEach(slayer => {
                let slayerData = getSlayerMsg(slayer, data);
                chat.push(new Message().addTextComponent(new TextComponent(slayerData.slayerMsg).setHover('show_text', slayerData.hoverMsg)));
            });
            chat.push(new Message().addTextComponent(new TextComponent(`&3Approximate Coins Spent: &a${addNotation('commas', data.slayers.total_coins_spent)}&r`)));
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

function getSlayerMsg(slayer, data) {
    let slayerMsg = `&b${toTitleCase(slayer)} XP: &9&l${addNotation('commas', data.slayers[slayer].xp)}\n&7(Hover for tier analysis)`;
    let hoverMsg = `&7Current LVL: &e${Math.floor(data.slayers[slayer].level)}\n`;
    if (Math.floor(data.slayers[slayer].level) < 9) {
        hoverMsg += `&r\n&7${toTitleCase(slayer)} Slayer XP to LVL ${Math.floor(data.slayers[slayer].level) + 1}:\n${makePBar(Math.round(data.slayers[slayer].progress * 100), 100, 20, '&5', '&f')} &d${addNotation('commas', data.slayers[slayer].xp)}&5/&d${addNotation('commas', data.slayers[slayer].xpForNext)}\n`;
    } else {
        hoverMsg += '&a&lReached max level!\n';
    }
    for (let i = 1; i < 6; i++) {
        if (data.slayers[slayer].kills[i]) {
            hoverMsg += `&aTier ${i} Kills: &b${addNotation('commas', data.slayers[slayer].kills[i] || 0)}\n`;
        } else {
            hoverMsg += `&aTier ${i} Kills: &b0\n`;
        }
    }
    const costName = slayer === 'vampire' ? '&dApproximate Motes Spent' : '&3Approximate Coins Spent';
    hoverMsg += `&r\n${costName}: &a${addNotation('commas', data.slayers[slayer].coins_spent)}`;
    return { slayerMsg, hoverMsg };
}