import { getProfile } from '../Modules/APIWrapper/Route';
import { errorRead, addNotation, toTitleCase, fixUnicode, timestampToTime } from '../Utils/Utils';
import Settings from '../ConfigData/config';

let customCommandName = 'pcheck';
let checkingParty = false
let partyMessage = false

const allowedWeaponID = [
    "TERMINATOR",
    "HYPERION",
    "ASTRAEA",
    "VALKYRIE",
    "SCYLLA",
    "LIVID_DAGGER",
    "FLOWER_OF_TRUTH",
    "JUJU_SHORTBOW",
    "DARK_CLAYMORE",
    "GIANTS_SWORD",
    "BONE_BOOMERANG",
    "MIDAS_STAFF",
    "BAT_WAND"
]

module.exports = {
    name: 'pcheck',
    execute(args) {
        ChatLib.command("party list")
        checkingParty = true
        setTimeout(() => {
            checkingParty = false
        }, 1000)
    },
    inject(name) {
        customCommandName = name;
    }
}

register("chat", (message) => {
    if (!checkingParty) return
    if (message.startsWith("Party Members (") && message.endsWith(")")) {
        if (parseInt(message) === 1) {
            ChatLib.chat("&cParty is too small for a dungeons party.")
        } else if (parseInt(message) > 5) {
            ChatLib.chat("&cParty is too big for a dungeons party.")
        } else {
            partyMessage = true
        }
    }
    if (message.startsWith("Party Leader: ") || message.startsWith("Party Moderators: ") || message.startsWith("Party Members: ")) {
        let members = message.replace("Party Leader: ", "").replace("Party Moderators: ", "").replace("Party Members: ", "").split("●").map(ele => ele.trim());
        members.forEach(member => {
            if (member !== "") {
                if (member.startsWith("[")) {
                    getData(member.split(" ")[1], "last save", "command")
                } else {
                    getData(member, "last save", "command")
                }
            }
        })
    }
    if (partyMessage && message === "-----------------------------------------------------") {
        partyMessage = false
        checkingParty = false
        ChatLib.chat("&3[SBEC] &aFinding party data")
    }
}).setCriteria("${message}")

register("chat", (name) => {
    if (Settings.pfStats) {
        getData(name, "last save", "party finder")
    }
}).setCriteria("Dungeon Finder > ${name} joined the dungeon group! ${*}")

function getData(name, profileArg, method) {
    getProfile(name, profileArg).then(data => {
        if (data.error) {
            errorRead(data.text);
            return;
        }
        let chat = []
        chat.push(new Message().addTextComponent(new TextComponent(` &bData For: ${data.formatedName}`)))
        chat.push(new Message().addTextComponent(new TextComponent(` &a✎ Avg Skill Level: &e${data.skills.average_skills.toFixed(2)}`)))
        chat.push(new Message().addTextComponent(new TextComponent(` &a☠ Cata Level: &e${(data.dungeons?.catacombs?.skill?.level || 0).toFixed(2)}`)))
        chat.push(new Message().addTextComponent(new TextComponent(` &aTotal Secrets Found: &e${addNotation("commas", data.dungeons?.secrets_found || 0)}`)))
        chat.push(new Message().addTextComponent(new TextComponent(`&r`)))

        let invArmorContents = data.raw.members[data.uuid].inv_armor.data;
        let bytearray2 = java.util.Base64.getDecoder().decode(invArmorContents);
        let inputstream2 = new java.io.ByteArrayInputStream(bytearray2);                                
        let nbt2 = net.minecraft.nbt.CompressedStreamTools.func_74796_a(inputstream2); //CompressedStreamTools.readCompressed()                            
        let items2 = nbt2.func_150295_c("i", 10); //NBTTagCompound.getTagList()
        // let length2 = items2.func_74745_c(); //NBTTagList.tagCount()
        
        for (let i = 3; i >= 0; i--) {                                    
            let item = items2.func_150305_b(i); //NBTTagList.getCompoundTagAt()
            if (!item.func_82582_d()) { //NBTTagCompound.hasNoTags()
                let nbtTagItem = new NBTTagCompound(item).toObject()
                chat.push(new Message().addTextComponent(new TextComponent(` ${nbtTagItem.tag.display.Name}`).setHover("show_text", `${nbtTagItem.tag.display.Name}\n${nbtTagItem.tag.display.Lore.join('\n')}`)))
            } else {
                chat.push(new Message().addTextComponent(new TextComponent(" &aN/A")))
            }
        }

        if (data.raw.members[data.uuid].inv_contents) {
            let invContents = data.raw.members[data.uuid].inv_contents.data;
            let bytearray = java.util.Base64.getDecoder().decode(invContents);
            let inputstream = new java.io.ByteArrayInputStream(bytearray);                                
            let nbt = net.minecraft.nbt.CompressedStreamTools.func_74796_a(inputstream); //CompressedStreamTools.readCompressed()                            
            let items = nbt.func_150295_c("i", 10); //NBTTagCompound.getTagList()
            let length = items.func_74745_c(); //NBTTagList.tagCount()

            for (let i = 0; i < length; i++) {                                    
                let item = items.func_150305_b(i); //NBTTagList.getCompoundTagAt()
                if(!item.func_82582_d()) { //NBTTagCompound.hasNoTags()
                    let nbtTagItem = new NBTTagCompound(item).toObject()
                    if (allowedWeaponID.includes(nbtTagItem.tag.ExtraAttributes.id)) {
                        chat.push(new Message().addTextComponent(new TextComponent(` ${nbtTagItem.tag.display.Name}`).setHover("show_text", `${nbtTagItem.tag.display.Name}\n${nbtTagItem.tag.display.Lore.join('\n')}`)))
                    }
                }
            }
        } else {
            chat.push(new Message().addTextComponent(new TextComponent(` &dWeapons: &cInventory Api OFF`)))
        }

        if (data.pets.unique.some(ele => ele.type === "SPIRIT" && ele.tier === "LEGENDARY")) {
            chat.push(new Message().addTextComponent(new TextComponent(` &cSpirit Pet: &aYES`)))
        } else {
            chat.push(new Message().addTextComponent(new TextComponent(` &cSpirit Pet: NO`)))
        }

        chat.push(new Message().addTextComponent(new TextComponent(`&r`)))
        chat.push(new Message().addTextComponent(new TextComponent(`&b Floor &bCompletions: &7(Hover)&r`).setHover("show_text", getHoverCompletion(data.dungeons?.catacombs?.floors, "&cCompletions:"))));
        chat.push(new Message().addTextComponent(new TextComponent(`&b Fastest &6S+ &bCompletions: &7(Hover)&r`).setHover("show_text", getFastest(data.dungeons?.catacombs?.floors, "&cS+:", 's+'))));
        chat.push(new Message().addTextComponent(new TextComponent(`&4 MM &bFloor &bCompletions: &7(Hover)&r`).setHover("show_text", getHoverCompletion(data.dungeons?.catacombs?.master_mode_floors, "&4Master &cCompletions:"))));
        chat.push(new Message().addTextComponent(new TextComponent(`&4 MM &bFastest &6S+ &bCompletions: &7(Hover)&r`).setHover("show_text", getFastest(data.dungeons?.catacombs?.master_mode_floors, "&cS+:", 's+'))));

        ChatLib.chat("&c&m--------------------&r");
        chat.forEach(msg => {
            msg.chat();
        });
        ChatLib.chat("&c&m--------------------&r");
        if (method === "party finder") {
            new Message().addTextComponent(new TextComponent(`&aClick here to remove &d${name} &afrom the party!`).setClickAction("run_command").setClickValue("/p remove " + name)).chat()
        }

    }).catch(error => {
        ChatLib.chat(`&3[SBEC] &cUnknown error occured while trying to run ${customCommandName}! If this issue still presist report this to module author!`)
    });
}

function getHoverCompletion(floors, innit) {
    let hoverMsg = innit;
    let numArray = ["1", "2", "3", "4", "5", "6", "7"];
    numArray.forEach(num => {
        let completions = floors?.[`floor_${num}`]?.completions || 0;
        hoverMsg += `\n&e${num}] &a${completions}`;
    });
    return hoverMsg;
}

function getFastest(floors, innit, mode) {
    let hoverMsg = innit;
    let numArray = ["1", "2", "3", "4", "5", "6", "7"];
    numArray.forEach(num => {
        let fastestTime;
        if (mode === 's') {
            fastestTime =  timestampToTime(floors?.[`floor_${num}`]?.fastest_s || null);
        } else if (mode === 's+') {
            fastestTime =  timestampToTime(floors?.[`floor_${num}`]?.fastest_s_plus || null);
        }
        hoverMsg += `\n&e${num}] &a${fastestTime}`;
    });
    return hoverMsg;
}