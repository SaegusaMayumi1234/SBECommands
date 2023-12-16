import { trophyFishToColor } from '../constants/misc';
import { sendMultiLineChat, sendErrorChatWithLog } from '../utils/chatHandler';
import { getCommandDataRes } from '../utils/request';
import { addNotation, formatUsername } from '../utils/utils';

module.exports = {
    name: 'trophyfish',
    description: 'Returns trophy fish loot data for player.',
    usage: '[username] (profileName)',
    execute(args) {
        const name = args[0] ?? Player.getName();
        const profileArg = args[1] ?? 'selected';
        getCommandDataRes(this.name, name, profileArg)
            .then((res) => {
                const { data } = res.data;
                const chat = [];
                chat.push(`&bTrophy Fish Data for: ${formatUsername(data.rank, data.username)}&r`);
                Object.keys(trophyFishToColor).forEach((trophyFishId) => {
                    let trophyFishMsg = [`&${trophyFishToColor[trophyFishId]}${data.trophy_fish[trophyFishId].name} `];
                    if (data.trophy_fish[trophyFishId].total !== 0) {
                        trophyFishMsg.push(`&7(${addNotation('commas', data.trophy_fish[trophyFishId].total)})&f: `);
                        trophyFishMsg.push(`&8(${addNotation('commas', data.trophy_fish[trophyFishId].bronze)})&f-`);
                        trophyFishMsg.push(`&7(${addNotation('commas', data.trophy_fish[trophyFishId].silver)})&f-`);
                        trophyFishMsg.push(`&6(${addNotation('commas', data.trophy_fish[trophyFishId].gold)})&f-`);
                        trophyFishMsg.push(`&b(${addNotation('commas', data.trophy_fish[trophyFishId].diamond)})&r`);
                    } else {
                        trophyFishMsg.push('&c- NOT FOUND&r');
                    }
                    chat.push(trophyFishMsg.join(''));
                });
                chat.push(`&bTotal Fish: &e&l${addNotation('commas', data.trophy_fish.total_caught)}&r`);
                sendMultiLineChat(chat, true);
            })
            .catch((error) => {
                sendErrorChatWithLog(error, 'run command', this);
            });
    },
};
