import { essSequence } from '../Constants/sequence';
import { getProfile } from '../Modules/APIWrapper/Route';
import { addNotation, errorRead, toTitleCase } from '../Utils/Utils';

let customCommandName = 'essence';

const essToColor = {
    'wither': '8',
    'undead': 'c',
    'dragon': 'd',
    'ice': 'b',
    'spider': '6',
    'diamond': '3',
    'gold': 'e'
}

module.exports = {
    name: 'essence',
    execute(args) {
        let name = args[0] == undefined ? Player.getName() : args[0];
        let profileArg = args[1] == undefined ? "last save" : args[1];

        getProfile(name, profileArg).then(data => {
            if (data.error) {
                errorRead(data.text);
                return;
            }
            let chat = [];
            if (data.essences.apiDisabled) {
                chat.push(new Message().addTextComponent(new TextComponent(`&3[SBEC] &cInventory API is not enabled for: ${data.formatedName}&r`)));
            } else {
                chat.push(new Message().addTextComponent(new TextComponent("&bDungeon Essence for: " + data.formatedName + "&r")));
                essSequence.forEach(ess => {
                    chat.push(new Message().addTextComponent(new TextComponent(`&${essToColor[ess]}${toTitleCase(ess)} Essence: &a${addNotation("commas", data.essences[ess])}&r`)));
                })
            }
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