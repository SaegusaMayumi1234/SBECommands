/// <reference types="../CTAutocomplete" />
/// <reference lib="es2015" />

import Settings from "./ConfigData/config";
import Changelog from "../ChangelogLib";

const File = Java.type("java.io.File");

const featuresFile = new File("./config/ChatTriggers/modules/SBECommands/Commands").listFiles().filter(file => file.isFile() && file.getName().endsWith(".js"));
let helpCommand = null;
const errorCommand = [];
let registered = false;

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
            const command = require("./Commands/" + file.getName());
            if (file.getName() === 'sbecCommand.js') {
                helpCommand = command;
            }
            let allowed = true;
            if (Settings[command.name] !== undefined && !Settings[command.name]) {
                allowed = false;
            }
            if (Settings['custom' + command.name] == '' || Settings['custom' + command.name] == null) {
                commandName = command.name;
            } else {
                commandName = Settings['custom' + command.name];
                command.inject(commandName);
            }
            if (commandName.includes(' ') || commandName !== commandName.toLowerCase()) {
                ChatLib.chat(`&3[SBEC] &cError while loading command: ${file.getName()} (${commandName}) (custom command should not include uppercase or space)`);
                allowed = false;
            }
            if (allowed) {
                register('command', (...args) => {
                    command.execute(args);
                }).setName(commandName, true);
            } else {
                errorCommand.push(command.name);
            }
        } catch(error) {
            ChatLib.chat(`&3[SBEC] &cError while loading command: ${file.getName()} (Report this to modules creator!)`);
            console.log("[SBEC] Error while loading command: " + error.message);
            errorCommand.push(file.getName().replace('Command.js', ''));
        }
    }
    errorCommand.forEach(commandName => {
        helpCommand.injectDisabled(commandName, false);
    });
}

const changelogMessage = [
    "&b - Fixed pcheck error when no item id!",
    "&b - Fixed error when no selected profile!",
    "&b - Fixed error when aschon return error other than 429",
];

const changelog = new Changelog("SBECommands", "1.1.8", changelogMessage.join('\n'));
changelog.writeChangelog({name: "&3&l&n", version: "&e", changelog: "&a"});