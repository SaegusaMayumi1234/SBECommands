import { catacombs_xp } from '../constants/xpTable';
import { sendSingleLineChat } from '../utils/chatHandler';
import { addNotation } from '../utils/utils';

module.exports = {
    name: 'calccata',
    description: 'Returns necessary exp from starting catacombs level to ending level.',
    usage: '[startLevel] [endLevel]',
    execute(args) {
        const startLevel = parseInt(args[0]);
        const endLevel = parseInt(args[1]);
        if (isNaN(startLevel) || isNaN(endLevel)) {
            sendSingleLineChat(`&cImproper Usage. /${this.registeredName} ${this.usage}&r`, false, true);
            return;
        }
        if (startLevel < 0 || endLevel > 100) {
            sendSingleLineChat('&cImproper Usage. The startLevel must not be less than 0 and the endLevel must not be more than 100.&r', false, true);
            return;
        }
        let xpRemaining = catacombs_xp.slice(startLevel, endLevel).reduce((a, b) => a + b);
        if (endLevel > 50) {
            xpRemaining += (endLevel - 50) * 200000000;
        }
        sendSingleLineChat(`&b&lCatacombs XP Required: &6&l${addNotation('commas', xpRemaining)}&r`, true, false);
    },
};
