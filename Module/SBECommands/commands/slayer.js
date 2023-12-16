import { getCommandDataRes } from '../utils/request';
import { addNotation, formatUsername } from '../utils/utils';
import { sendMultiLineChat, sendErrorChatWithLog } from '../utils/chatHandler';
import { slayerSequence } from '../constants/sequence';
import { getSlayerMsg } from '../utils/commandUtils';

module.exports = {
    name: 'slayer',
    description: 'Returns slayer data for player.',
    usage: '[username] (profileName)',
    execute(args) {
        const name = args[0] ?? Player.getName();
        const profileArg = args[1] ?? 'selected';
        getCommandDataRes(this.name, name, profileArg)
            .then((res) => {
                const { data } = res.data;
                const chat = [];
                chat.push(`&bSlayer Data for: ${formatUsername(data.rank, data.username)}&r`);
                chat.push(`&bTotal Slayer XP: &6&l${addNotation('commas', data.slayers.total_experience)}&r`);
                chat.push('&r');
                slayerSequence.forEach((slayer) => {
                    let slayerData = getSlayerMsg(slayer, data, 'slayer');
                    chat.push(new TextComponent(slayerData.slayerMsg).setHover('show_text', slayerData.hoverMsg));
                });
                chat.push(`&3Approximate Coins Spent: &a${addNotation('commas', data.slayers.total_coins_spent)}&r`);
                sendMultiLineChat(chat, true);
            })
            .catch((error) => {
                sendErrorChatWithLog(error, 'run command', this);
            });
    },
};
