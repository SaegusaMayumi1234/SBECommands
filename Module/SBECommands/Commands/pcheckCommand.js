import { getProfile } from '../Modules/APIWrapper/Route';
import { errorRead, addNotation, toTitleCase, fixUnicode, timestampToTime, decodeNBTData } from '../Utils/Utils';
import Settings from '../ConfigData/config';

let customCommandName = 'pcheck';
let checkingParty = false;
let partyMessage = false;
let lastMode = "dungeon";

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
    "BAT_WAND",
    "WITHER_CLOAK",
    "SPIRIT_MASK",
    "GYROKINETIC_WAND",
    "ICE_SPRAY_WAND",
    "RADIANT_POWER_ORB",
    "MANA_FLUX_POWER_ORB",
    "OVERFLUX_POWER_ORB",
    "PLASMAFLUX_POWER_ORB"
];

module.exports = {
    name: 'pcheck',
    execute(args) {
        lastMode = getMode(args);
        ChatLib.command("party list");
        checkingParty = true;
        setTimeout(() => {
            checkingParty = false;
        }, 1000);
    },
    inject(name) {
        customCommandName = name;
    }
}

register("chat", (message) => {
    if (!checkingParty) return;
    if (message.startsWith("Party Members (") && message.endsWith(")")) {
        if (parseInt(message) === 1) {
            ChatLib.chat(`&cParty is too small for a ${lastMode === "dungeon" ? "dungeon" : "kuudra"} party.`);
        } else if ((lastMode === "dungeon" && parseInt(message) > 5) || (lastMode === "kuudra" && parseInt(message) > 4)) {
            ChatLib.chat(`&cParty is too big for a ${lastMode === "dungeon" ? "dungeon" : "kuudra"} party.`);
        } else {
            partyMessage = true;
        }
    }
    if (message.startsWith("Party Leader: ") || message.startsWith("Party Moderators: ") || message.startsWith("Party Members: ")) {
        let members = message.replace("Party Leader: ", "").replace("Party Moderators: ", "").replace("Party Members: ", "").split("●").map(ele => ele.trim());
        members.forEach(member => {
            if (member !== "") {
                if (member.startsWith("[")) {
                    getData(member.split(" ")[1], "last save", "command");
                } else {
                    getData(member, "last save", "command");
                }
            }
        })
    }
    if (partyMessage && message === "-----------------------------------------------------") {
        partyMessage = false;
        checkingParty = false;
        ChatLib.chat("&3[SBEC] &aFinding party data");
    }
}).setCriteria("${message}");

register("chat", (name) => {
    lastMode = "dungeon";
    if (Settings.pfStats) {
        getData(name, "last save", "dungeon finder");
    }
}).setCriteria("Party Finder > ${name} joined the dungeon group! ${*}");

register("chat", (name) => {
    lastMode = "kuudra";
    if (Settings.pfStats) {
        getData(name, "last save", "kuudra finder");
    }
}).setCriteria("Party Finder > ${name} joined the group! ${*}");

register("guiRender", (mx, my, gui) => {
    if (Player.getPlayer() === null || Player.getContainer().getClassName() !== 'ContainerChest') return;
    if (Player.getContainer().getName() === "Select Tier") {
        lastMode = "kuudra";
    } else if (Player.getContainer().getName() === "Catacombs Gate") {
        lastMode = "dungeon";
    }
});

function getMode(args) {
    let mode = null;
    if (args[0] === "kuudra" || args[0] === "dungeon" || args[0] === "dungeons" || args[0] === "catacombs") {
        mode = args[0] === "kuudra" ? "kuudra" : "dungeon";
    } else {
        let scoreboard = Scoreboard.getLines().map(a => { return ChatLib.removeFormatting(a) });
        for (let line of scoreboard) {
            let matchDungeon = line.match(/ ⏣ The Catac.+ombs \((.+)\)/);
            let matchKuudra = line.match(/ ⏣ Kuudra's .+Hollow \((.+)\)/);
            if (matchDungeon) {
                mode = "dungeon";
            } else if (matchKuudra) {
                mode = "kuudra";
            }
        }
        if (mode === null) {
            mode = lastMode;
        }
    }
    return mode;
}

function getData(name, profileArg, method) {
    getProfile(name, profileArg).then(data => {
        if (data.error) {
            errorRead(data.text);
            return;
        }
        let chat = [];
        chat.push(new Message().addTextComponent(new TextComponent(` &bData For: ${data.formatedName}`)));
        chat.push(new Message().addTextComponent(new TextComponent(` &a✎ Avg Skill Level: &e${data.skills.average_skills.toFixed(2)}`)));
        if (lastMode === "dungeon") {
            chat.push(new Message().addTextComponent(new TextComponent(` &a☠ Cata Level: &e${(data.dungeons?.catacombs?.skill?.level || 0).toFixed(2)}`)));
            chat.push(new Message().addTextComponent(new TextComponent(` &aTotal Secrets Found: &e${addNotation("commas", data.dungeons?.secrets_found || 0)}`)));
        } else {
            chat.push(new Message().addTextComponent(new TextComponent(` &a⚔ Combat Level: &e${(data.skills?.combat?.level || 0).toFixed(2)}`)));
        }
        
        chat.push(new Message().addTextComponent(new TextComponent(`&r`)));

        const armor = decodeNBTData(data.raw.members[data.uuid].inv_armor.data);
        for (let i = 3; i >= 0; i--) {                                    
            let item = armor.items.func_150305_b(i); //NBTTagList.getCompoundTagAt()
            if (!item.func_82582_d()) { //NBTTagCompound.hasNoTags()
                let nbtTagItem = new NBTTagCompound(item).toObject();
                chat.push(new Message().addTextComponent(new TextComponent(` ${nbtTagItem.tag.display.Name}`).setHover("show_text", `${nbtTagItem.tag.display.Name}\n${nbtTagItem.tag.display.Lore.join('\n')}`)));
            } else {
                chat.push(new Message().addTextComponent(new TextComponent(" &aN/A")));
            }
        }

        if (data.raw.members[data.uuid].inv_contents) {
            const invContents = decodeNBTData(data.raw.members[data.uuid].inv_contents.data);
            for (let i = 0; i < invContents.length; i++) {                                    
                let item = invContents.items.func_150305_b(i); //NBTTagList.getCompoundTagAt()
                if (!item.func_82582_d()) { //NBTTagCompound.hasNoTags()
                    let nbtTagItem = new NBTTagCompound(item).toObject();
                    if (allowedWeaponID.includes(nbtTagItem?.tag?.ExtraAttributes?.id)) {
                        chat.push(new Message().addTextComponent(new TextComponent(` ${nbtTagItem.tag.display.Name}`).setHover("show_text", `${nbtTagItem.tag.display.Name}\n${nbtTagItem.tag.display.Lore.join('\n')}`)));
                    }
                }
            }
            if (Settings.deepScan) {
                if (data.raw.members[data.uuid].ender_chest_contents) {
                    const enderChestContents = decodeNBTData(data.raw.members[data.uuid].ender_chest_contents.data);
                    for (let i = 0; i < enderChestContents.length; i++) {                                    
                        let item = enderChestContents.items.func_150305_b(i); //NBTTagList.getCompoundTagAt()
                        if (!item.func_82582_d()) { //NBTTagCompound.hasNoTags()
                            let nbtTagItem = new NBTTagCompound(item).toObject();
                            if (allowedWeaponID.includes(nbtTagItem?.tag?.ExtraAttributes?.id)) {
                                chat.push(new Message().addTextComponent(new TextComponent(` ${nbtTagItem.tag.display.Name}`).setHover("show_text", `${nbtTagItem.tag.display.Name}\n${nbtTagItem.tag.display.Lore.join('\n')}`)));
                            }
                        }
                    }
                }
                if (data.raw.members[data.uuid].backpack_contents) {
                    const backpacksNum = Object.keys(data.raw.members[data.uuid].backpack_contents);
                    for (let i = 0; i < backpacksNum.length; i++) {
                        const backpackContents = decodeNBTData(data.raw.members[data.uuid].backpack_contents[backpacksNum[i]].data);
                        for (let i = 0; i < backpackContents.length; i++) {                                    
                            let item = backpackContents.items.func_150305_b(i); //NBTTagList.getCompoundTagAt()
                            if (!item.func_82582_d()) { //NBTTagCompound.hasNoTags()
                                let nbtTagItem = new NBTTagCompound(item).toObject();
                                if (allowedWeaponID.includes(nbtTagItem?.tag?.ExtraAttributes?.id)) {
                                    chat.push(new Message().addTextComponent(new TextComponent(` ${nbtTagItem.tag.display.Name}`).setHover("show_text", `${nbtTagItem.tag.display.Name}\n${nbtTagItem.tag.display.Lore.join('\n')}`)));
                                }
                            }
                        }
                    }
                }
            }
        } else {
            chat.push(new Message().addTextComponent(new TextComponent(` &dWeapons: &cInventory Api OFF`)));
        }
        if (lastMode === "dungeon") {
            if (data.pets.unique.some(ele => ele.type === "SPIRIT" && ele.tier === "LEGENDARY")) {
                chat.push(new Message().addTextComponent(new TextComponent(` &cSpirit Pet: &aYES`)));
            } else {
                chat.push(new Message().addTextComponent(new TextComponent(` &cSpirit Pet: NO`)));
            }
        }
        
        chat.push(new Message().addTextComponent(new TextComponent(`&r`)));
        if (lastMode === "dungeon") {
            chat.push(new Message().addTextComponent(new TextComponent(`&b Floor &bCompletions: &7(Hover)&r`).setHover("show_text", getDungeonCompletion(data.dungeons?.catacombs?.floors, "&cCompletions:"))));
            chat.push(new Message().addTextComponent(new TextComponent(`&b Fastest &6S+ &bCompletions: &7(Hover)&r`).setHover("show_text", getFastest(data.dungeons?.catacombs?.floors, "&cS+:", 's+'))));
            chat.push(new Message().addTextComponent(new TextComponent(`&4 MM &bFloor &bCompletions: &7(Hover)&r`).setHover("show_text", getDungeonCompletion(data.dungeons?.catacombs?.master_mode_floors, "&4Master &cCompletions:"))));
            chat.push(new Message().addTextComponent(new TextComponent(`&4 MM &bFastest &6S+ &bCompletions: &7(Hover)&r`).setHover("show_text", getFastest(data.dungeons?.catacombs?.master_mode_floors, "&cS+:", 's+'))));
        } else {
            chat.push(new Message().addTextComponent(new TextComponent(`&b Kuudra &bCompletions: &7(Hover)&r`).setHover("show_text", getKuudra(data.raw.members[data.uuid]?.nether_island_player_data?.kuudra_completed_tiers, "&cCompletions:", "completion"))));
            chat.push(new Message().addTextComponent(new TextComponent(`&b Kuudra &bHighest Wave: &7(Hover)&r`).setHover("show_text", getKuudra(data.raw.members[data.uuid]?.nether_island_player_data?.kuudra_completed_tiers, "&cHighest wave:", "highest wave"))));
        }

        ChatLib.chat("&c&m--------------------&r");
        chat.forEach(msg => {
            msg.chat();
        });
        ChatLib.chat("&c&m--------------------&r");
        if (method === "dungeon finder" || method === "kuudra finder") {
            new Message().addTextComponent(new TextComponent(`&aClick here to remove &d${name} &afrom the party!`).setClickAction("run_command").setClickValue("/p remove " + name)).chat();
        }
        if (method === "command") {
            new Message().addTextComponent(new TextComponent(`&aWrong mode? Try running &e/pcheck ${lastMode === "dungeon" ? "kuudra" : "dungeon"} &ato override automatic mode detection!`)).chat();
        }

    }).catch(error => {
        ChatLib.chat(`&3[SBEC] &cUnknown error occured while trying to run ${customCommandName}! If this issue still presist report this to module author!`);
        console.log(JSON.stringify(error));
    });
}

function getDungeonCompletion(floors, innit) {
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

function getKuudra(kuudra, innit, method) {
    let hoverMsg = innit;
    let nameArray = ["none", "hot", "burning", "fiery", "infernal"];
    nameArray.forEach(name => {
        if (method === "completion") {
            hoverMsg += `\n&e${name === "none" ? "basic" : name}: &a${kuudra?.[name] || 0}`;
        } else {
            let wavesName = `highest_wave_${name}`;
            hoverMsg += `\n&e${name === "none" ? "basic" : name}: &a${kuudra?.[wavesName] || 0}`;
        }
    })
    return hoverMsg;
}
