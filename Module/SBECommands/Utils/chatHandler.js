import { formatUsername } from './utils';

export function sendMultiLineChat(chat, linebreak) {
    if (linebreak) ChatLib.chat('&c&m--------------------&r');
    chat.forEach((line) => {
        let message = new Message();
        if (Array.isArray(line)) {
            line.forEach((value) => {
                message.addTextComponent(value);
            });
        } else {
            message.addTextComponent(line);
        }
        message.chat();
    });
    if (linebreak) ChatLib.chat('&c&m--------------------&r');
}

export function sendSingleLineChat(chat, linebreak, prefix) {
    if (linebreak) ChatLib.chat('&c&m--------------------&r');
    ChatLib.chat(`${prefix ? '&3[SBEC]&r ' : ''}${chat}`);
    if (linebreak) ChatLib.chat('&c&m--------------------&r');
}

export function sendErrorChatWithLog(error, mode, data) {
    if (error.isAxiosError) {
        error.message = 'API Request Failed';
        error.noConsole = true;
        switch (error.code) {
            case 400:
                switch (error.response.data.code) {
                    case 'INVALID_USER_FORMAT_ASHCON_MOJANG':
                        error.chat = `&c'&7${error.response.data.details.uuid}&c' is an invalid Username!&r`;
                        error.linebreak = true;
                        break;
                }
                break;
            case 404:
                switch (error.response.data.code) {
                    case 'USER_NOT_FOUND_ASHCON_MOJANG':
                        error.chat = `&c'&7${error.response.data.details.uuid}&c' is an invalid username!&r`;
                        error.linebreak = true;
                        break;
                    case 'HYPIXEL_PLAYER_DATA_NOT_FOUND':
                        error.chat = `&c&7${error.response.data.details.username} &chasn't joined Hypixel!&r`;
                        error.linebreak = true;
                        break;
                    case 'NO_HYPIXEL_SKYBLOCK_PROFILES_DATA':
                        error.chat = `&c${formatUsername(error.response.data.details.rank, error.response.data.details.username)} &cdoesn't have any skyblock profiles!&r`;
                        error.linebreak = true;
                        break;
                    case 'SELECTED_HYPIXEL_SKYBLOCK_PROFILE_DATA_NOT_FOUND':
                        error.chat = `&c${formatUsername(error.response.data.details.rank, error.response.data.details.username)} &cdoesn't have any skyblock profile named '${error.response.data.details.selectedProfile}'!&r`;
                        error.linebreak = true;
                        break;
                    case 'HYPIXEL_GUILD_DATA_NOT_FOUND':
                        error.chat = `&c${formatUsername(error.response.data.details.rank, error.response.data.details.username)} &cis not in a Guild!&r`;
                        error.linebreak = true;
                        break;
                    case 'GUILD_OWNER_NOT_FOUND':
                        error.chat = '&cCannot find the guild owner. Please report this to the module author!&r';
                        error.linebreak = true;
                        break;
                }
                break;
            case 429:
                error.chat = error.response.data.global
                    ? '&cGetting global rate limited while trying to request data from API, please try again later! (too many user using the API)&r'
                    : '&cGetting rate limited while trying to request data from API, please try again later!&r';
                break;
            case 500:
                error.chat = '&cInternal server error while trying to request data from API! If this issue still persists, please report this to the module author!&r';
                error.noConsole = false;
                break;
            case 502:
            case 503:
            case 504:
                switch (error.response.data.code) {
                    case 'BAD_GATEWAY_ASHCON_MOJANG':
                    case 'TIMED_OUT_ASHCON_MOJANG':
                        error.chat = '&cSeems like Ashcon Mojang API is currently experiencing some technical issues, please try again later!&r';
                        break;
                    case 'BAD_GATEWAY_HYPIXEL':
                    case 'TIMED_OUT_HYPIXEL':
                        error.chat = '&cSeems like Hypixel API is currently experiencing some technical issues, please try again later!&r';
                        break;
                    default:
                        error.chat = '&cSeems like the API is currently experiencing some technical issues, please try again later! If this issue still persists, please report this to the module author!&r';
                        break;
                }
                break;
        }
        if (!error.chat) {
            error.chat = `&cAn unknown error occured while trying to request data from API! If this issue still persists, please report this to the module author! (${error.code ?? 'Unknown'})&r`;
            error.noConsole = false;
        }
    } else if (error.isAxiosError === false) {
        let exception = error.message.match(/^org.mozilla.javascript.WrappedException: Wrapped java.net.(ConnectException|UnknownHostException|SocketTimeoutException)/);
        if (exception.length > 0 && ['ConnectException', 'UnknownHostException', 'SocketTimeoutException']) {
            error.chat = '&cCan\'t connect to the API! Please check your internet connection! If this issue still persists, please report this to the module author!&r';
        }
    }
    let name = 'unknown';
    if (mode === 'run command') {
        name = data.name;
        errorMsg = ` while trying to run ${data.registeredName} command`;
    } else if (mode === 'load file') {
        name = data.getName().toString();
        errorMsg = ` while trying to load ${name.replace(/\./g, '.&c')} command file`;
    }
    if (!error.noConsole) {
        console.log(`[SBEC] ${mode} ${name} error: ${JSON.stringify(error, null, 2)}`);
    }
    sendSingleLineChat(error.chat ?? `&cAn unknown error occured${errorMsg}. If this issue still persists, please report this to the module author!&r`, error.linebreak, !error.linebreak);
}
