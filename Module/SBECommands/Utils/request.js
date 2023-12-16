import axios from '../../axios';

const metadata = JSON.parse(FileLib.read('SBECommands', 'metadata.json'));

export function getCommandDataRes(command, uuid, profile) {
    return axios.get(`https://api.icarusphantom.dev/v1/sbecommands/${command}/${uuid}${profile && profile !== 'selected' ? '/' + profile : ''}`, {
        headers: {
            'User-Agent': `Mozilla/5.0 (ChatTriggers ${ChatTriggers.MODVERSION}) SBECommands/${metadata.version} ${Player.getUUID()}`,
        },
        timeout: 60000,
        parseBody: true,
    });
}

export function postCommandDataRes(command, uuid) {
    return axios.post(`https://api.icarusphantom.dev/v1/sbecommands/${command}`, {
        headers: {
            'User-Agent': `Mozilla/5.0 (ChatTriggers ${ChatTriggers.MODVERSION}) SBECommands/${metadata.version} ${Player.getUUID()}`,
        },
        timeout: 60000,
        parseBody: true,
        body: {
            uuid,
        },
    });
}
