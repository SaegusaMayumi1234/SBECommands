import { skillSequence, slayerSequence, classSequence } from "../Constants/sequence";
import { leveling_xp } from '../Constants/leveling_xp';
import { getProfile } from "../Modules/APIWrapper/Route";
import { errorRead, addNotation, toTitleCase } from "../Utils/Utils";

let customCommandName = 'weight';

const classToMessage = {
    "archer": "&6 ☣ Archer",
    "berserk": "&c ⚔ Berserk",
    "healer": "&a ❤ Healer",
    "mage": "&b ✎ Mage",
    "tank": "&7 ❈ Tank"
};

module.exports = {
    name: 'weight',
    execute(args) {
        let name = args[0] == undefined ? Player.getName() : args[0];
        let profileArg = args[1] == undefined ? "last save" : args[1];
        getProfile(name, profileArg).then(data => {
            if (data.error) {
                errorRead(data.text);
                return;
            }
            let chat = []
            chat.push(new Message().addTextComponent(new TextComponent(`&bData for: ${data.formatedName}&r`)))
            chat.push(new Message().addTextComponent(new TextComponent(`&bAverage Skill Level: &6&l${data.skills.average_skills.toFixed(2)}`).setHover("show_text", getSkillHover(data))))
            chat.push(new Message().addTextComponent(new TextComponent(`&bTotal Slayer XP: &6&l${addNotation("commas", data.slayers.total_experience)}&r`).setHover("show_text", getSlayerHover(data))))
            chat.push(new Message().addTextComponent(new TextComponent(`&bCatacombs Level: &6&l${data.dungeons == null ? 0 : data.dungeons.catacombs.skill.level.toFixed(2)}&r`).setHover("show_text", getCataHover(data))))
            chat.push(new Message().addTextComponent(new TextComponent(`&bTotal Weight: &6&l${(data.weight?.total || 0).toFixed(2)}&r`).setHover("show_text", getWeightHover(data))))
            ChatLib.chat("&c&m--------------------&r")
            chat.forEach(msg => {
                msg.chat()
            })
            ChatLib.chat("&c&m--------------------&r")
        }).catch(error => {
            ChatLib.chat(`&3[SBEC] &cUnknown error occured while trying to run ${customCommandName}! If this issue still presist report this to module author!`)
        });
    },
    inject(name) {
        customCommandName = name;
    }
}

function getSkillHover(data) {
    let skillHover = [];
    skillSequence.forEach(skill => {
        let skillMsg = `&a${toTitleCase(skill)}: `;
        if (data.skills.apiEnabled) {
            if (data.skills[skill].level < leveling_xp.leveling_caps[skill]) {
                skillMsg += `&3&l${data.skills[skill].level.toFixed(2).replace(".", "&b.")}&r`;
            } else {
                skillMsg += `&6&l${data.skills[skill].level.toFixed(2)}&r`;
            }
        } else {
            skillMsg += `&7&l${data.skills[skill].level.toFixed(2)}&r`;
        }
        skillHover.push(skillMsg);
    })
    return skillHover.join('\n');
}

function getSlayerHover(data) {
    let slayerHover = [];
    slayerSequence.forEach(slayer => {
        slayerHover.push(`&b${toTitleCase(slayer)} XP: &9&l${addNotation("commas", data.slayers[slayer].xp)}`);
    });
    return slayerHover.join('\n');
}

function getCataHover(data) {
    let cataHover = [];
    classSequence.forEach(classDungeon => {
        cataHover.push(` ${classToMessage[classDungeon]} Level: &e${(data.dungeons?.classes?.[classDungeon]?.level || 0).toFixed(2)}&r`);
    });
    return cataHover.join('\n')
}

function getWeightHover(data) {
    let weightHover = []
    weightHover.push(`&a&m--------------------&r`)
    weightHover.push(`&3Weight System`)
    weightHover.push(`&aSkill: &3${((data.weight?.skill?.base || 0) + (data.weight?.skill?.overflow || 0)).toFixed(2)}&r`)
    weightHover.push(`&aDungeon: &3${((data.weight?.catacombs?.experience || 0) + (data.weight?.catacombs?.completion?.base || 0) + (data.weight?.catacombs?.completion?.master || 0)).toFixed(2)}&r`)
    weightHover.push(`&aSlayer: &3${(data.weight?.slayer || 0).toFixed(2)}&r`)
    weightHover.push(`&cSystem provided by LappySheep (Lily Weight)&r`)
    weightHover.push(`&a&m--------------------&r`)
    return weightHover.join('\n')
}