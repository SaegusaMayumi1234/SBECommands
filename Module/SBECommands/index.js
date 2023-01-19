/// <reference types="../CTAutocomplete" />
/// <reference lib="es2015" />

import Settings from './ConfigData/config';
import Changelog from '../ChangelogLib';
import {
    noTabCompletionCommand,
    calcCommand,
    miscCommand,
    noProfileRequiredCommand,
    profileName,
    rarity,
    pcheckMode,
} from './Constants/tabCompletionConst';
import { getAllPlayers } from './Utils/Utils';

const File = Java.type('java.io.File');

const featuresFile = new File('./config/ChatTriggers/modules/SBECommands/Commands').listFiles().filter(file => file.isFile() && file.getName().endsWith('.js'));
let helpCommand = null;
const errorCommand = [];
let registered = false;
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
            tabCompletion = getAllPlayers().filter((p) => uuidRegex.test(p.getUUID().toString())).map((p) => p.getName());
        } else if (args.length === 2 && !noProfileRequiredCommand.includes(commandName)) {
            tabCompletion = profileName;
            argsNumber = 1;
        }
    }
    return tabCompletion.filter((n) => n.toLowerCase().startsWith((args[argsNumber] || '').toLowerCase())).sort();
}

register('gameLoad', () => {
    if (registered) return;
    registerCommand();
});

const onRenderWorld = register('renderWorld', () => {
    if (registered) {
        onRenderWorld.unregister();
        return;
    }
    registerCommand();
});

function registerCommand() {
    registered = true;
    for (const file of featuresFile) {
        let commandName = '';
        try {
            const command = require(`./Commands/${file.getName()}`);
            if (file.getName() === 'sbecCommand.js') {
                helpCommand = command;
            }
            let allowed = true;
            if (Settings[command.name] !== undefined && !Settings[command.name]) {
                allowed = false;
            }
            if (Settings[`custom${command.name}`] === '' || !Settings[`custom${command.name}`]) {
                commandName = command.name;
            } else {
                commandName = Settings[`custom${command.name}`];
                command.inject(commandName);
            }
            if (commandName.includes(' ') || commandName !== commandName.toLowerCase()) {
                ChatLib.chat(`&3[SBEC] &cError while loading command: ${file.getName()} (${commandName}) (custom command should not include uppercase or space)`);
                allowed = false;
            }
            if (allowed) {
                register('command', (...args) => {
                    command.execute(args);
                }).setTabCompletions((args) => getCommandTabCompletion(args, command.name))
                .setName(commandName, true);
            } else {
                errorCommand.push(command.name);
            }
        } catch(error) {
            ChatLib.chat(`&3[SBEC] &cError while loading command: ${file.getName()} (Report this to modules creator!)`);
            console.log(`[SBEC] Error while loading command: ${error.message}`);
            errorCommand.push(file.getName().replace('Command.js', ''));
        }
    }
    errorCommand.forEach(commandName => {
        helpCommand.injectDisabled(commandName, false);
    });
}

const changelogMessage = [
    '&b - Added tab auto completion for commands!',
    '&b - Added sb level to player command!',
    '&b - Added crimson command!',
    '&b - Code consistency part 1!'
];

const changelog = new Changelog('SBECommands', '1.1.9', changelogMessage.join('\n'));
changelog.writeChangelog({name: '&3&l&n', version: '&e', changelog: '&a'});

// changed:
/**
 * index.js
 * Utils/Utils.js
 * Constants/tabCompletionConst.js
 * Commands/sbecCommand.js
 * Commands/playerCommand.js
 * Commands/cataCommand.js
 * Constants/sequence.js
 * Commands/pcheckCommand.js
 * Commands/crimsonCommand.js
 */