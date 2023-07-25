import { getProfile } from '../Modules/APIWrapper/Route';
import { leveling_xp } from '../Constants/leveling_xp';
import { errorRead, toTitleCase, makePBar, addNotation } from '../Utils/Utils';
import { skillSequence } from '../Constants/sequence';

let customCommandName = 'sbskills';

module.exports = {
    name: 'sbskills',
    execute(args) {
        let name = args[0] == undefined ? Player.getName() : args[0];
        let profileArg = args[1] == undefined ? 'last save' : args[1];
        getProfile(name, profileArg).then(data => {
            if (data.error) {
                errorRead(data.text);
                return;
            }
            let chat = [];
            chat.push(new Message().addTextComponent(new TextComponent('&bSkills for: ' + data.formatedName + '&r')));
            skillSequence.forEach(skill => {
                let skillData = getSkillMsg(skill, data);
                chat.push(new Message().addTextComponent(new TextComponent(skillData.skillMsg).setHover('show_text', skillData.hoverMsg)));
            });
            chat.push(new Message().addTextComponent(new TextComponent(`&bAverage Skill Level: &6&l${data.skills.average_skills.toFixed(2)}&r`)));
            ChatLib.chat('&c&m--------------------&r');
            chat.forEach(msg => {
                msg.chat();
            });
            ChatLib.chat('&c&m--------------------&r');
        }).catch(error => {
            ChatLib.chat(`&3[SBEC] &cUnknown error occured while trying to run ${customCommandName}! If this issue still presist report this to module author!`);
        });
    },
    inject(name) {
        customCommandName = name;
    }
}

function getSkillMsg(skill, data) {
    let skillMsg = `&a${toTitleCase(skill)}: `;
    let hoverMsg = '';
    if (data.skills.apiEnabled) {
        if (data.skills[skill].level < leveling_xp.leveling_caps[skill]) {
            skillMsg += `&3&l${data.skills[skill].level.toFixed(2).replace('.', '&b.')} &7(Hover)&r`;
            hoverMsg = `&7Progress to Level ${Math.floor(data.skills[skill].level) + 1}: &e${Math.round(data.skills[skill].progress * 100)}%\n${makePBar(Math.round(data.skills[skill].progress * 100), 100, 20, '&2', '&f')} &e${addNotation('commas', data.skills[skill].xpCurrent)}&6/&e${addNotation('commas', data.skills[skill].xpForNext)}`;
        } else {
            skillMsg += `&6&l${data.skills[skill].level.toFixed(2)} &7(Hover)&r`;
            hoverMsg = `&6MAXED OUT!\n&e${addNotation('commas', data.skills[skill].xp)}&6/&e0`;
        }
    } else {
        skillMsg += `&7&l${data.skills[skill].level.toFixed(2)} &7(Hover)&r`;
        hoverMsg = '&6N/A';
    }
    return { skillMsg, hoverMsg };
}