import { getCommandDataRes } from '../utils/request';
import { addNotation, formatUsername } from '../utils/utils';
import { sendMultiLineChat, sendErrorChatWithLog } from '../utils/chatHandler';

module.exports = {
    name: 'ms',
    description: 'Returns fishing and mining milestones data for player.',
    usage: '[username] (profileName)',
    execute(args) {
        const name = args[0] ?? Player.getName();
        const profileArg = args[1] ?? 'selected';
        getCommandDataRes(this.name, name, profileArg)
            .then((res) => {
                const { data } = res.data;
                const chat = [];
                chat.push(`&bMilestone Data for: ${formatUsername(data.rank, data.username)}&r`);
                chat.push(`&cOres Mined: ${addNotation('commas', data.ores_mined)}&r`);
                chat.push(`&bSea Creatures Killed: ${addNotation('commas', data.sea_creatures_killed)}&r`);
                sendMultiLineChat(chat, true);
            })
            .catch((error) => {
                sendErrorChatWithLog(error, 'run command', this);
            });
    },
};
