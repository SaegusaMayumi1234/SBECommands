import { getCommandDataRes } from '../utils/request';
import { formatUsername } from '../utils/utils';
import { sendMultiLineChat, sendErrorChatWithLog } from '../utils/chatHandler';

module.exports = {
    name: 'targetpractice',
    description: 'Returns fastest target practice time data for player.',
    usage: '[username] (profileName)',
    execute(args) {
        const name = args[0] ?? Player.getName();
        const profileArg = args[1] ?? 'selected';
        getCommandDataRes(this.name, name, profileArg)
            .then((res) => {
                const { data } = res.data;
                const chat = [];
                chat.push(`&bTarget Practice Data for: ${formatUsername(data.rank, data.username)}&r`);
                chat.push(`&aBest Time: ${data.target_practice === null ? '?' : data.target_practice + 's'}&r`);
                sendMultiLineChat(chat, true);
            })
            .catch((error) => {
                sendErrorChatWithLog(error, 'run command', this);
            });
    },
};
