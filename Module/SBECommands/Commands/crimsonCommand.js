import { getProfile } from '../Modules/APIWrapper/Route';
import { addNotation, timestampToTime, toTitleCase, errorRead } from '../Utils/Utils';
import { dojoSequence, kuudraSequence } from '../Constants/sequence';

const kuudraToColor = {
    'basic': '&a',
    'hot': '&e',
    'burning': '&6',
    'fiery': '&c',
    'infernal': '&4', 
};

const dojoToAPIName = {
    'force': 'mob_kb',
    'stamina': 'wall_jump',
    'mastery': 'archer',
    'discipline': 'sword_swap',
    'swiftness': 'snake',
    'control': 'lock_head',
    'tenacity': 'fireball',
};

let customCommandName = 'crimson';

module.exports = {
    name: 'crimson',
    execute(args) {
        let name = args[0] === undefined ? Player.getName() : args[0];
        let profileArg = args[1] === undefined ? 'last save' : args[1];
        getProfile(name, profileArg).then(data => {
            if (data.error) {
                errorRead(data.text);
                return;
            }
            let chat = [];
            chat.push(new Message().addTextComponent(new TextComponent(`&b Data for: ${data.formatedName}&r`)));
            chat.push(new Message().addTextComponent(new TextComponent('&r')));
            chat.push(new Message().addTextComponent(new TextComponent('&d Kuudra Runs:&r')));
            kuudraSequence.forEach(kuudra => {
                const { completions, waves } = getKuudraData(kuudra, data)
                chat.push(new Message().addTextComponent(new TextComponent(`&d ${kuudraToColor[kuudra]}${toTitleCase(kuudra)}: &b${addNotation('commas', completions)} &c[&d${addNotation('commas', waves)}&c]`)));
            });
            chat.push(new Message().addTextComponent(new TextComponent('&r')));
            chat.push(new Message().addTextComponent(new TextComponent('&d Dojo Points:&r')));
            chat.push(new Message().addTextComponent(new TextComponent(`&r ${getTotalDojo(data)}&r`)));
            dojoSequence.forEach(dojo => {
                chat.push(new Message().addTextComponent(new TextComponent(`&r ${getDojo(dojo, data)}&r`)));
            })
            chat.push(new Message().addTextComponent(new TextComponent('&r')));
            chat.push(new Message().addTextComponent(new TextComponent(`&5 ${data.raw.members[data.uuid]?.nether_island_player_data?.selected_faction === 'mages' ? '&l' : ''}Mage&r&f: ${addNotation('commas', data.raw.members[data.uuid]?.nether_island_player_data?.mages_reputation || 0)}&r`)));
            chat.push(new Message().addTextComponent(new TextComponent(`&c ${data.raw.members[data.uuid]?.nether_island_player_data?.selected_faction === 'barbarians' ? '&l' : ''}Barbs&r&f: ${addNotation('commas', data.raw.members[data.uuid]?.nether_island_player_data?.barbarians_reputation || 0)}&r`)));
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

function getKuudraData(name, data) {
    return {
        completions: data.raw.members[data.uuid]?.nether_island_player_data?.kuudra_completed_tiers?.[name === 'basic' ? 'none' : name] || 0,
        waves: data.raw.members[data.uuid]?.nether_island_player_data?.kuudra_completed_tiers?.[`highest_wave_${name === 'basic' ? 'none' : name}`] || 0,
    }
}

function getTotalDojo(data) {
    let rank;
    const crimsonData = data.raw.members[data.uuid]?.nether_island_player_data?.dojo;
    const total = 
        (crimsonData?.dojo_points_mob_kb || 0) +
        (crimsonData?.dojo_points_wall_jump || 0) +
        (crimsonData?.dojo_points_archer || 0) +
        (crimsonData?.dojo_points_sword_swap || 0) +
        (crimsonData?.dojo_points_snake || 0) +
        (crimsonData?.dojo_points_fireball || 0) +
        (crimsonData?.dojo_points_lock_head || 0);
    if (total >= 7000) {
        rank = `&8Black&f: &7${addNotation('commas', total)}`;
    } else if (total >= 6000) {
        rank = `&6Brown&f: &7${addNotation('commas', total)}`;
    } else if (total >= 4000) {
        rank = `&9Blue&f: &7${addNotation('commas', total)}`;
    } else if (total >= 2000) {
        rank = `&aGreen&f: &7${addNotation('commas', total)}`;
    } else if (total >= 1000) {
        rank = `&eYellow&f: &7${addNotation('commas', total)}`;
    } else {
        rank = `&fWhite&f: &7${addNotation('commas', total)}`;
    }
    return rank;
}

function getDojo(name, data) {
    let dojo;
    const crimsonData = data.raw.members[data.uuid]?.nether_island_player_data?.dojo;
    const point = crimsonData?.[`dojo_points_${dojoToAPIName[name]}`] || null;
    if (point === null) {
        dojo = `&c${toTitleCase(name)}&f: &cN/A &8(0)`;
    } else if (point >= 1000) {
        dojo = `&6${toTitleCase(name)}&f: &6S &8(${addNotation('commas', point)})`;
    } else if (point >= 800) {
        dojo = `&d${toTitleCase(name)}&f: &dA &8(${addNotation('commas', point)})`;
    } else if (point >= 600) {
        dojo = `&9${toTitleCase(name)}&f: &9B &8(${addNotation('commas', point)})`;
    } else if (point >= 400) {
        dojo = `&a${toTitleCase(name)}&f: &aC &8(${addNotation('commas', point)})`;
    } else if (point >= 200) {
        dojo = `&a${toTitleCase(name)}&f: &aD &8(${addNotation('commas', point)})`;
    } else if (point >= 150) {
        dojo = `&a${toTitleCase(name)}&f: &aE &8(${addNotation('commas', point)})`;
    } else if (point >= 0) {
        dojo = `&a${toTitleCase(name)}&f: &aF &8(${addNotation('commas', point)})`;
    }
    return dojo;
}