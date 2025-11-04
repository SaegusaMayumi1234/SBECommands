import { crsytalToColor, stateToColor } from '../constants/misc';
import { sendErrorChatWithLog, sendMultiLineChat } from '../utils/chatHandler';
import { getCommandDataRes } from '../utils/request';
import { addNotation, formatUsername, makePBar, toTitleCase } from '../utils/utils';

module.exports = {
    name: 'sbhotm',
    description: 'Returns Heart of the Mountain data for player.',
    usage: '[username] (profileName)',
    execute(args) {
        const name = args[0] ?? Player.getName();
        const profileArg = args[1] ?? 'selected';
        getCommandDataRes(this.name, name, profileArg)
            .then((res) => {
                const { data } = res.data;
                let hotmLevelHover = [];
                if (data.mining.hotm_tree.skill.xpForNext === 0) {
                    hotmLevelHover.push('&7Max Skill level reached!&r');
                    hotmLevelHover.push(`${makePBar(100, 100, 20, '&e', '&f')}&r &6${addNotation('commas', data.mining.hotm_tree.skill.xp)}&r`);
                } else {
                    hotmLevelHover.push(`&7Progress to Level ${Math.floor(data.mining.hotm_tree.skill.level) + 1}: &e${Math.round(data.mining.hotm_tree.skill.progress * 100)}%&r`);
                    hotmLevelHover.push(`${makePBar(Math.round(data.mining.hotm_tree.skill.progress * 100), 100, 20, '&2', '&f')}&r &e${addNotation('commas', data.mining.hotm_tree.skill.xpCurrent)}&6/&e${addNotation('commas', data.mining.hotm_tree.skill.xpForNext)}&r`);
                }
                const hoverTreePerks = [];
                const disabledPerks = [];
                data.mining.hotm_tree.perks.forEach((perk) => {
                    if (perk.disabled) {
                        disabledPerks.push(`&c${perk.name}: &3disabled&r`);
                    } else {
                        hoverTreePerks.push(`&a${perk.name}: &3${perk.level}&r`);
                    }
                });
                hoverTreePerks.push(...disabledPerks);
                const chat = [];
                chat.push(`&bHOTM Data for: ${formatUsername(data.rank, data.username)}&r`);
                chat.push(new TextComponent(`&6HOTM Level &d${data.mining.hotm_tree.skill.level}&r`).setHover('show_text', hotmLevelHover.join('\n')));
                chat.push(new TextComponent('&2Tree Perks: &7(Hover)&r').setHover('show_text', hoverTreePerks.join('\n')));
                chat.push('&dCrystals:&r');
                data.mining.crystal_hollows.crystals.forEach((crystal) => {
                    chat.push(` &3- &${crsytalToColor[crystal.id]}${crystal.name}${!['Jasper', 'Ruby'].includes(crystal.name) ? '(' + crystal.placed + ')' : ''}&3 - &${stateToColor[crystal.state]}${toTitleCase(crystal.state.replace(/_/g, ' '))}&r`);
                });
                chat.push(` &3- &cTotal Runs: &a${addNotation('commas', data.mining.crystal_hollows.crystal_runs)}&r`);
                chat.push('&aPowder &6[&aAvailable&6/&bTotal&6]&a:&r');
                chat.push(` &3- &2Mithril: &6[&a${addNotation('commas', data.mining.mithril_powder.current)}&6/&b${addNotation('commas', data.mining.mithril_powder.total)}&6]&r`);
                chat.push(` &3- &dGemstone: &6[&a${addNotation('commas', data.mining.gemstone_powder.current)}&6/&b${addNotation('commas', data.mining.gemstone_powder.total)}&6]&r`);
                chat.push(` &3- &bGlacite: &6[&a${addNotation('commas', data.mining.glacite_powder.current)}&6/&b${addNotation('commas', data.mining.gemstone_powder.total)}&6]&r`);
                sendMultiLineChat(chat, true);
            })
            .catch((error) => {
                sendErrorChatWithLog(error, 'run command', this);
            });
    },
};
