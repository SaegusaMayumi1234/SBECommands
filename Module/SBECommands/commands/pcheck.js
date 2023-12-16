import { sendSingleLineChat, sendErrorChatWithLog, sendMultiLineChat } from '../utils/chatHandler';
import { getCheckMode, getGlobalCommands, getCheckMessage } from '../utils/commandUtils';
import { postCommandDataRes } from '../utils/request';

let isGettingMemberList = false;
let isPartyListMessage = false;
let currentPartySize = 0;
let currentPlayerList = [];
let currentMode = 'dungeon';

module.exports = {
    name: 'pcheck',
    description: 'Returns catacombs or kuudra data for party.',
    usage: '(dungeon/kuudra)',
    execute(args) {
        if (isGettingMemberList) return;
        currentMode = getCheckMode(args[0]);
        isGettingMemberList = true;
        ChatLib.command('party list');
        partyCheckTimer.register();
    },
};

const partyCheckTimer = register('step', () => {
    disablePartyCheck();
    sendSingleLineChat('&cFailed to get party member list!&r', false, true);
}).setDelay(5).unregister();

register('chat', (partySize) => {
    if (!isGettingMemberList) return;
    partySize = parseInt(partySize);
    let chat = null;
    if (partySize === 1) {
        chat = `&cParty is too small for a ${currentMode} party.&r`;
    } else if ((currentMode === 'dungeon' && partySize > 5) || (currentMode === 'kuudra' && partySize > 4)) {
        chat = `&cParty is too big for a ${currentMode} party.&r`;
    }
    if (chat) {
        disablePartyCheck();
        setTimeout(() => {
            sendSingleLineChat(chat, false, true);
        }, 100);
        return;
    }
    currentPartySize = partySize;
    isPartyListMessage = true;
}).setCriteria('Party Members (${partySize})');

register('chat', (role, members) => {
    if (!isGettingMemberList || !isPartyListMessage) return;
    if (role !== 'Leader' && role !== 'Moderators' && role !== 'Members') return;
    members.split('●').map((value) => {
        value = value.trim().split(' ');
        return value.length === 2 ? value[1] : value[0];
    }).filter((value) => value !== '').forEach((member) => {
        currentPlayerList.push(member.trim());
    });
    if (currentPlayerList.length === currentPartySize) {
        partyCheckTimer.unregister();
        runCommand(currentPlayerList, currentMode);
        disablePartyCheck();
        setTimeout(() => {
            sendSingleLineChat('&aFinding party data...&r', false, true);
        }, 100);
    }
}).setCriteria('Party ${role}: ${members}');

register('chat', () => {
    if (!isGettingMemberList) return;
    disablePartyCheck();
}).setCriteria('You are not currently in a party.');

function disablePartyCheck() {
    partyCheckTimer.unregister();
    currentPlayerList = [];
    currentPartySize = 0;
    isGettingMemberList = false;
    isPartyListMessage = false;
}

function runCommand(playerList, mode) {
    const globalCommands = getGlobalCommands();
    postCommandDataRes(`${globalCommands['pcheck'].name}-${mode}`, playerList)
        .then((res) => {
            const { data } = res.data;
            data.forEach((playerData) => {
                if (playerData.status === 200) {
                    sendMultiLineChat(getCheckMessage(playerData.data, mode), true);
                } else {
                    let errorObj = new Error('API Request Failed');
                    errorObj.isAxiosError = true;
                    errorObj.code = playerData.status;
                    errorObj.response = {
                        data: playerData,
                    };
                    sendErrorChatWithLog(errorObj, 'run command', globalCommands['pcheck']);
                }
            });
            sendMultiLineChat([new TextComponent(`&aWrong mode? Try running &e/${globalCommands['pcheck'].registeredName} ${mode === 'dungeon' ? 'kuudra' : 'dungeon'} &ato override automatic mode detection!&r`)
                .setClick('run_command', `/${globalCommands['pcheck'].registeredName} ${mode === 'dungeon' ? 'kuudra' : 'dungeon'}`)], false);
        })
        .catch((error) => {
            sendErrorChatWithLog(error, 'run command', globalCommands['pcheck']);
        });
}
