import Settings from '../ConfigData/config';

let customCommandName = 'sbec';

const commandsName = {
    'sbec': 'sbec',
    'sbecsettings': 'sbecsettings',
    'sbecauthor': 'sbecauthor',
    'sbecsetkey': 'sbecsetkey',
    'calcpet': 'calcpet',
    'calcskill': 'calcskill',
    'calccata': 'calccata',
    'fake': 'fake',
    'ginfo': 'ginfo',
    'sbprofiles': 'sbprofiles',
    'player': 'player',
    'weight': 'weight',
    'nw': 'nw',
    'sbskills': 'sbskills',
    'slayer': 'slayer',
    'cata': 'cata',
    'ms': 'ms',
    'wealth': 'wealth',
    'sbpets': 'sbpets',
    'sbhotm': 'sbhotm',
    'targetpractice': 'targetpractice',
    'essence': 'essence',
    'inventory': 'inventory',
    'pcheck': 'pcheck',
    'trophyfish': 'trophyfish'
};

const enableCommandsName = {
    'sbec': true,
    'sbecsettings': true,
    'sbecauthor': true,
    'sbecsetkey': true,
    'calcpet': true,
    'calcskill': true,
    'calccata': true,
    'fake': true,
    'ginfo': true,
    'sbprofiles': true,
    'player': true,
    'weight': true,
    'nw': true,
    'sbskills': true,
    'slayer': true,
    'cata': true,
    'ms': true,
    'wealth': true,
    'sbpets': true,
    'sbhotm': true,
    'targetpractice': true,
    'essence': true,
    'inventory': true,
    'pcheck': true,
    'trophyfish': true
};

Object.keys(commandsName).forEach(command => {
    if (Settings['custom' + command] !== '' && Settings['custom' + command] !== undefined) {
        commandsName[command] = Settings['custom' + command];
    }
});

module.exports = {
    name: 'sbec',
    execute(args) {
        let chat = [];
        chat.push(new Message().addTextComponent(new TextComponent(` &${enableCommandsName['sbec'] ? 'a' : 'c'}◆ /${commandsName['sbec']} &8(Hover for usage)&r &7↣Sending this help message&r`).setHover("show_text", `&e${commandsName['sbec']}`)));
        chat.push(new Message().addTextComponent(new TextComponent(` &${enableCommandsName['sbecsettings'] ? 'a' : 'c'}◆ /${commandsName['sbecsettings']} &8(Hover for usage)&r &7↣Opening SBEC Settings GUI&r`).setHover("show_text", `&e${commandsName['sbecsettings']}`)));
        chat.push(new Message().addTextComponent(new TextComponent(` &${enableCommandsName['sbecauthor'] ? 'a' : 'c'}◆ /${commandsName['sbecauthor']} &8(Hover for usage)&r &7↣Return some information about the author of this module&r`).setHover("show_text", `&e${commandsName['sbecauthor']}`)));
        chat.push(new Message().addTextComponent(new TextComponent(` &${enableCommandsName['sbecsetkey'] ? 'a' : 'c'}◆ /${commandsName['sbecsetkey']} &8(Hover for usage)&r &7↣Set Hypixel API Key&r`).setHover("show_text", `&e${commandsName['sbecsetkey']} [key]`)));
        chat.push(new Message().addTextComponent(new TextComponent(` &${enableCommandsName['calcpet'] ? 'a' : 'c'}◆ /${commandsName['calcpet']} &8(Hover for usage)&r &7↣Returns necessary exp from starting pet level to ending level&r`).setHover("show_text", `&e${commandsName['calcpet']} [com/unc/rare/epic/leg/myt] [startLevel] [endLevel]`)));
        chat.push(new Message().addTextComponent(new TextComponent(` &${enableCommandsName['calcskill'] ? 'a' : 'c'}◆ /${commandsName['calcskill']} &8(Hover for usage)&r &7↣Returns necessary exp from starting skill level to ending level&r`).setHover("show_text", `&e${commandsName['calcskill']} [startLevel] [endLevel]`)));
        chat.push(new Message().addTextComponent(new TextComponent(` &${enableCommandsName['calccata'] ? 'a' : 'c'}◆ /${commandsName['calccata']} &8(Hover for usage)&r &7↣Returns necessary exp from starting catacombs level to ending level`).setHover("show_text", `&e${commandsName['calccata']} [startLevel] [endLevel]`)));
        chat.push(new Message().addTextComponent(new TextComponent(` &${enableCommandsName['fake'] ? 'a' : 'c'}◆ /${commandsName['fake']} &8(Hover for usage)&r &7↣Returns new faked string. Color Codes enabled&r`).setHover("show_text", `&e${commandsName['fake']}`)));
        chat.push(new Message().addTextComponent(new TextComponent(` &${enableCommandsName['ginfo'] ? 'a' : 'c'}◆ /${commandsName['ginfo']} &8(Hover for usage)&r &7↣Returns guild data for a player`).setHover("show_text", `&e${commandsName['ginfo']} [username]`)));
        chat.push(new Message().addTextComponent(new TextComponent(` &${enableCommandsName['sbprofiles'] ? 'a' : 'c'}◆ /${commandsName['sbprofiles']} &8(Hover for usage)&r &7↣Returns profiles for given player&r`).setHover("show_text", `&e${commandsName['sbprofiles']} [username]`)));
        chat.push(new Message().addTextComponent(new TextComponent(` &${enableCommandsName['player'] ? 'a' : 'c'}◆ /${commandsName['player']} &8(Hover for usage)&r &7↣Returns general stats for player&r`).setHover("show_text", `&e${commandsName['player']} [username] (profileName)`)));
        chat.push(new Message().addTextComponent(new TextComponent(` &${enableCommandsName['weight'] ? 'a' : 'c'}◆ /${commandsName['weight']} &8(Hover for usage)&r &7↣Returns weight for player&r`).setHover("show_text", `&e${commandsName['weight']} [username] (profileName)`)));
        chat.push(new Message().addTextComponent(new TextComponent(` &${enableCommandsName['nw'] ? 'a' : 'c'}◆ /${commandsName['nw']} &8(Hover for usage)&r &7↣Returns networth for player. Uses Maro API&r`).setHover("show_text", `&e${commandsName['nw']} [username] (profileName)`)));
        chat.push(new Message().addTextComponent(new TextComponent(` &${enableCommandsName['sbskills'] ? 'a' : 'c'}◆ /${commandsName['sbskills']} &8(Hover for usage)&r &7↣Returns information on skills for player&r`).setHover("show_text", `&e${commandsName['sbskills']} [username] (profileName)`)));
        chat.push(new Message().addTextComponent(new TextComponent(` &${enableCommandsName['slayer'] ? 'a' : 'c'}◆ /${commandsName['slayer']} &8(Hover for usage)&r &7↣Returns information on slayer for player&r`).setHover("show_text", `&e${commandsName['slayer']} [username] (profileName)`)));
        chat.push(new Message().addTextComponent(new TextComponent(` &${enableCommandsName['cata'] ? 'a' : 'c'}◆ /${commandsName['cata']} &8(Hover for usage)&r &7↣Returns catacombs data for player&r`).setHover("show_text", `&e${commandsName['cata']} [username] (profileName)`)));
        chat.push(new Message().addTextComponent(new TextComponent(` &${enableCommandsName['ms'] ? 'a' : 'c'}◆ /${commandsName['ms']} &8(Hover for usage)&r &7↣Returns fishing and mining milestones data for player&r`).setHover("show_text", `&e${commandsName['ms']} [username] (profileName)`)));
        chat.push(new Message().addTextComponent(new TextComponent(` &${enableCommandsName['wealth'] ? 'a' : 'c'}◆ /${commandsName['wealth']} &8(Hover for usage)&r &7↣Returns banking and purse info for player&r`).setHover("show_text", `&e${commandsName['wealth']} [username] (profileName)`)));
        chat.push(new Message().addTextComponent(new TextComponent(` &${enableCommandsName['sbpets'] ? 'a' : 'c'}◆ /${commandsName['sbpets']} &8(Hover for usage)&r &7↣Returns information on pets for player&r`).setHover("show_text", `&e${commandsName['sbpets']} [username] (profileName)`)));
        chat.push(new Message().addTextComponent(new TextComponent(` &${enableCommandsName['sbhotm'] ? 'a' : 'c'}◆ /${commandsName['sbhotm']} &8(Hover for usage)&r &7↣Returns information on a player's Heart of the Mountain.&r`).setHover("show_text", `&e${commandsName['sbhotm']} [username] (profileName)`)));
        chat.push(new Message().addTextComponent(new TextComponent(` &${enableCommandsName['targetpractice'] ? 'a' : 'c'}◆ /${commandsName['targetpractice']} &8(Hover for usage)&r &7↣Returns a player's fastest target practice time.&r`).setHover("show_text", `&e${commandsName['targetpractice']} [username] (profileName)`)));
        chat.push(new Message().addTextComponent(new TextComponent(` &${enableCommandsName['essence'] ? 'a' : 'c'}◆ /${commandsName['essence']} &8(Hover for usage)&r &7↣Returns a player's dungeon essence values.&r`).setHover("show_text", `&e${commandsName['essence']} [username] (profileName)`)));
        chat.push(new Message().addTextComponent(new TextComponent(` &${enableCommandsName['inventory'] ? 'a' : 'c'}◆ /${commandsName['inventory']} &8(Hover for usage)&r &7↣Displays the inventory for a player&r`).setHover("show_text", `&e${commandsName['inventory']} [username] (profileName)`)));
        chat.push(new Message().addTextComponent(new TextComponent(` &${enableCommandsName['pcheck'] ? 'a' : 'c'}◆ /${commandsName['pcheck']} &8(Hover for usage)&r &7↣Returns information on party&r`).setHover("show_text", `&e${commandsName['pcheck']}`)));
        chat.push(new Message().addTextComponent(new TextComponent(` &${enableCommandsName['trophyfish'] ? 'a' : 'c'}◆ /${commandsName['trophyfish']} &8(Hover for usage)&r &7↣Returns information on trophy fish loot&r`).setHover("show_text", `&e${commandsName['trophyfish']} [username] (profileName)`)));
        ChatLib.chat(`&c&m--------------&c[ &dSBECommands &c]&r&c&m--------------&r`);
        chat.forEach(item => {
            item.chat();
        })
        ChatLib.chat(" &aMade with &c❤ &aby &bIcarusPhantom");
        ChatLib.chat(`&c&m--------------------------------------------&r`);
    },
    inject(name) {
        customCommandName = name;
    },
    injectDisabled(name, state) {
        enableCommandsName[name] = state
    }
}
