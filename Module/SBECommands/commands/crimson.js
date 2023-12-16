import { dojoBeltToColor, dojoRankToColor, kuudraToColor } from '../constants/misc';
import { kuudraSequence, dojoSequence } from '../constants/sequence';
import { sendErrorChatWithLog, sendMultiLineChat } from '../utils/chatHandler';
import { getCommandDataRes } from '../utils/request';
import { formatUsername, toTitleCase, addNotation } from '../utils/utils';

module.exports = {
    name: 'crimson',
    description: 'Returns crimson isle data for player.',
    usage: '[username] (profileName)',
    execute(args) {
        const name = args[0] ?? Player.getName();
        const profileArg = args[1] ?? 'selected';
        getCommandDataRes(this.name, name, profileArg)
            .then((res) => {
                const { data } = res.data;
                const chat = [];
                chat.push(`&b Crimson Data for: ${formatUsername(data.rank, data.username)}&r`);
                chat.push('&r');
                chat.push('&d Kuudra Runs:&r');
                kuudraSequence.forEach((kuudra) => {
                    chat.push(`&d &${kuudraToColor[kuudra]}${toTitleCase(kuudra)}: &b${addNotation('commas', data.nether.kuudra.completed_tier[kuudra])} &c[&d${addNotation('commas', data.nether.kuudra.highest_wave[kuudra])}&c]&r`);
                });
                chat.push('&r');
                chat.push('&d Dojo Points:&r');
                chat.push(`&${dojoBeltToColor[data.nether.dojo.belt]} ${data.nether.dojo.belt}&f: &7${addNotation('commas', data.nether.dojo.total)}&r`);
                dojoSequence.forEach((dojo) => {
                    chat.push(`&${dojoRankToColor[data.nether.dojo[dojo].rank]} ${toTitleCase(dojo)}&f: &${dojoRankToColor[data.nether.dojo[dojo].rank]}${data.nether.dojo[dojo].rank} &8(${addNotation('commas', data.nether.dojo[dojo].score ?? 0)})&r`);
                });
                chat.push('&r');
                chat.push(`&5 ${data.nether.faction.selected === 'mages' ? '&l' : ''}Mage&r&f: ${addNotation('commas', data.nether.faction.mages_reputation)}&r`);
                chat.push(`&c ${data.nether.faction.selected === 'barbarians' ? '&l' : ''}Barbarian&r&f: ${addNotation('commas', data.nether.faction.barbarians_reputation)}&r`);
                sendMultiLineChat(chat, true);
            })
            .catch((error) => {
                sendErrorChatWithLog(error, 'run command', this);
            });
    },
};
