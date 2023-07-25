import { getProfile } from '../Modules/APIWrapper/Route';
import { errorRead, addNotation } from '../Utils/Utils';

let customCommandName = 'ms';

module.exports = {
    name: 'ms',
    execute(args) {
        let name = args[0] == undefined ? Player.getName() : args[0];
        let profileArg = args[1] == undefined ? 'last save' : args[1];
        getProfile(name, profileArg).then(data => {
            if (data.error) {
                errorRead(data.text);
                return;
            }
            ChatLib.chat('&c&m--------------------&r');
            ChatLib.chat(`&bMilestone for: ${data.formatedName}&r`);
            ChatLib.chat(`&cOres Mined: ${addNotation('commas', data.raw.members[data.uuid].stats?.pet_milestone_ores_mined || 0)}&r`);
            ChatLib.chat(`&bSea Creatures Killed: ${addNotation('commas', data.raw.members[data.uuid].stats?.pet_milestone_sea_creatures_killed || 0)}&r`);
            ChatLib.chat('&c&m--------------------&r');
        }).catch(error => {
            ChatLib.chat(`&3[SBEC] &cUnknown error occured while trying to run ${customCommandName}! If this issue still presist report this to module author!`);
        });
    },
    inject() {
        customCommandName = name;
    }
}