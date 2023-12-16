import { skill_xp } from '../constants/xpTable';
import { sendSingleLineChat } from '../utils/chatHandler';
import { addNotation } from '../utils/utils';

module.exports = {
    name: 'calcskill',
    description: 'Returns necessary exp from starting skill level to ending level.',
    usage: '[startLevel] [endLevel]',
    execute(args) {
        const startLevel = parseInt(args[0]);
        const endLevel = parseInt(args[1]);
        if (isNaN(startLevel) || isNaN(endLevel)) {
            sendSingleLineChat(`&cImproper Usage. /${this.registeredName} ${this.usage}&r`, false, true);
            return;
        }
        if (startLevel < 0 || endLevel > 60) {
            sendSingleLineChat('&cImproper Usage. The startLevel must not be less than 0 and the endLevel must not be more than 60.&r', false, true);
            return;
        }
        const xpRemaining = skill_xp.general.slice(startLevel, endLevel).reduce((a, b) => a + b);
        sendSingleLineChat(`&b&lSkill XP Required: &6&l${addNotation('commas', xpRemaining)}&r`, true, false);
    },
};
