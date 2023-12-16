import { getCommandDataRes } from '../utils/request';
import { addNotation, formatUsername, intToRoman } from '../utils/utils';
import { sendSingleLineChat, sendMultiLineChat, sendErrorChatWithLog } from '../utils/chatHandler';
import { classSequence } from '../constants/sequence';
import { classToMessage } from '../constants/misc';
import { getHoverCataCompletionsMsg, getHoverCataExp } from '../utils/commandUtils';

module.exports = {
    name: 'cata',
    description: 'Returns catacombs data for player.',
    usage: '[username] (profileName)',
    execute(args) {
        const name = args[0] ?? Player.getName();
        const profileArg = args[1] ?? 'selected';
        getCommandDataRes(this.name, name, profileArg)
            .then((res) => {
                const { data } = res.data;
                if (!data.dungeons) {
                    sendSingleLineChat(`${formatUsername(data.rank, data.username)}&r &chasn't joined the dungeons in profile '${data.profileName}'!&r`, true, false);
                    return;
                }
                let classAverage;
                classSequence.forEach((classDungeon) => {
                    classAverage = (classAverage ?? 0) + (data.dungeons?.classes?.[classDungeon]?.levelWithProgress ?? 0);
                });
                const hoverFloor = getHoverCataCompletionsMsg(data.dungeons?.catacombs);
                const perksHover = [];
                ['undead', 'wither'].forEach((essence) => {
                    Object.keys(data.perks?.[essence] ?? []).forEach((perk) => {
                        perksHover.push(`&a${data.perks[essence][perk].name} ${intToRoman(data.perks[essence][perk].tier)} &3(${data.perks[essence][perk].perks}&3)&r`);
                    });
                });
                const chat = [];
                chat.push(`&bDungeon Data for: ${formatUsername(data.rank, data.username)}&r`);
                chat.push(new TextComponent(`&d ☠ Cata Level: &e${(data.dungeons?.catacombs?.skill?.levelWithProgress ?? 0).toFixed(2)}&r`)
                    .setHover('show_text', getHoverCataExp(data.dungeons?.catacombs?.skill, 'mastery')));
                chat.push('&r');
                chat.push(new TextComponent(`&2 Φ Class Average: &e${(classAverage / 5).toFixed(2)}&r`));
                classSequence.forEach((classDungeon) => {
                    chat.push(new TextComponent(` ${classToMessage[classDungeon]} Level: &e${(data.dungeons?.classes?.[classDungeon]?.levelWithProgress ?? 0).toFixed(2)}&r`)
                        .setHover('show_text', getHoverCataExp(data.dungeons?.classes?.[classDungeon])));
                });
                chat.push('&r');
                chat.push(new TextComponent('&b Floor &bCompletions: &7(Hover)&r').setHover('show_text', hoverFloor.floors.completions));
                chat.push(new TextComponent('&b Fastest &6S &bCompletions: &7(Hover)&r').setHover('show_text', hoverFloor.floors.fastest_s));
                chat.push(new TextComponent('&b Fastest &6S+ &bCompletions: &7(Hover)&r').setHover('show_text', hoverFloor.floors.fastest_s_plus));
                chat.push('&r');
                chat.push('&4 --Master Mode--&r');
                chat.push(new TextComponent('&b Floor &bCompletions: &7(Hover)&r').setHover('show_text', hoverFloor.master_mode_floors.completions));
                chat.push(new TextComponent('&b Fastest &6S &bCompletions: &7(Hover)&r').setHover('show_text', hoverFloor.master_mode_floors.fastest_s));
                chat.push(new TextComponent('&b Fastest &6S+ &bCompletions: &7(Hover)&r').setHover('show_text', hoverFloor.master_mode_floors.fastest_s_plus));
                chat.push(`&a Total Secrets Found: &e${addNotation('commas', data.dungeons?.secrets_found ?? 0)}&r`);
                chat.push(new TextComponent('&8 Perks: &7(Hover)&r').setHover('show_text', perksHover.join('\n')));
                sendMultiLineChat(chat, true);
            })
            .catch((error) => {
                sendErrorChatWithLog(error, 'run command', this);
            });
    },
};
