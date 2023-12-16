import { rarityAliases } from '../constants/misc';
import { pet_rarity_offset, pet_xp } from '../constants/xpTable';
import { sendSingleLineChat } from '../utils/chatHandler';
import { addNotation } from '../utils/utils';

module.exports = {
    name: 'calcpet',
    description: 'Returns necessary exp from starting pet level to ending level.',
    usage: '[com/unc/rare/epic/leg/myt] [startLevel] [endLevel]',
    execute(args) {
        const rarityArgs = (args[0] ?? '').toLowerCase();
        const startLevel = parseInt(args[1]);
        const endLevel = parseInt(args[2]);
        const rarity = rarityAliases[rarityArgs] ?? rarityArgs;
        if (!Object.values(rarityAliases).includes(rarity) || isNaN(startLevel) || isNaN(endLevel)) {
            sendSingleLineChat(`&cImproper Usage. /${this.registeredName} ${this.usage}&r`, false, true);
            return;
        }
        if (startLevel < 0 || endLevel > (rarity === 'legendary' ? 200 : 100)) {
            sendSingleLineChat('&cImproper Usage. The startLevel must not be less than 0 and the endLevel must not be more than 100 or 200 for leg.&r', false, true);
            return;
        }
        const petXpArray = pet_xp.slice(
            pet_rarity_offset[rarity],
            pet_rarity_offset[rarity] + (rarity === 'legendary' ? 200 : 100) - 1
        );
        const xpRemaining = [0, ...petXpArray].slice(startLevel, endLevel).reduce((a, b) => a + b);
        sendSingleLineChat(`&b&lPet XP Required: &6&l${addNotation('commas', xpRemaining)}&r`, true, false);
    },
};
