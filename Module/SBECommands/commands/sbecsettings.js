import Settings from '../utils/config';

module.exports = {
    name: 'sbecsettings',
    description: 'Opens SBEC Settings GUI.',
    usage: '',
    execute(args) {
        Settings.openGUI();
    },
};
