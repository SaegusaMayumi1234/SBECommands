import { getCommandDataRes } from '../utils/request';
import { addNotation, toTitleCase, formatUsername } from '../utils/utils';
import { sendSingleLineChat, sendMultiLineChat, sendErrorChatWithLog } from '../utils/chatHandler';
import { nwSequence } from '../constants/sequence';

module.exports = {
    name: 'nw',
    description: 'Returns networth data for player. Uses skyhelper-networth calculation.',
    usage: '[username] (profileName)',
    execute(args) {
        const name = args[0] ?? Player.getName();
        const profileArg = args[1] ?? 'selected';
        getCommandDataRes(this.name, name, profileArg)
            .then((res) => {
                const { data } = res.data;
                if (data.networth.noInventory) {
                    sendSingleLineChat(`${formatUsername(data.rank, data.username)}&r &chas inventory API disabled in profile '${data.profileName}'!&r`, true, false);
                    return;
                }
                const chat = [];
                chat.push(`${formatUsername(data.rank, data.username)}&r&c's Networth:&r`);
                chat.push(`&d ⦾ &6$${addNotation('commas', data.networth.networth || 0)}&r`);
                chat.push('&r');
                chat.push([
                    `&a | &bCoins: &6${addNotation('oneLetters', (data.networth.purse || 0) + (data.networth.bank || 0))}&r`,
                    new TextComponent(' - &7(Details)&r').setHover('show_text', `&bPurse: &6${addNotation('commas', data.networth.purse || 0)}&r\n&bBank: &6${addNotation('commas', data.networth.bank || 0)}&r`),
                ]);
                nwSequence.forEach((place) => {
                    if (data.networth.types[place]) {
                        let hoverMsg = [];
                        for (let i = 0; i < 16; i++) {
                            if (!data.networth.types[place].items[i]) continue;
                            let name = data.networth.types[place].items[i].loreName ?? data.networth.types[place].items[i].name;
                            if (name === 'Unknown') {
                                name = toTitleCase(data.networth.types[place].items[i].id.replace(/_/g, ' '));
                            }
                            hoverMsg.push(`${(data.networth.types[place].items[i]?.count ?? 1) > 1 ? '&7' + data.networth.types[place].items[i].count + 'x&r ' : ''}${name} &b- ${addNotation('oneLetters', data.networth.types[place].items[i].price)}&r`);
                        }
                        chat.push([
                            `&d | &b${toTitleCase(place.replace(/_/g, ' '))}: &6${addNotation('oneLetters', data.networth.types[place].total)}&r`,
                            new TextComponent(' - &7(Details)&r').setHover('show_text', hoverMsg.join('\n')),
                        ]);
                    }
                });
                chat.push('&aPowered by &5skyhelper-networth&a,\n &amodified and hosted by &5IcarusPhantom&r');
                sendMultiLineChat(chat, true);
            })
            .catch((error) => {
                sendErrorChatWithLog(error, 'run command', this);
            });
    },
};
