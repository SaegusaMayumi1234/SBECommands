import { sendMultiLineChat } from '../utils/chatHandler';

const metadata = JSON.parse(FileLib.read('SBECommands', 'metadata.json'));

module.exports = {
    name: 'sbecauthor',
    description: 'Returns some information about the author of this module.',
    usage: '',
    execute(args) {
        const chat = [];
        chat.push(`&aName: &3${metadata.name}&r`);
        chat.push(`&aVersion: &e${metadata.version}&r`);
        chat.push(`&aDescription: &e${metadata.description}&r`);
        chat.push(`&aAuthor: &b${metadata.author}&r`);
        chat.push('&9Discord: &bicarusphantom&r');
        chat.push([
            '&bGitHub: ',
            new TextComponent('&6&llink&r').setClick('open_url', 'https://github.com/SaegusaMayumi1234/SBECommands'),
        ]);
        sendMultiLineChat(chat, true);
    },
};
