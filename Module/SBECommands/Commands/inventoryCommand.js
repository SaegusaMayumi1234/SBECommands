import { getProfile } from '../Modules/APIWrapper/Route';
import { errorRead, decodeNBTData } from '../Utils/Utils';

let customCommandName = 'invetory';

const Minecraft = Client.getMinecraft();

//const ItemClass = Java.type("net.minecraft.item.Item");
const ItemStack = Java.type("net.minecraft.item.ItemStack");
const InventoryBasic = Java.type("net.minecraft.inventory.InventoryBasic");
const GuiChest = Java.type("net.minecraft.client.gui.inventory.GuiChest");
const MCItem = Java.type("net.minecraft.item.Item");

let lastInv = null;
let invToOpen = null;

module.exports = {
    name: 'inventory',
    execute(args) {
        let name = args[0] == undefined ? Player.getName() : args[0];
        let profileArg = args[1] == undefined ? "last save" : args[1];
        ChatLib.chat(`&3[SBEC] &aFinding inventory for ${name}`);
        getProfile(name, profileArg).then(data => {
            if (data.error) {
                errorRead(data.text);
                return;
            }

            if (data.raw.members[data.uuid].inv_contents === undefined) {
                ChatLib.chat(`&3[SBEC] &cPlayer does not have their inventory api on!&r`);
            }

            let inv = new InventoryBasic(data.name + "'s Inventory", true, 54);

            if (data.raw.members[data.uuid].inv_contents !== undefined) {
                let { items, length } = decodeNBTData(data.raw.members[data.uuid].inv_contents.data)

                for (let i = 0; i < length; i++) {                                    
                    let item = items.func_150305_b(i); //NBTTagList.getCompoundTagAt()
                    
                    if(!item.func_82582_d()) { //NBTTagCompound.hasNoTags()
                        let itemstack = new ItemStack(net.minecraft.init.Blocks.field_150350_a); //Blocks.air
                        itemstack.func_77963_c(item); //ItemStack.readFromNBT()
                        let slot = i < 9 ? i + 45 : i + 9; //Move hotbar slots to bottom
                        inv.func_70299_a(slot, itemstack); //InventoryBasic.setInventorySlotContents()
                    }
                }
            } else {
                for (let i = 18; i < 54; i++){                                    
                    let itemstack = new ItemStack(MCItem.func_150899_d(166), 1, 0).func_151001_c("§cAPI DISABLED"); //Blocks.barrier
                    let slot = i
                    inv.func_70299_a(slot, itemstack);
                }
            }

            if (data.raw.members[data.uuid].inv_armor !== undefined) {
                let { items, length } = decodeNBTData(data.raw.members[data.uuid].inv_armor.data)
                
                for (let i = 0; i < length; i++) {                                    
                    let item = items.func_150305_b(i); //NBTTagList.getCompoundTagAt()
                    let slot = i
                    if (slot == 0) {
                        slot = 7;
                    } else if (slot == 1) {
                        slot = 5;
                    } else if (slot == 2) {
                        slot = 3;
                    } else if (slot == 3) {
                        slot = 1;
                    }
                    if (!item.func_82582_d()) { //NBTTagCompound.hasNoTags()
                        let itemstack = new ItemStack(net.minecraft.init.Blocks.field_150350_a); //Blocks.stainedGlass
                        itemstack.func_77963_c(item); //ItemStack.readFromNBT()
                        inv.func_70299_a(slot, itemstack); //InventoryBasic.setInventorySlotContents()
                    }
                }
            } else {
                let itemstack = new ItemStack(MCItem.func_150899_d(160), 1, 15).func_151001_c(""); //Blocks.stainedGlass
                inv.func_70299_a(1, itemstack);
                inv.func_70299_a(3, itemstack);
                inv.func_70299_a(5, itemstack);
                inv.func_70299_a(7, itemstack);
            }

            if (data.raw.members[data.uuid].equippment_contents !== undefined) {
                let { items, length } = decodeNBTData(data.raw.members[data.uuid].equippment_contents.data)
                
                for (let i = 0; i < length; i++) {                                    
                    let item = items.func_150305_b(i); //NBTTagList.getCompoundTagAt()
                    let slot = i
                    if (slot == 0) {
                        slot = 11;
                    } else if (slot == 1) {
                        slot = 12;
                    } else if (slot == 2) {
                        slot = 14;
                    } else if (slot == 3) {
                        slot = 15;
                    }
                    if (!item.func_82582_d()) { //NBTTagCompound.hasNoTags()
                        let itemstack = new ItemStack(net.minecraft.init.Blocks.field_150350_a); //Blocks.stainedGlass
                        itemstack.func_77963_c(item); //ItemStack.readFromNBT()
                        inv.func_70299_a(slot, itemstack); //InventoryBasic.setInventorySlotContents()
                    }
                }
            } else {
                let itemstack = new ItemStack(MCItem.func_150899_d(160), 1, 15).func_151001_c(""); //Blocks.stainedGlass
                inv.func_70299_a(11, itemstack);
                inv.func_70299_a(12, itemstack);
                inv.func_70299_a(14, itemstack);
                inv.func_70299_a(15, itemstack);
            }
            
            for (let i = 0; i < 18; i++){                                    
                let itemstack = new ItemStack(MCItem.func_150899_d(160), 1, 15).func_151001_c(""); //Blocks.stainedGlass
                let slot = i
                if (slot != 1 && slot != 3 && slot != 5 && slot != 7 && slot != 11 && slot != 12 && slot != 14 && slot != 15) {
                    inv.func_70299_a(slot, itemstack);
                }
            }

            let guiChest = new GuiChest(Player.getPlayer().field_71071_by, inv); //EntityPlayer.inventory

            lastInv = guiChest;
            invToOpen = guiChest;
        }).catch(error => {
            ChatLib.chat(`&3[SBEC] &cUnknown error occured while trying to run ${customCommandName}! If this issue still presist report this to module author!`)
        });
    },
    inject(name) {
        customCommandName = name;
    }
}

register("tick", () => {
    if(invToOpen !== null) {
        Minecraft.func_147108_a(invToOpen); //Minecraft.displayGuiScreen()
        invToOpen = null;
    }
});

register("guiMouseClick", (x, y, button, gui, event) => {
    if(Client.getMinecraft().field_71462_r === lastInv && lastInv !== null) {
        cancel(event);
    }
});

register('guiKey', (char, keyCode, gui, event) => {
    if (Client.getMinecraft().field_71462_r === lastInv && lastInv !== null) {
        if (keyCode === Client.getMinecraft().field_71474_y.field_74316_C.func_151463_i()) {
            cancel(event);
        } else {
            Client.getMinecraft().field_71474_y.field_151456_ac.forEach((keybind) => {
                if (keybind.func_151463_i() === keyCode) {
                    cancel(event);
                }
            })
        }
    }
})