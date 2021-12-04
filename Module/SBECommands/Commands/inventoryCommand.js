import { errorHypixelAPI, errorMojangAPI } from "../Modules/errorHandler"
import { getHypixelPlayer, getMojang, getSkyblockData } from "../Modules/requestHandler"
import { formatRank } from "../Utils/formatRank"

const Minecraft = Client.getMinecraft();

//const ItemClass = Java.type("net.minecraft.item.Item");
const ItemStack = Java.type("net.minecraft.item.ItemStack");
const InventoryBasic = Java.type("net.minecraft.inventory.InventoryBasic");
const GuiChest = Java.type("net.minecraft.client.gui.inventory.GuiChest");

let lastInv = null
let invToOpen = null

function run(args) {
    let name = args[0] == undefined ? Player.getName() : args[0]
    let profileArg = args[1] == undefined ? "last_save" : args[1]
    getMojang(name).then(mojang => {
        ChatLib.chat(`&3[SBEC] &aFinding inventory for ${mojang.body.name}`)
        getSkyblockData(mojang.body.id).then(skyblockHy => {
            if (skyblockHy.body.profiles == null) {
                noProfile(mojang.body.id, mojang.body.name)
            } else {
                if (profileArg === "last_save") {
                    let profiles = skyblockHy.body.profiles.sort((a, b) => b.members[mojang.body.id].last_save - a.members[mojang.body.id].last_save)
                    let profileMatched = profiles[0]
                    matchProfile(mojang.body.id, profileMatched)
                } else {
                    let profiles = skyblockHy.body.profiles
                    let profileMatched = null
                    profiles.forEach(profile => {
                        if (profile.cute_name.toLowerCase() == profileArg.toLowerCase()) {
                            profileMatched = profile
                        }
                    })
                    if (profileMatched != null) {
                        matchProfile(mojang.body.id, profileMatched)
                    } else {
                        noMatchProfile(mojang.body.id, profileArg)
                    }
                }
            }
        }).catch(error => {
            errorHypixelAPI(error, "while getting skyblock data")
        })
    }).catch(error => {
        errorMojangAPI(error)
    })
}

function noProfile(uuid, username) {
    getHypixelPlayer(uuid).then(player => {
        let name = player.body.player == null ? `&7${username}` : formatRank(player.body.player)
        ChatLib.chat("&c&m--------------------&r")
        ChatLib.chat(`${name} &cdoesn't have any skyblock profiles!&r`)
        ChatLib.chat("&c&m--------------------&r")
    }).catch(error => {
        errorHypixelAPI(error, "while trying to get player data")
    })
}

function noMatchProfile(uuid, profileArg) {
    getHypixelPlayer(uuid).then(player => {
        let name = player.body.player == null ? `&7${username}` : formatRank(player.body.player)
        ChatLib.chat("&c&m--------------------&r")
        ChatLib.chat(`${name} &cdoesn't have any skyblock profile named '${profileArg}'!&r`)
        ChatLib.chat("&c&m--------------------&r")
    }).catch(error => {
        errorHypixelAPI(error, "while trying to get player data")
    })
}

function matchProfile(uuid, skyblockHy) {
    getHypixelPlayer(uuid).then(player => {
        let name = formatRank(player.body.player)
        //let chat = []

        //get inventory data
        if(skyblockHy.members[uuid].inv_contents == null) {
            ChatLib.chat("&c&m--------------------&r")
            ChatLib.chat(`&3[SBEC] &cInventory API is not enabled for: ${name}&r`)
            ChatLib.chat("&c&m--------------------&r")
        } else {
            let invContents = skyblockHy.members[uuid].inv_contents.data
            let bytearray = java.util.Base64.getDecoder().decode(invContents);
            let inputstream = new java.io.ByteArrayInputStream(bytearray);                                
            let nbt = net.minecraft.nbt.CompressedStreamTools.func_74796_a(inputstream); //CompressedStreamTools.readCompressed()                            
            let items = nbt.func_150295_c("i", 10); //NBTTagCompound.getTagList()
            let length = items.func_74745_c(); //NBTTagList.tagCount()

            let inv = new InventoryBasic(player.body.player.displayname + "'s Inventory", true, 54);

            for(let i = 0; i < length; i++){                                    
                let item = items.func_150305_b(i); //NBTTagList.getCompoundTagAt()
                
                if(!item.func_82582_d()) { //NBTTagCompound.hasNoTags()
                    let itemstack = new ItemStack(net.minecraft.init.Blocks.field_150350_a); //Blocks.air
                    itemstack.func_77963_c(item); //ItemStack.readFromNBT()
                    let slot = i < 9 ? i + 45 : i + 9 //Move hotbar slots to bottom
                    inv.func_70299_a(slot, itemstack); //InventoryBasic.setInventorySlotContents()
                }
            }

            let invArmorContents = skyblockHy.members[uuid].inv_armor.data
            let bytearray2 = java.util.Base64.getDecoder().decode(invArmorContents);
            let inputstream2 = new java.io.ByteArrayInputStream(bytearray2);                                
            let nbt2 = net.minecraft.nbt.CompressedStreamTools.func_74796_a(inputstream2); //CompressedStreamTools.readCompressed()                            
            let items2 = nbt2.func_150295_c("i", 10); //NBTTagCompound.getTagList()
            let length2 = items2.func_74745_c(); //NBTTagList.tagCount()
            
            for (let i = 0; i < length2; i++){                                    
                let item = items2.func_150305_b(i); //NBTTagList.getCompoundTagAt()
                if (!item.func_82582_d()) { //NBTTagCompound.hasNoTags()
                    let itemstack = new ItemStack(net.minecraft.init.Blocks.field_150350_a); //Blocks.stainedGlass
                    itemstack.func_77963_c(item); //ItemStack.readFromNBT()
                    
                    let slot = i //Move hotbar slots to bottom
                    if (slot == 0) {
                        slot = 7
                    } else if (slot == 1) {
                        slot = 5
                    } else if (slot == 2) {
                        slot = 3
                    } else if (slot == 3) {
                        slot = 1
                    }
                    inv.func_70299_a(slot, itemstack); //InventoryBasic.setInventorySlotContents()
                }
            }

            for (let i = 0; i < 18; i++){                                    
                let itemstack = new ItemStack(net.minecraft.init.Blocks.field_150397_co); //Blocks.stainedGlass
                let slot = i //Move hotbar slots to bottom
                if (slot != 1 && slot != 3 && slot != 5 && slot != 7 ) {
                    inv.func_70299_a(slot, itemstack);
                }
            }

            let guiChest = new GuiChest(Player.getPlayer().field_71071_by, inv); //EntityPlayer.inventory

            lastInv = guiChest;
            invToOpen = guiChest;
        }
    }).catch(error => {
        errorHypixelAPI(error, "while trying to get player data")
    })
}

register("tick", () => {
    if(invToOpen !== null) {
        Minecraft.func_147108_a(invToOpen); //Minecraft.displayGuiScreen()
        invToOpen = null;
    }
});

register("guiMouseClick", (x, y, button, gui, event) => {
    if(Client.getMinecraft().field_71462_r === lastInv && lastInv !== null) {
        cancel(event)
    }
});

function help() {
    const helpMessage = new Message().addTextComponent(new TextComponent(` &a◆ /inventory &8(Hover for usage)&r &7↣Displays the inventory for a player&r`).setHover("show_text", `&einventory [username] (profileName)`))
    helpMessage.chat()
}

export { run, help }