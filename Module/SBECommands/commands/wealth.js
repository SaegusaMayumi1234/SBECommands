import { getCommandDataRes } from '../utils/request';
import { addNotation, formatUsername } from '../utils/utils';
import { sendMultiLineChat, sendErrorChatWithLog } from '../utils/chatHandler';

module.exports = {
    name: 'wealth',
    description: 'Returns banking and purse data for player.',
    usage: '[username] (profileName)',
    execute(args) {
        const name = args[0] ?? Player.getName();
        const profileArg = args[1] ?? 'selected';
        getCommandDataRes(this.name, name, profileArg)
            .then((res) => {
                const { data } = res.data;
                const chat = [];
                chat.push(`&bWealth Data for: ${formatUsername(data.rank, data.username)}&r`);
                chat.push(`&bBank: &6&l${data.bank === null ? '&c&lBanking API Disabled' : addNotation('commas', data.bank)}&r`);
                chat.push(`&bPurse: &6&l${addNotation('commas', data.purse)}&r`);
                sendMultiLineChat(chat, true);
            })
            .catch((error) => {
                sendErrorChatWithLog(error, 'run command', this);
            });
    },
};
