/// <reference types="../CTAutocomplete" />
/// <reference lib="es2015" />

import Settings from './utils/config';
import Changelog from '../ChangelogLib';
import { getAllPlayers } from './utils/utils';
import { sendErrorChatWithLog, sendMultiLineChat, sendSingleLineChat } from './utils/chatHandler';
import {
    noTabCompletionCommand,
    calcCommand,
    miscCommand,
    noProfileRequiredCommand,
    profileName,
    rarity,
    pcheckMode,
} from './constants/autoTabCompletion';
import { directories_location, files_location } from './constants/oldFiles';
import { changelogs } from './constants/changelogs';
import { injectGlobalCommands } from './utils/commandUtils';

const File = Java.type('java.io.File');

const uuidRegex = /^([0-9a-f]{8})(?:-|)([0-9a-f]{4})(?:-|)(4[0-9a-f]{3})(?:-|)([0-9a-f]{4})(?:-|)([0-9a-f]{12})$/i;

function getCommandTabCompletion(args, commandName) {
    let tabCompletion = [];
    let argsNumber = 0;
    if (noTabCompletionCommand.includes(commandName)) {
        tabCompletion = [];
    } else if (calcCommand.includes(commandName)) {
        if (args.length === 1) {
            tabCompletion = rarity;
        }
    } else if (miscCommand.includes(commandName)) {
        tabCompletion = pcheckMode;
    } else {
        if (args.length === 1) {
            tabCompletion = getAllPlayers()
                .filter((p) => uuidRegex.test(p.getUUID().toString()))
                .map((p) => p.getName());
        } else if (args.length === 2 && !noProfileRequiredCommand.includes(commandName)) {
            tabCompletion = profileName;
            argsNumber = 1;
        }
    }
    return tabCompletion
        .filter((n) => n.toLowerCase().startsWith((args[argsNumber] ?? '').toLowerCase()))
        .sort();
}

function init() {
    // Writing changelogs (The most epic changelogs)
    const metadata = JSON.parse(FileLib.read('SBECommands', 'metadata.json'));
    let oldVersion;
    if (FileLib.exists(`${Config.modulesFolder}/SBECommands/changelogs.json`)) {
        let installedVersions = Object.keys(JSON.parse(FileLib.read('SBECommands', 'changelogs.json')));
        oldVersion = installedVersions[installedVersions.length - 1];
    }
    let changelogsData = {};
    if (oldVersion && oldVersion !== metadata.version) {
        const parsedOldVersion = oldVersion.split('.').map((value) => parseInt(value));
        for (let version of Object.keys(changelogs)) {
            let parsedVersion = version.split('.').map((value) => parseInt(value));
            for (let i = 0; i < parsedVersion.length; i++) {
                if (parsedVersion[i] > parsedOldVersion[i]) {
                    changelogsData[version] = changelogs[version];
                    break;
                }
                if (parsedVersion[i] < parsedOldVersion[i]) break;
            }
        }
    } else if (!oldVersion && changelogs[metadata.version]) {
        changelogsData[metadata.version] = changelogs[metadata.version];
    }
    if (Object.values(changelogsData).length !== 0) {
        const chat = [];
        chat.push(`&c&m${ChatLib.getChatBreak(' ')}&r`);
        chat.push(ChatLib.getCenteredText(`&3&l&nSBECommands V${metadata.version}&r`));
        chat.push('&r');
        if (!oldVersion) {
            chat.push(ChatLib.getCenteredText('&aThank you for installing SBECommands!&r'));
            chat.push(ChatLib.getCenteredText('&aBy &bIcarusPhantom &c❤&r'));
            chat.push('&r');
            chat.push(ChatLib.getCenteredText('&eStarter Commands:&r'));
            chat.push(ChatLib.getCenteredText('&e/sbec, /sbecsettings, /sbecauthor&r'));
        } else {
            chat.push(ChatLib.getCenteredText('&aSBECommands has been updated!'));
            chat.push(ChatLib.getCenteredText('&aBy &bIcarusPhantom &c❤&r'));
            chat.push(ChatLib.getCenteredText(`&e${oldVersion} ➜ ${metadata.version}`));
            chat.push('&r');
            chat.push('&aChangelogs &7(Hover for details)&r');
            Object.keys(changelogsData).forEach((version) => {
                let versionHover = [];
                changelogsData[version].forEach(data => {
                    versionHover.push(`&b- ${data}&r`);
                });
                chat.push(new TextComponent(`&e > ${version}&r`).setHoverAction('show_text').setHoverValue(versionHover.join('\n')));
            });
        }
        chat.push('&r');
        chat.push(new TextComponent(ChatLib.getCenteredText('&6Click here to report bugs or make suggestions!&r')).setClickAction('run_command').setClickValue('/sbecauthor'));
        chat.push(`&c&m${ChatLib.getChatBreak(' ')}&r`);
        sendMultiLineChat(chat, false);
    }
    const changelog = new Changelog('SBECommands', metadata.version, 'See your chat for more information!');
    changelog.writeChangelog({name: '&3&l&n', version: '&e', changelog: '&a'});
    
    // Deleting old files
    for (let file of files_location) {
        if (FileLib.exists(`${Config.modulesFolder}/SBECommands/${file}`)) {
            FileLib.delete(`${Config.modulesFolder}/SBECommands/${file}`);
        }
    }
    for (let directory of directories_location) {
        if (FileLib.exists(`${Config.modulesFolder}/SBECommands/${directory}`)) {
            FileLib.deleteDirectory(`${Config.modulesFolder}/SBECommands/${directory}`);
        }
    }
    
    // Registering commands
    const globalCommands = {};
    const commandsFile = new File(
        `${Config.modulesFolder}/SBECommands/commands`
    )
        .listFiles()
        .filter((file) => file.isFile() && file.getName().endsWith('.js'));
    for (let file of commandsFile) {
        try {
            let command = require(`./commands/${file.getName()}`);
            command.registeredName = command.name;
            let customCommandName = (Settings[`custom${command.name}`] ?? '').trim();
            if (customCommandName !== '') {
                if (/^([a-z]|[0-9])+$/g.test(customCommandName)) {
                    command.registeredName = customCommandName;
                } else {
                    sendSingleLineChat(`&cCan't use '${customCommandName}' to replace ${command.name} command name since its not a valid command name! Fallback to use default command name. (only lowercase alphabet and number without space are allowed)`, false, true);
                }
            }
            command.enabled = typeof Settings[command.name] !== 'boolean' || Settings[command.name];
            if (command.enabled) {
                register('command', (...args) => {
                    try {
                        command.execute(args ?? []);
                    } catch (error) {
                        sendErrorChatWithLog(error, 'run command', command);
                    }
                })
                    .setTabCompletions((args) => getCommandTabCompletion(args, command.name))
                    .setName(command.registeredName, true);
            }
            globalCommands[command.name] = command;
        } catch (error) {
            sendErrorChatWithLog(error, 'load file', file);
        }
    }
    injectGlobalCommands(globalCommands);
}

if (World.isLoaded()) {
    init();
} else {
    const onWorldLoad = register('worldLoad', () => {
        init();
        onWorldLoad.unregister();
    });
}