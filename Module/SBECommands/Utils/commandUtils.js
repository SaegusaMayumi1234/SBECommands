import Settings from './config';
import { addNotation, decodeNBTData, formatUsername, makePBar, timestampToTime, toTitleCase } from './utils';
import { kuudraSequence } from '../constants/sequence';

let globalCommands = {};

let lastMode = 'dungeon';
const inventoryType = ['inv_armor', 'inv_contents', 'ender_chest_contents', 'backpack_contents'];
const armorOrder = [3, 2, 1, 0];
const allowedWeaponID = [
    'TERMINATOR',
    'HYPERION',
    'ASTRAEA',
    'VALKYRIE',
    'SCYLLA',
    'DARK_CLAYMORE',
    'JUJU_SHORTBOW',
    'GIANTS_SWORD',
    'MIDAS_STAFF',
    'BONE_BOOMERANG',
    'LIVID_DAGGER',
    'FLOWER_OF_TRUTH',
    'GYROKINETIC_WAND',
    'ICE_SPRAY_WAND',
    'WITHER_CLOAK',
    'SPIRIT_MASK',
    'BAT_WAND',
    'PLASMAFLUX_POWER_ORB',
    'OVERFLUX_POWER_ORB',
    'MANA_FLUX_POWER_ORB',
    'RADIANT_POWER_ORB',
];
const additionalDungeonItemsID = ['INFINITE_SPIRIT_LEAP', 'INFINITE_SUPERBOOM_TNT', 'RABBIT_HAT', 'SPRING_BOOTS'];
const powerOrbs = ['PLASMAFLUX_POWER_ORB', 'OVERFLUX_POWER_ORB', 'MANA_FLUX_POWER_ORB', 'RADIANT_POWER_ORB'];

register('guiRender', (mx, my, gui) => {
    if (Player.getPlayer() === null || Player.getContainer().getClassName() !== 'ContainerChest') return;
    if (Player.getContainer().getName() === 'Select Tier') {
        lastMode = 'kuudra';
    } else if (Player.getContainer().getName() === 'Catacombs Gate') {
        lastMode = 'dungeon';
    }
});

register('chat', () => {
    lastMode = 'dungeon';
}).setCriteria('Party Finder > ${name} joined the dungeon group! ${*}');

register('chat', () => {
    lastMode = 'kuudra';
}).setCriteria('Party Finder > ${name} joined the group! ${*}');

export function injectGlobalCommands(data) {
    globalCommands = data;
}

export function getGlobalCommands() {
    return globalCommands;
}

export function getSlayerMsg(slayer, data, mode) {
    let slayerMsg = [`&b${toTitleCase(slayer)} XP: &9&l${addNotation('commas', data.slayers[slayer].xp)}&r`];
    let hoverMsg = [`&7Current LVL: &e${data.slayers[slayer].level}&r`];
    if (data.slayers[slayer].xpForNext === 0) {
        hoverMsg.push('&a&lReached max level!&r');
    } else {
        hoverMsg.push('&r');
        hoverMsg.push(`&7${toTitleCase(slayer)} Slayer XP to LVL ${data.slayers[slayer].level + 1}: &d${Math.round(data.slayers[slayer].progress * 100)}%&r`);
        hoverMsg.push(`${makePBar(Math.round(data.slayers[slayer].progress * 100), 100, 20, '&5', '&f')}&r &d${addNotation('commas', data.slayers[slayer].xp)}&5/&d${addNotation('commas', data.slayers[slayer].xpForNext)}&r`);
    }
    for (let i = 1; i <= 5; i++) {
        if (data.slayers[slayer].kills[i] !== undefined) {
            hoverMsg.push(`&aTier ${i} Kills: &b${addNotation('commas', data.slayers[slayer].kills[i])}&r`);
        }
    }
    const costName = slayer === 'vampire' ? '&dApproximate Motes Spent' : '&3Approximate Coins Spent';
    hoverMsg.push('&r');
    hoverMsg.push(`${costName}: &a${addNotation('commas', data.slayers[slayer].coins_spent)}&r`);
    if (mode === 'slayer') {
        slayerMsg.push('&7(Hover for tier analysis)&r');
    }
    return { slayerMsg: slayerMsg.join('\n'), hoverMsg: hoverMsg.join('\n') };
}

export function getSkillMsg(skill, data, mode) {
    let skillMsg = `&a${toTitleCase(skill)}: `;
    let hoverMsg = [];
    if (data.skills.apiEnabled) {
        if (data.skills[skill].xpForNext === 0) {
            skillMsg += `&6&l${data.skills[skill].level.toFixed(2)}`;
            hoverMsg.push('&7Max Skill level reached!&r');
            hoverMsg.push(`${makePBar(100, 100, 20, '&e', '&f')}&r &6${addNotation('commas', data.skills[skill].xp)}&r`);
        } else {
            skillMsg += `&3&l${data.skills[skill].levelWithProgress.toFixed(2).replace('.', '&b.')}`;
            hoverMsg.push(`&7Progress to Level ${Math.floor(data.skills[skill].level) + 1}: &e${Math.round(data.skills[skill].progress * 100)}%&r`);
            hoverMsg.push(`${makePBar(Math.round(data.skills[skill].progress * 100), 100, 20, '&2', '&f')}&r &e${addNotation('commas', data.skills[skill].xpCurrent)}&6/&e${addNotation('commas', data.skills[skill].xpForNext)}&r`);
        }
    } else {
        skillMsg += `&7&l${data.skills[skill].level.toFixed(2)}`;
        hoverMsg.push('&6N/A&r');
    }
    if (mode === 'sbskills') {
        skillMsg += ' &7(Hover)&r';
    } else {
        skillMsg += '&r';
    }
    return { skillMsg, hoverMsg: hoverMsg.join('\n') };
}

export function getHoverCataExp(skill, name) {
    let hoverMsg = [];
    if (skill?.xpForNext === 0) {
        hoverMsg.push('&7Max Level reached!&r');
        hoverMsg.push(`${makePBar(100, 100, 20, '&e', '&f')}&r &6${addNotation('commas', skill?.xp)}&r`);
    } else {
        hoverMsg.push(`&7Progress to ${name ? toTitleCase(name) : 'Level'} ${Math.floor((skill?.level ?? 0)) + 1}: &e${Math.round((skill?.progress ?? 0) * 100)}%&r`);
        hoverMsg.push(`${makePBar(Math.round((skill?.progress ?? 0) * 100), 100, 20, '&2', '&f')}&r &e${addNotation('commas', skill?.xpCurrent ?? 0)}&6/&e${addNotation('commas', skill?.xpForNext ?? 50)}&r`);
    }
    return hoverMsg.join('\n');
}

export function getHoverCataCompletionsMsg(catacombs) {
    const res = {
        floors: {
            completions: ['&cCompletions:'],
            fastest_s: ['&cS:'],
            fastest_s_plus: ['&cS+:'],
        },
        master_mode_floors: {
            completions: ['&4Master &cCompletions:'],
            fastest_s: ['&cS:'],
            fastest_s_plus: ['&cS+:'],
        },
    };
    for (let i = 0; i <= 7; i++) {
        let floor_name = `floor_${i}`;
        if (i === 0) floor_name = 'entrance';
        res.floors.completions.push(`&e${i}] &a${catacombs?.floors?.[floor_name]?.completions ?? 0}&r`);
        res.floors.fastest_s.push(`&e${i}] &a${timestampToTime(catacombs?.floors?.[floor_name]?.fastest_s)}&r`);
        res.floors.fastest_s_plus.push(`&e${i}] &a${timestampToTime(catacombs?.floors?.[floor_name]?.fastest_s_plus)}&r`);
        if (i === 0) continue;
        res.master_mode_floors.completions.push(`&e${i}] &a${catacombs?.master_mode_floors?.[floor_name]?.completions ?? 0}&r`);
        res.master_mode_floors.fastest_s.push(`&e${i}] &a${timestampToTime(catacombs?.master_mode_floors?.[floor_name]?.fastest_s)}&r`);
        res.master_mode_floors.fastest_s_plus.push(`&e${i}] &a${timestampToTime(catacombs?.master_mode_floors?.[floor_name]?.fastest_s_plus)}&r`);
    }
    Object.keys(res.floors).forEach((value) => {
        res.floors[value] = res.floors[value].join('\n');
        res.master_mode_floors[value] = res.master_mode_floors[value].join('\n');
    });
    return res;
}

export function getHoverKuudra(nether) {
    const completions = [];
    const highestWaves = [];
    kuudraSequence.forEach((name) => {
        completions.push(`&e${name}: &a${nether.kuudra.completed_tier[name]}&r`);
        highestWaves.push(`&e${name}: &a${nether.kuudra.highest_wave[name]}&r`);
    });
    return {
        completions: completions.join('\n'),
        highestWaves: highestWaves.join('\n'),
    };
}

export function getCheckMode(arg) {
    let resMode = null;
    if (arg === 'dungeon' || arg === 'kuudra') {
        lastMode = arg;
    } else {
        let scoreboard = Scoreboard.getLines().map((a) => {
            return ChatLib.removeFormatting(a);
        });
        for (let line of scoreboard ?? []) {
            if (line.match(/ ⏣ The Catac.+ombs \((.+)\)/)) {
                lastMode = 'dungeon';
            }
            if (line.match(/ ⏣ Kuudra's .+Hollow \((.+)\)/)) {
                lastMode = 'kuudra';
            }
            if (line.match(/ ⏣ /)) break;
        }
    }
    resMode = lastMode;
    return resMode;
}

export function getCheckMessage(data, mode) {
    const chat = [];
    chat.push(`&b${toTitleCase(mode)} Data for: ${formatUsername(data.rank, data.username)}&r`);
    chat.push(` &a✎ Avg Skill Level: &e${data.skills.average_skills.skillAverage.toFixed(2)}&r`);
    if (mode === 'dungeon') {
        chat.push(` &a☠ Cata Level: &e${(data.dungeons?.catacombs?.skill?.levelWithProgress ?? 0).toFixed(2)}&r`);
        chat.push(` &aTotal Secrets Found: &e${addNotation('commas', data.dungeons?.secrets_found ?? 0)}&r`);
    } else if (mode === 'kuudra') {
        chat.push(` &a⚔ Combat Level: &e${(data.skills?.combat?.level ?? 0).toFixed(2)}&r`);
    }
    chat.push('&r');
    if (data.noInventory) {
        chat.push(` &c&lInventory API Disabled&r`);
    } else {
        let itemsData = [];
        let additionalDungeonItems = {};
        for (let type of inventoryType) {
            if (!data.inventory[type]) continue;
            if (!Settings.deepScan && ['ender_chest_contents', 'backpack_contents'].includes(type)) continue;
            let contents = [];
            if (type === 'backpack_contents') {
                for (let num of Object.keys(data.inventory[type])) {
                    contents.push(decodeNBTData(data.inventory[type][num]));
                }
            } else {
                contents.push(decodeNBTData(data.inventory[type]));
            }
            for (let content of contents) {
                let { items, length } = content;
                for (let i = 0; i < length; i++) {
                    let item = items.func_150305_b(type === 'inv_armor' ? armorOrder[i] : i);
                    if (!item.func_82582_d()) {
                        //NBTTagCompound.hasNoTags()
                        let nbtTagItemObject = new NBTTagCompound(item).toObject();
                        let nbtTagItemString = new NBTTagCompound(item).toString();
                        if (type === 'inv_armor') {
                            chat.push(new TextComponent(` ${nbtTagItemObject.tag.display.Name}&r`).setHover('show_item', nbtTagItemString));
                        } else if (allowedWeaponID.includes(nbtTagItemObject?.tag?.ExtraAttributes?.id)) {
                            let itemPush = {
                                id: nbtTagItemObject?.tag?.ExtraAttributes?.id,
                                name: nbtTagItemObject.tag.display.Name,
                                order: allowedWeaponID.indexOf(nbtTagItemObject?.tag?.ExtraAttributes?.id),
                                count: 1,
                                nbtTagItemString,
                            };
                            let itemIndex = itemsData.findIndex((value) => value.id === itemPush.id);
                            if (!Settings.hideDupe || itemPush.id === 'TERMINATOR' || itemIndex === -1) {
                                itemsData.push(itemPush);
                            } else {
                                itemsData[itemIndex].count += 1;
                            }
                        }
                        if (additionalDungeonItemsID.includes(nbtTagItemObject?.tag?.ExtraAttributes?.id)) {
                            additionalDungeonItems[nbtTagItemObject?.tag?.ExtraAttributes?.id] = true;
                        }
                    } else if (type === 'inv_armor') {
                        chat.push(' &aN/A&r');
                    }
                }
            }
        }
        itemsData = itemsData.sort((a, b) => a.order - b.order);
        for (let powerOrb of powerOrbs) {
            if (itemsData.find((value) => value.id === powerOrb)) {
                let filters = powerOrbs.filter((value) => value !== powerOrb);
                itemsData = itemsData.filter((value) => !filters.includes(value.id));
                break;
            }
        }
        itemsData.forEach((item) => {
            chat.push(new TextComponent(` ${item.name}${item.count > 1 ? ' &7x' + item.count : ''}&r`).setHover('show_item', item.nbtTagItemString));
        });
        if (mode === 'dungeon' && Settings.showAdditional) {
            const hoverMsg = [];
            hoverMsg.push(`&aRabbit Hat&7: ${additionalDungeonItems['RABBIT_HAT'] ? '&aYES' : '&cNO'}&r`);
            hoverMsg.push(`&9Spring Boots&7: ${additionalDungeonItems['SPRING_BOOTS'] ? '&aYES' : '&cNO'}&r`);
            hoverMsg.push(`&5Infinileap&7: ${additionalDungeonItems['INFINITE_SPIRIT_LEAP'] ? '&aYES' : '&cNO'}&r`);
            hoverMsg.push(`&5Infinityboom TNT&7: ${additionalDungeonItems['INFINITE_SUPERBOOM_TNT'] ? '&aYES' : '&cNO'}&r`);
            chat.push(new TextComponent(` &cAdditional Dungeon Items: &7(Hover)`).setHover('show_text', hoverMsg.join('\n')));
        }
    }
    if (mode === 'dungeon') {
        chat.push(` &cSpirit Pet: ${data.pets.spirit ? '&aYES' : 'NO'}&r`);
    }
    chat.push('&r');
    if (mode === 'dungeon') {
        const hoverFloor = getHoverCataCompletionsMsg(data.dungeons?.catacombs);
        chat.push(new TextComponent('&b Floor &bCompletions: &7(Hover)&r').setHover('show_text', hoverFloor.floors.completions));
        chat.push(new TextComponent('&b Fastest &6S+ &bCompletions: &7(Hover)&r').setHover('show_text', hoverFloor.floors.fastest_s_plus));
        chat.push(new TextComponent('&4 MM &bFloor &bCompletions: &7(Hover)&r').setHover('show_text', hoverFloor.master_mode_floors.completions));
        chat.push(new TextComponent('&4 MM &bFastest &6S+ &bCompletions: &7(Hover)&r').setHover('show_text', hoverFloor.master_mode_floors.fastest_s_plus));
    } else if (mode === 'kuudra') {
        const hoverKuudra = getHoverKuudra(data.nether);
        chat.push(new TextComponent('&b Kuudra &bCompletions: &7(Hover)&r').setHover('show_text', hoverKuudra.completions));
        chat.push(new TextComponent('&b Kuudra &bHighest Wave: &7(Hover)&r').setHover('show_text', hoverKuudra.highestWaves));
    }
    return chat;
}
