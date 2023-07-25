import { addNotation } from '../Utils/Utils';
import { leveling_xp } from '../Constants/leveling_xp';

let customCommandName = 'calcskill';

module.exports = {
    name: 'calcskill',
    execute(args) {
        if (args[0] == undefined || args[1] == undefined) {
            ChatLib.chat(`&3[SBEC] &a&cImproper Usage. /${customCommandName} [startLevel] [endLevel]&r`);
            return;
        }
        if (isNaN(args[0]) || isNaN(args[1]) || args[0] < 0 || args[1] > 60) {
            ChatLib.chat('&3[SBEC] &a&cAn Error Occurred&r');
            return;
        }
        let leveling_xpArray = leveling_xp.leveling_xp;
        let expRemainingArray = leveling_xpArray.slice(parseInt(args[0]) + 1, parseInt(args[1]) + 1);
        let expRemaining = expRemainingArray.length == 0 ? 0 : addNotation('commas', expRemainingArray.reduce((a, b) => a + b));
        ChatLib.chat('&c&m--------------------&r');
        ChatLib.chat(`&b&lSkill XP Required: &6&l${expRemaining}&r`);
        ChatLib.chat('&c&m--------------------&r');
    },
    inject(name) {
        customCommandName = name;
    }
}