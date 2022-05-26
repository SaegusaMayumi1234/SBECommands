import { getProfile } from '../Modules/APIWrapper/Route';
import { leveling_xp } from '../Constants/leveling_xp';
import { addNotation, timestampToTime, toTitleCase, errorRead } from '../Utils/Utils';
import { classSequence } from '../Constants/sequence';

let customCommandName = 'cata';

const classToMessage = {
    "archer": "&6 ☣ Archer",
    "berserk": "&c ⚔ Berserk",
    "healer": "&a ❤ Healer",
    "mage": "&b ✎ Mage",
    "tank": "&7 ❈ Tank"
};

module.exports = {
    name: 'cata',
    execute(args) {
        let name = args[0] == undefined ? Player.getName() : args[0];
        let profileArg = args[1] == undefined ? "last save" : args[1];
        getProfile(name, profileArg).then(data => {
            if (data.error) {
                errorRead(data.text);
                return;
            }
            let chat = [];
            let classAverage;
            classSequence.forEach(classDungeon => {
                classAverage = (classAverage || 0) + (data.dungeons == null ? 0 : data.dungeons?.classes[classDungeon].level || 0);
            });
            chat.push(new Message().addTextComponent(new TextComponent("&b Data for: " + data.formatedName + "&r")));
            chat.push(new Message().addTextComponent(new TextComponent(`&d ☠ Cata Level: &e${(data.dungeons?.catacombs?.skill?.level || 0).toFixed(2)}&r`).setHover("show_text", getHoverExp(data.dungeons?.catacombs?.skill, name))));
            chat.push(new Message().addTextComponent(new TextComponent(`&r`)));
            chat.push(new Message().addTextComponent(new TextComponent(`&2 Φ Class Average: &e${(classAverage / 5).toFixed(2)}&r`)));
            classSequence.forEach(classDungeon => {
                chat.push(new Message().addTextComponent(new TextComponent(`${classToMessage[classDungeon]} Level: &e${(data.dungeons?.classes?.[classDungeon]?.level || 0).toFixed(2)}&r`).setHover("show_text", getHoverExp(data.dungeons?.classes?.[classDungeon]))));
            });
            chat.push(new Message().addTextComponent(new TextComponent(`&r`)));
            chat.push(new Message().addTextComponent(new TextComponent(`&b Floor &bCompletions: &7(Hover)&r`).setHover("show_text", getHoverCompletion(data.dungeons?.catacombs?.floors, "&cCompletions:"))));
            chat.push(new Message().addTextComponent(new TextComponent(`&b Fastest &6S  &bCompletions: &7(Hover)&r`).setHover("show_text", getFastest(data.dungeons?.catacombs?.floors, "&cS:", 's'))));
            chat.push(new Message().addTextComponent(new TextComponent(`&b Fastest &6S  &bCompletions: &7(Hover)&r`).setHover("show_text", getFastest(data.dungeons?.catacombs?.floors, "&cS+:", 's+'))));
            chat.push(new Message().addTextComponent(new TextComponent(`&r`)));
            chat.push(new Message().addTextComponent(new TextComponent(`&4 --Master Mode--&r`)));
            chat.push(new Message().addTextComponent(new TextComponent(`&b Floor &bCompletions: &7(Hover)&r`).setHover("show_text", getHoverCompletion(data.dungeons?.catacombs?.master_mode_floors, "&4Master &cCompletions:"))));
            chat.push(new Message().addTextComponent(new TextComponent(`&b Fastest &6S  &bCompletions: &7(Hover)&r`).setHover("show_text", getFastest(data.dungeons?.catacombs?.master_mode_floors, "&cS:", 's'))));
            chat.push(new Message().addTextComponent(new TextComponent(`&b Fastest &6S+  &bCompletions: &7(Hover)&r`).setHover("show_text", getFastest(data.dungeons?.catacombs?.master_mode_floors, "&cS+:", 's+'))));
            chat.push(new Message().addTextComponent(new TextComponent(`&a Total Secrets Found: &e${addNotation("commas", data.dungeons?.secrets_found || 0)}&r`)));
            chat.push(new Message().addTextComponent(new TextComponent(` &8Wither Perks: &7(Hover)&r`).setHover("show_text", getPerk(data.dungeons?.perks))));
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

function getHoverExp(skill) {
    let hoverMsg = '';
    if ((skill?.level || 0) < leveling_xp.leveling_caps.catacombs) {
        hoverMsg = `&a[&6${addNotation("commas", skill?.xpCurrent || 0)}&a/&d${addNotation("commas", skill?.xpForNext || 0)}&a]`;
    } else {
        hoverMsg = `&a[&6${addNotation("commas", skill?.xp || 0)}&a/&d0&a]`;
    }
    return hoverMsg;
}

function getHoverCompletion(floors, innit) {
    let hoverMsg = innit;
    let numArray = ["1", "2", "3", "4", "5", "6", "7"];
    numArray.forEach(num => {
        let completions = floors?.[`floor_${num}`]?.completions || 0;
        hoverMsg += `\n&e${num}] &a${completions}`;
    });
    return hoverMsg;
}

function getFastest(floors, innit, mode) {
    let hoverMsg = innit;
    let numArray = ["1", "2", "3", "4", "5", "6", "7"];
    numArray.forEach(num => {
        let fastestTime;
        if (mode === 's') {
            fastestTime =  timestampToTime(floors?.[`floor_${num}`]?.fastest_s || null);
        } else if (mode === 's+') {
            fastestTime =  timestampToTime(floors?.[`floor_${num}`]?.fastest_s_plus || null);
        }
        hoverMsg += `\n&e${num}] &a${fastestTime}`;
    });
    return hoverMsg;
}

function getPerk(perks) {
    if (perks) {
        let perksHover = [];
        Array.from(Object.keys(perks)).forEach(perk => {
            perksHover.push(`&3${toTitleCase(perk.replace(/_/g, " "))} &f: &a${perks[perk]}`);
        })
        return perksHover.join("\n");
    } else {
        return '';
    }
}