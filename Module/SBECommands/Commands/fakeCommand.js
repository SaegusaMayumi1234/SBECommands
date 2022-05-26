let customCommandName = 'fake';

module.exports = {
    name: 'fake',
    execute(args) {
        ChatLib.chat(args.join(' '));
    },
    inject(name) {
        customCommandName = name;
    }
}