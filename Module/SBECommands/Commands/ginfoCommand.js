import { getHypixelGuild, getHypixelPlayer } from '../Modules/APIWrapper/Route';
import { errorRead } from '../Utils/Utils';

let customCommandName = 'ginfo';

module.exports = {
    name: 'ginfo',
    execute(args) {
        let name = args[0] == undefined ? Player.getName() : args[0];
        getHypixelGuild(name).then(data => {
            if (data.error) {
                errorRead(data.text);
                return;
            }
            if (data.guild.guild == null) {
                ChatLib.chat('&c&m--------------------&r');
                ChatLib.chat(`${data.formatedName} &cis not in a Guild!&r`);
                ChatLib.chat('&c&m--------------------&r');
                return;
            }
            let members = data.guild.guild.members;
            let owner = members.filter(member => member.rank === 'Guild Master');
            if (owner.length === 0) {
                owner = members.filter(member => member.rank === 'GUILDMASTER');
            }
            getHypixelPlayer(owner[0].uuid).then(data2 => {
                if (data2.error) {
                    errorRead(data.text);
                    return;
                }
                ChatLib.chat('&c&m--------------------&r');
                ChatLib.chat(`&bGuild Data for: ${data.formatedName}&r`);
                ChatLib.chat(`&bGuild: &a${data.guild.guild.name}&r`);
                ChatLib.chat(`&bGuild Master: ${data2.formatedName}&r`);
                ChatLib.chat('&c&m--------------------&r');
            });
        }).catch(error => {
            ChatLib.chat(`&3[SBEC] &cUnknown error occured while trying to run ${customCommandName}! If this issue still presist report this to module author!`);
        });
    },
    inject(name) {
        customCommandName = name;
    }
}