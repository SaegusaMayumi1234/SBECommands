import { sendSingleLineChat, sendErrorChatWithLog } from '../utils/chatHandler';
import { getCommandDataRes } from '../utils/request';
import { formatUsername, decodeNBTData } from '../utils/utils';

const Minecraft = Client.getMinecraft();

// const ItemClass = Java.type('net.minecraft.item.Item');
const ItemStack = Java.type('net.minecraft.item.ItemStack');
const InventoryBasic = Java.type('net.minecraft.inventory.InventoryBasic');
const GuiChest = Java.type('net.minecraft.client.gui.inventory.GuiChest');
const MCItem = Java.type('net.minecraft.item.Item');

let lastInv = null;
let invToOpen = null;
const inventoryType = ['inv_armor', 'equipment_contents', 'inv_contents'];
const armorSlot = [7, 5, 3, 1];
const equipmentSlot = [11, 12, 14, 15];

module.exports = {
    name: 'inventory',
    description: 'Displays the inventory for player.',
    usage: '[username] (profileName)',
    execute(args) {
        const name = args[0] ?? Player.getName();
        const profileArg = args[1] ?? 'selected';
        getCommandDataRes(this.name, name, profileArg)
            .then((res) => {
                const { data } = res.data;
                if (data.noInventory) {
                    sendSingleLineChat(`${formatUsername(data.rank, data.username)}&r &chas inventory API disabled in profile '${data.profileName}'!&r`, true, false);
                    return;
                }
                let inv = new InventoryBasic(data.username + "'s Inventory", true, 54);
                for (let type of inventoryType) {
                    if (!data.inventory[type]) continue;
                    let { items, length } = decodeNBTData(data.inventory[type]);
                    for (let i = 0; i < length; i++) {
                        let item = items.func_150305_b(i); //NBTTagList.getCompoundTagAt()
                        let slot = i;
                        if (type === 'inv_armor') {
                            slot = armorSlot[i];
                        } else if (type === 'equipment_contents') {
                            slot = equipmentSlot[i];
                        } else if (type === 'inv_contents') {
                            slot = i < 9 ? i + 45 : i + 9;
                        }
                        if (!item.func_82582_d()) { //NBTTagCompound.hasNoTags()
                            let itemstack = new ItemStack(net.minecraft.init.Blocks.field_150350_a); //Blocks.air
                            itemstack.func_77963_c(item); //ItemStack.readFromNBT() //Move hotbar slots to bottom
                            inv.func_70299_a(slot, itemstack); //InventoryBasic.setInventorySlotContents()
                        }
                    }
                }
                for (let i = 0; i < 18; i++) {
                    if (!armorSlot.includes(i) && !equipmentSlot.includes(i)) {
                        let itemstack = new ItemStack(MCItem.func_150899_d(160), 1, 15).func_151001_c(''); //Blocks.stainedGlass
                        inv.func_70299_a(i, itemstack);
                    }
                }
                let guiChest = new GuiChest(Player.getPlayer().field_71071_by, inv); //EntityPlayer.inventory
                lastInv = guiChest;
                invToOpen = guiChest;
            })
            .catch((error) => {
                sendErrorChatWithLog(error, 'run command', this);
            });
    },
};

register('tick', () => {
    if (invToOpen !== null) {
        Minecraft.func_147108_a(invToOpen); //Minecraft.displayGuiScreen()
        invToOpen = null;
    }
});

register('guiMouseClick', (x, y, button, gui, event) => {
    if (Client.getMinecraft().field_71462_r === lastInv && lastInv !== null) {
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
            });
        }
    }
});
