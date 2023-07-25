let customCommandName = 'sbecauthor';

module.exports = {
    name: 'sbecauthor',
    execute(args) {
        const metadata = JSON.parse(FileLib.read('SBECommands', 'metadata.json'));
        ChatLib.chat('&b&m--------------------&r');
        ChatLib.chat(`&aName: &3${metadata.name}`);
        ChatLib.chat(`&aVersion: &e${metadata.version}`);
        ChatLib.chat(`&aDescription: &e${metadata.description}`);
        ChatLib.chat(`&bAuthor: &b${metadata.author} &e(IcarusPhantom#9084)`);
        new Message().addTextComponent(new TextComponent(`&bGitHub: `)).addTextComponent(new TextComponent(`&6&llink`).setClick('open_url', 'https://github.com/SaegusaMayumi1234/SBECommands')).chat();
        ChatLib.chat('&b&m--------------------&r');
    },
    inject(name) {
        customCommandName = name;
    }
}