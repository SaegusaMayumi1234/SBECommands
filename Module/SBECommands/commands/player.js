import { getCommandDataRes } from '../utils/request';
import { addNotation, formatUsername } from '../utils/utils';
import { sendMultiLineChat, sendErrorChatWithLog } from '../utils/chatHandler';
import { skillSequence, slayerSequence } from '../constants/sequence';
import { getGlobalCommands, getHoverCataExp, getSkillMsg, getSlayerMsg } from '../utils/commandUtils';

module.exports = {
    name: 'player',
    description: 'Returns general skyblock stats data for player.',
    usage: '[username] (profileName)',
    execute(args) {
        const name = args[0] ?? Player.getName();
        const profileArg = args[1] ?? 'selected';
        getCommandDataRes(this.name, name, profileArg)
            .then((res) => {
                const { data } = res.data;
                const chat = [];
                const link = `https://sky.shiiyu.moe/stats/${data.username}/${data.profileName}`;
                chat.push(new TextComponent(`&6&l${link.replace(/\./g, '.&6&l')}&r`).setClick('open_url', link).setHover('show_text', `&7Opens &e${link}&r`));
                chat.push(`&bData for: ${formatUsername(data.rank, data.username)}&r`);
                chat.push(`&eLevel: ${data.level.color}${data.level.level} &7(${addNotation('commas', data.level.xp)})&r`);
                skillSequence.forEach((skill) => {
                    let skillData = getSkillMsg(skill, data, 'player');
                    chat.push(new TextComponent(skillData.skillMsg).setHover('show_text', skillData.hoverMsg));
                });
                chat.push(`&bAverage Skill Level: &6&l${data.skills.average_skills.skillAverage.toFixed(2)}&r`);
                chat.push(`&bTotal Slayer XP: &6&l${addNotation('commas', data.slayers.total_experience)}&r`);
                slayerSequence.forEach((slayer) => {
                    let slayerData = getSlayerMsg(slayer, data, 'player');
                    chat.push(new TextComponent(slayerData.slayerMsg).setHover('show_text', slayerData.hoverMsg));
                });
                chat.push(new TextComponent(`&dCata Level: &e${(data.dungeons?.catacombs?.skill?.levelWithProgress ?? 0).toFixed(2)}&r`).setHover('show_text', getHoverCataExp(data.dungeons?.catacombs?.skill, 'mastery')));
                chat.push(`&bPurse: &6&l${addNotation('commas', data.purse)}&r`);
                chat.push(`&bBank: &6&l${data.bank === null ? '&c&lBanking API Disabled' : addNotation('commas', data.bank)}&r`);
                if (data.noInventory) {
                    chat.push(new TextComponent('&c&lInventory Api Disabled&r'));
                } else {
                    const globalCommands = getGlobalCommands();
                    chat.push(new TextComponent('&aClick here to view Inventory!&r').setClick('run_command', `/${globalCommands['inventory'].registeredName} ${data.username} ${data.profileName}`));
                }
                sendMultiLineChat(chat, true);
            })
            .catch((error) => {
                sendErrorChatWithLog(error, 'run command', this);
            });
    },
};
