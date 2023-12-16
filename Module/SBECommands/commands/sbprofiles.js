import { getCommandDataRes } from '../utils/request';
import { formatUsername, humanizeTime } from '../utils/utils';
import { sendMultiLineChat, sendErrorChatWithLog } from '../utils/chatHandler';

const gameModeToLogo = {
    normal: '',
    ironman: ' &7♲',
    bingo: ' &7Ⓑ',
    island: ' &7☀',
};

module.exports = {
    name: 'sbprofiles',
    description: 'Returns profiles data for player.',
    usage: '[username]',
    execute(args) {
        const name = args[0] ?? Player.getName();
        getCommandDataRes(this.name, name)
            .then((res) => {
                const { data } = res.data;
                const chat = [];
                chat.push(`&bProfiles Data for: ${formatUsername(data.rank, data.username)}&r`);
                chat.push('&r');
                data.profiles.forEach((profile) => {
                    chat.push(`&b${profile.profileName}${gameModeToLogo[profile.game_mode]} &7(${profile.first_join ? '&5' + humanizeTime(new Date().getTime() - profile.first_join) : '&cNot Joined'}&7)${profile.selected ? ' &a- Selected' : ''}&r`);
                });
                sendMultiLineChat(chat, true);
            })
            .catch((error) => {
                sendErrorChatWithLog(error, 'run command', this);
            });
    },
};
