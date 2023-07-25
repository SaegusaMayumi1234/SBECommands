import { getProfile } from '../Modules/APIWrapper/Route';
import { errorRead } from '../Utils/Utils';

let customCommandName = 'targetpractice';

module.exports = {
    name: 'targetpracticetest',
    execute(args) {
        let name = args[0] == undefined ? Player.getName() : args[0];
        let profileArg = args[1] == undefined ? 'last save' : args[1];
        getProfile(name, profileArg).then(data => {
            if (data.error) {
                errorRead(data.text);
                return;
            }
            let chat = [];
            chat.push(new Message().addTextComponent(new TextComponent('&bTarget Practice Data for: ' + data.formatedName + '&r')));
            chat.push(new Message().addTextComponent(new TextComponent(`&aBest Time: ${data.raw.members[data.uuid].fastest_target_practice ? data.raw.members[data.uuid].fastest_target_practice + 's' : '?' }`)));
            ChatLib.chat('&c&m--------------------&r');
            chat.forEach(msg => {
                msg.chat();
            });
            ChatLib.chat('&c&m--------------------&r');
        }).catch(error => {
            ChatLib.chat(`&3[SBEC] &cUnknown error occured while trying to run ${customCommandName}! If this issue still presist report this to module author!`)
        });
    },
    inject(name) {
        customCommandName = name;
    }
}
