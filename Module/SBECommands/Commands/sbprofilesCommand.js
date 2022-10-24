import { getProfile } from "../Modules/APIWrapper/Route";
import { errorRead, humanizeTime, timestampToDate } from "../Utils/Utils";

let customCommandName = 'sbprofiles';

module.exports = {
    name: 'sbprofiles',
    execute(args) {
        let name = args[0] == undefined ? Player.getName() : args[0];
        getProfile(name, 'last save', 'all').then(data => {
            if (data.error) {
                errorRead(data.text);
                return;
            }
            let chat = [];
            chat.push(new Message().addTextComponent(new TextComponent(`&bProfiles for: ${data.formatedName}&r`)));
            chat.push(new Message().addTextComponent(new TextComponent(`&r`)))
            data.raw.profiles.forEach(profile => {
                chat.push(new Message().addTextComponent(new TextComponent(`&b${profile.cute_name}: ${profile.selected ? '&aSelected' : '&cNot Selected'}&r`)));
            })
            ChatLib.chat("&c&m--------------------&r")
            chat.forEach(msg => {
                msg.chat()
            })
            ChatLib.chat("&c&m--------------------&r")
        }).catch(error => {
            ChatLib.chat(`&3[SBEC] &cUnknown error occured while trying to run ${customCommandName}! If this issue still presist report this to module author!`)
        });
        
    },
    inject(name) {
        customCommandName = name;
    }
}
