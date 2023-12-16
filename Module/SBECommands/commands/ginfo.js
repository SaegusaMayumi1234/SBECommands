import { sendErrorChatWithLog, sendMultiLineChat } from '../utils/chatHandler';
import { getCommandDataRes } from '../utils/request';
import { formatUsername, humanizeTime, timestampToDate } from '../utils/utils';

module.exports = {
    name: 'ginfo',
    description: 'Returns guild data for player.',
    usage: '[username]',
    execute(args) {
        const name = args[0] ?? Player.getName();
        getCommandDataRes(this.name, name)
            .then((res) => {
                const { data } = res.data;
                const chat = [];
                chat.push(`&bGuild Data for: ${formatUsername(data.rank, data.username)}&r`);
                chat.push(`&bGuild: &a${data.guild.name}&r`);
                chat.push(`&bTag: &${data.guild.tagColorCode}${data.guild.tag ?? '&7-'}&r`);
                chat.push(`&bCreated: &e${timestampToDate(data.guild.created)} &7(&5${humanizeTime(new Date().getTime() - data.guild.created)}&7)&r`);
                chat.push(`&bLevel: &e${data.guild.level}&r`);
                chat.push(`&bDescription: &e${data.guild.description ?? '&7-'}&r`);
                chat.push(`&bPreferred Games: &a${data.guild.preferredGames.length !== 0 ? data.guild.preferredGames.join(', ') : '&7-'}&r`);
                chat.push(`&bGuild Master: ${formatUsername(data.guild.owner.rank, data.guild.owner.username)}&r`);
                chat.push(`&bMembers: &e${data.guild.members}&6/&e125&r`);
                sendMultiLineChat(chat, true);
            })
            .catch((error) => {
                sendErrorChatWithLog(error, 'run command', this);
            });
    },
};
