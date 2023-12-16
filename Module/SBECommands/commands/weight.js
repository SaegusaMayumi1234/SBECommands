import { classToMessage } from '../constants/misc';
import { skillSequence, slayerSequence, classSequence } from '../constants/sequence';
import { sendMultiLineChat, sendErrorChatWithLog } from '../utils/chatHandler';
import { getSkillMsg, getSlayerMsg } from '../utils/commandUtils';
import { getCommandDataRes } from '../utils/request';
import { formatUsername, addNotation, toTitleCase } from '../utils/utils';

const weightType = ['senither', 'lily'];

module.exports = {
    name: 'weight',
    description: 'Returns weight data for player.',
    usage: '[username] (profileName)',
    execute(args) {
        const name = args[0] ?? Player.getName();
        const profileArg = args[1] ?? 'selected';
        getCommandDataRes(this.name, name, profileArg)
            .then((res) => {
                const { data } = res.data;
                let skillHoverMsg = [];
                let slayerHoverMsg = [];
                let classHoverMsg = [];
                skillSequence.forEach((skill) => {
                    skillHoverMsg.push(getSkillMsg(skill, data, 'weight').skillMsg);
                });
                slayerSequence.forEach((slayer) => {
                    slayerHoverMsg.push(getSlayerMsg(slayer, data, 'weight').slayerMsg);
                });
                classSequence.forEach((classDungeon) => {
                    classHoverMsg.push(`${classToMessage[classDungeon]} Level: &e${(data.dungeons?.classes?.[classDungeon]?.levelWithProgress ?? 0).toFixed(2)}&r`);
                });
                const chat = [];
                chat.push(`&bWeight Data for: ${formatUsername(data.rank, data.username)}&r`);
                chat.push(new TextComponent(`&bAverage Skill Level: &6&l${data.skills.average_skills.skillAverage.toFixed(2)}&r`).setHover('show_text', skillHoverMsg.join('\n')));
                chat.push(new TextComponent(`&bTotal Slayer XP: &6&l${addNotation('commas', data.slayers.total_experience)}&r`).setHover('show_text', slayerHoverMsg.join('\n')));
                chat.push(new TextComponent(`&bCatacombs Level: &6&l${(data.dungeons?.catacombs?.skill?.level ?? 0).toFixed(2)}&r`).setHover('show_text', classHoverMsg.join('\n')));
                weightType.forEach((type) => {
                    let weightDataName = `${type}Weight`;
                    let name = `${type} Weight System`;
                    let weightHover = []
                    weightHover.push('&a&m--------------------&r');
                    weightHover.push(`&3${toTitleCase(name)}&r`);
                    weightHover.push(`&aSkills: &3${data.weight[weightDataName].summary.skills.toFixed(2)}&r`);
                    weightHover.push(`&aSlayers: &3${data.weight[weightDataName].summary.slayers.toFixed(2)}&r`);
                    weightHover.push(`&aDungeons: &3${data.weight[weightDataName].summary.dungeons.toFixed(2)}&r`);
                    weightHover.push('&a&m--------------------&r');
                    chat.push(new TextComponent(`&b${toTitleCase(type)} Weight: &6&l${(data.weight[weightDataName].summary.total + data.weight[weightDataName].summary.overflow).toFixed(2)}&r`).setHover('show_text', weightHover.join('\n')));
                });
                sendMultiLineChat(chat, true);
            })
            .catch((error) => {
                sendErrorChatWithLog(error, 'run command', this);
            });
    },
};
