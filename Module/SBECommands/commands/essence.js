import { getCommandDataRes } from '../utils/request';
import { addNotation, toTitleCase, formatUsername } from '../utils/utils';
import { sendSingleLineChat, sendMultiLineChat, sendErrorChatWithLog } from '../utils/chatHandler';
import { essSequence } from '../constants/sequence';
import { essToColor } from '../constants/misc';

module.exports = {
    name: 'essence',
    description: 'Returns essence values data for player.',
    usage: '[username] (profileName)',
    execute(args) {
        const name = args[0] ?? Player.getName();
        const profileArg = args[1] ?? 'selected';
        getCommandDataRes(this.name, name, profileArg)
            .then((res) => {
                const { data } = res.data;
                if (data.essences.noInventory) {
                    sendSingleLineChat(`${formatUsername(data.rank, data.username)}&r &chas inventory API disabled in profile '${data.profileName}'!&r`, true, false);
                    return;
                }
                const chat = [];
                chat.push(`&bEssence Data for: ${formatUsername(data.rank, data.username)}&r`);
                essSequence.forEach((ess) => {
                    chat.push(`&${essToColor[ess]}${toTitleCase(ess)} Essence: &a${addNotation('commas', data.essences[ess])}&r`);
                });
                sendMultiLineChat(chat, true);
            })
            .catch((error) => {
                sendErrorChatWithLog(error, 'run command', this);
            });
    },
};
