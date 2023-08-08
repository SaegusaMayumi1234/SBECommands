import { getProfile } from '../Modules/APIWrapper/Route';
import { errorRead, addNotation, toTitleCase } from '../Utils/Utils';
import { uniquePets } from '../Constants/pet'

let customCommandName = 'sbpets';

module.exports = {
    name: 'sbpets',
    execute(args) {
        let name = args[0] == undefined ? Player.getName() : args[0];
        let profileArg = args[1] == undefined ? "last save" : args[1];
        getProfile(name, profileArg).then(data => {
            if (data.error) {
                errorRead(data.text);
                return;
            }
            let chat = [];
            chat.push(new Message().addTextComponent(new TextComponent("&bPet data for: " + data.formatedName + "&r")))
            if ((data.raw.members[data.uuid].pets || []).length == 0) {
                chat.push(new Message().addTextComponent(new TextComponent("&cNo pets")))
            }
            Object.keys(data.pets.rarity).forEach(rarity => {
                let rarityPetsLength = data.pets.rarity[rarity].length;
                for (let i = 0; i < rarityPetsLength; i++) {
                    if (data.pets.rarity[rarity][i].heldItem !== null) {
                        chat.push(new Message().addTextComponent(new TextComponent(`&c**${data.pets.rarity[rarity][i].nameDisplay}`).setHover("show_text", `&bHeld Item: ${data.pets.rarity[rarity][i].heldItemDisplay}`)))
                    } else {
                        chat.push(new Message().addTextComponent(new TextComponent(`&b- ${data.pets.rarity[rarity][i].nameDisplay}`)))
                    }
                }
            })
            chat.push(new Message().addTextComponent(new TextComponent(`&7Pet Score: &f${data.pets.pet_score} &b(+${data.pets.magic_finds} MF)&r`)))
            chat.push(new Message().addTextComponent(new TextComponent(`&7Unique Pets: &f${data.pets.unique.length} / ${uniquePets}&r`)))
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
