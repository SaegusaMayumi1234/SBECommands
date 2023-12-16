import { commandSequence } from '../constants/sequence';
import { sendMultiLineChat } from '../utils/chatHandler';
import { getGlobalCommands } from '../utils/commandUtils';

module.exports = {
    name: 'sbec',
    description: 'Send this help message.',
    usage: '',
    execute(args) {
        const chat = [];
        const globalCommands = getGlobalCommands();
        chat.push('&c&m--------------&c[ &dSBECommands &c]&r&c&m--------------&r');
        commandSequence.forEach((name) => {
            if (globalCommands[name]) {
                chat.push(new TextComponent(` &${globalCommands[name].enabled ? 'a' : 'c'}◆ /${globalCommands[name].registeredName} &8(Hover for usage)&r &7↣${globalCommands[name].description}&r`).setHover('show_text', `&e/${globalCommands[name].registeredName} ${globalCommands[name].usage}&r`));
            } else {
                chat.push(new TextComponent(` &c◆ /${name} &8(Hover for usage)&r &7↣An error occured while trying to load this command&r`).setHover('show_text', `&e/${name}&r`));
            }
        });
        chat.push(' &aMade by &bIcarusPhantom &c❤&r');
        chat.push('&c&m--------------------------------------------&r');
        sendMultiLineChat(chat, false);
    },
};
