import { getProfile } from '../Modules/APIWrapper/Route';
import { errorRead } from '../Utils/Utils';

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

            if (data.raw.members[data.uuid].inv_contents == null) {
                ChatLib.chat("&c&m--------------------&r");
                ChatLib.chat(`&3[SBEC] &cInventory API is not enabled for: ${data.formatedName}&r`);
                ChatLib.chat("&c&m--------------------&r");
                return;
            }

            let invContents = data.raw.members[data.uuid].inv_contents.data;
            let bytearray = java.util.Base64.getDecoder().decode(invContents);
            let inputstream = new java.io.ByteArrayInputStream(bytearray);                                
            let nbt = net.minecraft.nbt.CompressedStreamTools.func_74796_a(inputstream); //CompressedStreamTools.readCompressed()                            
            let items = nbt.func_150295_c("i", 10); //NBTTagCompound.getTagList()
            let length = items.func_74745_c(); //NBTTagList.tagCount()

            let inv = new InventoryBasic(data.name + "'s Inventory", true, 54);

            for (let i = 0; i < length; i++) {                                    
                let item = items.func_150305_b(i); //NBTTagList.getCompoundTagAt()
                
                if(!item.func_82582_d()) { //NBTTagCompound.hasNoTags()
                    let itemstack = new ItemStack(net.minecraft.init.Blocks.field_150350_a); //Blocks.air
                    itemstack.func_77963_c(item); //ItemStack.readFromNBT()
                    let slot = i < 9 ? i + 45 : i + 9; //Move hotbar slots to bottom
                    inv.func_70299_a(slot, itemstack); //InventoryBasic.setInventorySlotContents()
                }
            }

            let invArmorContents = data.raw.members[data.uuid].inv_armor.data;
            let bytearray2 = java.util.Base64.getDecoder().decode(invArmorContents);
            let inputstream2 = new java.io.ByteArrayInputStream(bytearray2);                                
            let nbt2 = net.minecraft.nbt.CompressedStreamTools.func_74796_a(inputstream2); //CompressedStreamTools.readCompressed()                            
            let items2 = nbt2.func_150295_c("i", 10); //NBTTagCompound.getTagList()
            let length2 = items2.func_74745_c(); //NBTTagList.tagCount()
            
            for (let i = 0; i < length2; i++) {                                    
                let item = items2.func_150305_b(i); //NBTTagList.getCompoundTagAt()
                if (!item.func_82582_d()) { //NBTTagCompound.hasNoTags()
                    let itemstack = new ItemStack(net.minecraft.init.Blocks.field_150350_a); //Blocks.stainedGlass
                    itemstack.func_77963_c(item); //ItemStack.readFromNBT()
                    
                    let slot = i //Move hotbar slots to bottom
                    if (slot == 0) {
                        slot = 7;
                    } else if (slot == 1) {
                        slot = 5;
                    } else if (slot == 2) {
                        slot = 3;
                    } else if (slot == 3) {
                        slot = 1;
                    }
                    inv.func_70299_a(slot, itemstack); //InventoryBasic.setInventorySlotContents()
                }
            }

            for (let i = 0; i < 18; i++){                                    
                let itemstack = new ItemStack(MCItem.func_150899_d(160), 1, 15).func_151001_c(""); //Blocks.stainedGlass
                let slot = i //Move hotbar slots to bottom
                if (slot != 1 && slot != 3 && slot != 5 && slot != 7 ) {
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