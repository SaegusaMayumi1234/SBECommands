import { save } from '../Modules/PresistentData';
import { getApiKeyStatus } from '../Modules/APIWrapper/Route';
import { errorRead } from '../Utils/Utils';

let customCommandName = 'sbecsetkey';

module.exports = {
    name: 'sbecsetkey',
    execute(args) {
        if (args[0] == undefined) {
            ChatLib.chat("&3[SBEC] &a&cImproper Usage. /sbecsetkey [key]&r");
            return;
        }
        if (args[0].length != 36) {
            ChatLib.chat("&3[SBEC] &a&cInvalid API Key. Please insert your valid Hypixel API Key&r");
            return;
        }
        getApiKeyStatus(args[0]).then(data => {
            if (data.error) {
                errorRead(data.text);
                return;
            }
            save("apikey", args[0]);
            ChatLib.chat("&3[SBEC] &aThe Hypixel API key has been saved!&r");
        })
    },
    inject(name) {
        customCommandName = name;
    }
}

register("chat",(apikey)=>{
	ChatLib.chat("&3[SBEC] &aThe Hypixel API key has been saved!&r");
	save("apikey", apikey);
}).setChatCriteria("&aYour new API key is &r&b${apikey}&r");
