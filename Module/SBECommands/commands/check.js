import Settings from '../utils/config';
import { sendErrorChatWithLog, sendMultiLineChat } from '../utils/chatHandler';
import { getCheckMode, getCheckMessage, getGlobalCommands } from '../utils/commandUtils';
import { getCommandDataRes } from '../utils/request';

module.exports = {
    name: 'check',
    description: 'Returns catacombs or kuudra data for player individually instead of party.',
    usage: '[username] (dungeon/kuudra)',
    execute(args, type) {
        const name = args[0] ?? Player.getName();
        const mode = getCheckMode(args[1]);
        getCommandDataRes(`${this.name}-${mode}`, name)
            .then((res) => {
                const { data } = res.data;
                sendMultiLineChat(getCheckMessage(data, mode), true);
                if (type === 'party finder') {
                    sendMultiLineChat([new TextComponent(`&aClick here to remove &d${name} &afrom the party!&r`)
                        .setClick('run_command', `/p remove ${name}`)], false);
                } else {
                    sendMultiLineChat([new TextComponent(`&aWrong mode? Try running &e/${this.registeredName} ${name} ${mode === 'dungeon' ? 'kuudra' : 'dungeon'} &ato override automatic mode detection!&r`)
                        .setClick('run_command', `/${this.registeredName} ${name} ${mode === 'dungeon' ? 'kuudra' : 'dungeon'}`)], false);
                }
            })
            .catch((error) => {
                sendErrorChatWithLog(error, 'run command', this);
            });
    },
};

register('chat', (name) => {
    if (!Settings.pfStats) return;
    if (Settings.hideSelfCheck && name === Player.getName()) return;
    const globalCommands = getGlobalCommands();
    globalCommands['check'].execute([name, 'dungeon'], 'party finder');
}).setCriteria('Party Finder > ${name} joined the dungeon group! ${*}');

register('chat', (name) => {
    if (!Settings.pfStats) return;
    if (Settings.hideSelfCheck && name === Player.getName()) return;
    const globalCommands = getGlobalCommands();
    globalCommands['check'].execute([name, 'kuudra'], 'party finder');
}).setCriteria('Party Finder > ${name} joined the group! ${*}');
