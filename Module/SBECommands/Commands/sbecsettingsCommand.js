import Settings from '../ConfigData/config';

let customCommandName = 'sbecsettings';

module.exports = {
    name: 'sbecsettings',
    execute(args) {
        Settings.openGUI();
    },
    inject(name) {
        customCommandName = name;
    }
}
