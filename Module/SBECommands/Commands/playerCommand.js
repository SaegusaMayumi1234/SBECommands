import { getProfile } from '../Modules/APIWrapper/Route';
import { leveling_xp } from '../Constants/leveling_xp';
import { addNotation, timestampToTime, toTitleCase, errorRead, makePBar } from '../Utils/Utils';
import { skillSequence, slayerSequence } from '../Constants/sequence';

let customCommandName = 'player';

module.exports = {
    name: 'player',
    execute(args) {
        let name = args[0] == undefined ? Player.getName() : args[0];
        let profileArg = args[1] == undefined ? "last save" : args[1];
        getProfile(name, profileArg).then(data => {
            if (data.error) {
                errorRead(data.text);
                return;
            }
            let chat = [];
            let link = `https://sky.shiiyu.moe/stats/${data.name}/${data.raw.cute_name}`;
            chat.push(new Message().addTextComponent(new TextComponent(link).setClick('open_url', link)))
            chat.push(new Message().addTextComponent(new TextComponent("&bData for: " + data.formatedName + "&r")));
            chat.push(new Message().addTextComponent(new TextComponent(`&eLevel&f: ${getSBLevel(data)} &7(${addNotation("commas", data.raw.members[data.uuid].leveling.experience || 0)})`)))
            skillSequence.forEach(skill => {
                let skillData = getSkillMsg(skill, data);
                chat.push(new Message().addTextComponent(new TextComponent(skillData.skillMsg).setHover("show_text", skillData.hoverMsg)));
            });
            chat.push(new Message().addTextComponent(new TextComponent(`&bAverage Skill Level: &6&l${data.skills.average_skills.toFixed(2)}&r`)));
            chat.push(new Message().addTextComponent(new TextComponent(`&bTotal Slayer XP: &6&l${addNotation("commas", data.slayers.total_experience)}&r`)));
            slayerSequence.forEach(slayer => {
                let slayerData = getSlayerMsg(slayer, data);
                chat.push(new Message().addTextComponent(new TextComponent(slayerData.slayerMsg).setHover("show_text", slayerData.hoverMsg)));
            });
            chat.push(new Message().addTextComponent(new TextComponent(`&dCata Level: &e${data.dungeons == null ? 0 : data.dungeons.catacombs.skill.level.toFixed(2)}&r`)));
            chat.push(new Message().addTextComponent(new TextComponent(`&bPurse: &6&l${addNotation("commas", data.raw.members[data.uuid].coin_purse)}&r`)));
            chat.push(new Message().addTextComponent(new TextComponent(data.raw.banking !== undefined ? `&bBank: &6&l${addNotation('commas', data.raw.banking.balance || 0)}` : `&bBank: &6&lBanking Api Off&r`)));
            if (data.raw.members[data.uuid].inv_contents !== undefined) {
                chat.push(new Message().addTextComponent(new TextComponent(`&aClick here to view Inventory!`).setClick("run_command", "/inventory " + data.name + " " + data.raw.cute_name)));
            } else {
                chat.push(new Message().addTextComponent(new TextComponent(`&cInventory Api Off&r`)));
            }
            ChatLib.chat("&c&m--------------------&r");
            chat.forEach(msg => {
                msg.chat();
            });
            ChatLib.chat("&c&m--------------------&r");
        }).catch(error => {
            ChatLib.chat(`&3[SBEC] &cUnknown error occured while trying to run ${customCommandName}! If this issue still presist report this to module author!`)
        });
    },
    inject(name) {
        customCommandName = name;
    }
}

function getSBLevel(data) {
    const exp = data.raw.members[data.uuid]?.leveling?.experience || 0;
    let color = '&7';
    if (exp >= 48000) {
        color = '&4';
    } else if (exp >= 44000) {
        color = '&c';
    } else if (exp >= 40000) {
        color = '&6';
    } else if (exp >= 36000) {
        color = '&5';
    } else if (exp >= 32000) {
        color = '&d';
    } else if (exp >= 28000) {
        color = '&9';
    } else if (exp >= 24000) {
        color = '&3'
    } else if (exp >= 20000) {
        color = '&b'
    } else if (exp >= 16000) {
        color = '&2'
    } else if (exp >= 12000) {
        color = '&a'
    } else if (exp >= 8000) {
        color = '&e'
    } else if (exp >= 4000) {
        color = '&f'
    }
    return `${color}${Math.floor(exp / 100)}`;
}

function getSkillMsg(skill, data) {
    let skillMsg = `&a${toTitleCase(skill)}: `;
    let hoverMsg = '';
    if (data.skills.apiEnabled) {
        if (data.skills[skill].level < leveling_xp.leveling_caps[skill]) {
            skillMsg += `&3&l${data.skills[skill].level.toFixed(2).replace(".", "&b.")}&r`;
            hoverMsg = `&7Progress to Level ${Math.floor(data.skills[skill].level) + 1}: &e${Math.round(data.skills[skill].progress * 100)}%\n${makePBar(Math.round(data.skills[skill].progress * 100), 100, 20, '&2', '&f')} &e${addNotation("commas", data.skills[skill].xpCurrent)}&6/&e${addNotation("commas", data.skills[skill].xpForNext)}`;
        } else {
            skillMsg += `&6&l${data.skills[skill].level.toFixed(2)}&r`;
            hoverMsg = `&6MAXED OUT!\n&e${addNotation("commas", data.skills[skill].xp)}&6/&e0`;
        }
    } else {
        skillMsg += `&7&l${data.skills[skill].level.toFixed(2)}&r`;
        hoverMsg = '&6N/A';
    }
    return { skillMsg, hoverMsg };
}

function getSlayerMsg(slayer, data) {
    let slayerMsg = `&b${toTitleCase(slayer)} XP: &9&l${addNotation("commas", data.slayers[slayer].xp)}`;
    let hoverMsg = `&7Current LVL: &e${Math.floor(data.slayers[slayer].level)}\n`;
    if (Math.floor(data.slayers[slayer].level) < 9) {
        hoverMsg += `&r\n&7${toTitleCase(slayer)} Slayer XP to LVL ${Math.floor(data.slayers[slayer].level) + 1}:\n${makePBar(Math.round(data.slayers[slayer].progress * 100), 100, 20, '&5', '&f')} &d${addNotation("commas", data.slayers[slayer].xp)}&5/&d${addNotation("commas", data.slayers[slayer].xpForNext)}\n`;
    } else {
        hoverMsg += `&a&lReached max level!\n`;
    }
    for (let i = 1; i < 6; i++) {
        if (data.slayers[slayer].kills[i]) {
            hoverMsg += `&aTier ${i} Kills: &b${addNotation('commas', data.slayers[slayer].kills[i] || 0)}\n`;
        } else {
            hoverMsg += `&aTier ${i} Kills: &b0\n`;
        }
    }
    const costName = slayer === 'vampire' ? '&dApproximate Motes Spent' : '&3Approximate Coins Spent';
    hoverMsg += `&r\n${costName}: &a${addNotation('commas', data.slayers[slayer].coins_spent)}`;
    return { slayerMsg, hoverMsg };
}