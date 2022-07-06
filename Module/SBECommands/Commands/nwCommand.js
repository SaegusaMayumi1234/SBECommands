import { nwSequence } from '../Constants/sequence';
import { getProfile, postNetworthData } from '../Modules/APIWrapper/Route';
import { errorRead, addNotation, toTitleCase, fixUnicode } from '../Utils/Utils';

let customCommandName = 'nw';

module.exports = {
    name: 'nw',
    execute(args) {
        let name = args[0] == undefined ? Player.getName() : args[0];
        let profileArg = args[1] == undefined ? "last save" : args[1];
        getProfile(name, profileArg).then(data => {
            if (data.error) {
                errorRead(data.text);
                return;
            }
            if (data.raw.members[data.uuid].inv_contents === undefined) {
                ChatLib.chat("&c&m--------------------&r");
                ChatLib.chat(`${data.formatedName} &cHas inventory API disabled in profile '${data.profile}'! UUID: ${data.uuid}&r`);
                ChatLib.chat("&c&m--------------------&r");
                return;
            }
            let memberData = data.raw.members[data.uuid];
            if (data.raw.banking !== undefined) {
                memberData.banking = data.raw.banking;
            }
            ChatLib.chat(`&3[SBEC] &aAttempting to search for ${data.name}'s networth.&r`);
            postNetworthData(memberData).then(data2 => {
                if (data2.error) {
                    errorRead(data2.text);
                    return;
                }
                let chat = []
                chat.push(new Message().addTextComponent(new TextComponent(`${data.formatedName} &c's Networth:&r`)));
                chat.push(new Message().addTextComponent(new TextComponent(`&d ⦾ &6$${addNotation('commas', (data2.data.networth || 0))}`)));
                chat.push(new Message().addTextComponent(new TextComponent(`&r`)));
                chat.push(
                    new Message()
                    .addTextComponent(new TextComponent(`&a | &bCoins: &6${addNotation("oneLetters", (data2.data.purse || 0) + (data2.data.bank || 0))}&r`))
                    .addTextComponent(new TextComponent(` - &7(Details)&r`).setHover('show_text', `&bPurse: &6${addNotation("commas", (data2.data.purse || 0))}\n&bBank: &6${addNotation("commas", (data2.data.bank || 0))}`))
                );
                nwSequence.forEach(place => {
                    if (data2.data.categories[place] !== undefined) {
                        chat.push(
                            new Message()
                            .addTextComponent(new TextComponent(`&d | &b${toTitleCase(place.replace(/_/g, ' '))}: &6${addNotation("oneLetters", data2.data.categories[place].total)}&r`))
                            .addTextComponent(new TextComponent(` - &7(Details)&r`).setHover('show_text', nwDetails(data2, place)))
                        );
                    }
                })
                chat.push(new Message().addTextComponent(new TextComponent("&aPowered by &5Maro&a API&r")));

                ChatLib.chat("&c&m--------------------&r");
                chat.forEach(msg => {
                    msg.chat();
                });
                ChatLib.chat("&c&m--------------------&r");
            }).catch(error => {
                ChatLib.chat(`&3[SBEC] &cUnknown error occured while trying to run ${customCommandName}! If this issue still presist report this to module author!`)
            });
        }).catch(error => {
            ChatLib.chat(`&3[SBEC] &cUnknown error occured while trying to run ${customCommandName}! If this issue still presist report this to module author!`)
        });

    },
    inject(name) {
        customCommandName = name;
    }
}

function nwDetails(data2, place) {
    let hoverMsg = [];
    for (let i = 0; i < 16; i++) {
        if (data2.data.categories[place].top_items[i] !== undefined) {
            let name = data2.data.categories[place].top_items[i].display;
            name = fixUnicode(name) //.replace(/âœª/g, "&6✪").replace(/â�Ÿ/g, "&c✪").replace(/âšš/g, "⚚")
            if (place === 'pets') {
                name = `&7${name.replace("Common ", "&fCommon ").replace("Uncommon ", "&aUncommon ").replace("Rare ", "&9Rare ").replace("Epic ", "&5Epic ").replace("Legendary ", "&6Legendary ").replace("Mythic ", "&dMythic ").trim()}`;
            }
            hoverMsg.push((data2.data.categories[place].top_items[i].count > 1 ? "&7" + data2.data.categories[place].top_items[i].count + "x&r " : "") + name + ` &b- ${addNotation("oneLetters", data2.data.categories[place].top_items[i].price)}`)
        }
    }
    return hoverMsg.join('\n&r')
}