import { getProfile } from '../Modules/APIWrapper/Route';
import { errorRead, addNotation } from '../Utils/Utils';

let customCommandName = 'wealth';

module.exports = {
    name: 'wealth',
    execute(args) {
        let name = args[0] == undefined ? Player.getName() : args[0];
        let profileArg = args[1] == undefined ? 'last save' : args[1];
        getProfile(name, profileArg).then(data => {
            if (data.error) {
                errorRead(data.text);
                return;
            }
            let chat = [];
            chat.push(new Message().addTextComponent(new TextComponent('&bWealth for: ' + data.formatedName + '&r')));
            chat.push(new Message().addTextComponent(new TextComponent(`&bBank: &6&l${data.raw.banking ? addNotation('commas', data.raw.banking.balance || 0) : 'Banking Api Off'}&r`)));
            chat.push(new Message().addTextComponent(new TextComponent(`&bPurse: &6&l${addNotation('commas', data.raw.members[data.uuid].coin_purse || 0)}&r`)));
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
