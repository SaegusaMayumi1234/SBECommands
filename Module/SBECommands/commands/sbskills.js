import { getCommandDataRes } from '../utils/request';
import { formatUsername } from '../utils/utils';
import { sendMultiLineChat, sendErrorChatWithLog } from '../utils/chatHandler';
import { skillSequence } from '../constants/sequence';
import { getSkillMsg } from '../utils/commandUtils';

module.exports = {
    name: 'sbskills',
    description: 'Returns skills data for player.',
    usage: '[username] (profileName)',
    execute(args) {
        const name = args[0] ?? Player.getName();
        const profileArg = args[1] ?? 'selected';
        getCommandDataRes(this.name, name, profileArg)
            .then((res) => {
                const { data } = res.data;
                const chat = [];
                chat.push(`&bSkills for: ${formatUsername(data.rank, data.username)}&r`);
                skillSequence.forEach((skill) => {
                    let skillData = getSkillMsg(skill, data, 'sbskills');
                    chat.push(new TextComponent(skillData.skillMsg).setHover('show_text', skillData.hoverMsg));
                });
                chat.push(`&bAverage Skill Level: &6&l${data.skills.average_skills.skillAverage.toFixed(2)}&r`);
                sendMultiLineChat(chat, true);
            })
            .catch((error) => {
                sendErrorChatWithLog(error, 'run command', this);
            });
    },
};
