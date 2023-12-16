import { rarityToColor } from '../constants/misc';
import { sendErrorChatWithLog, sendMultiLineChat } from '../utils/chatHandler';
import { getCommandDataRes } from '../utils/request';
import { formatUsername, toTitleCase } from '../utils/utils';

module.exports = {
    name: 'sbpets',
    description: 'Returns pets data for player.',
    usage: '[username] (profileName)',
    execute(args) {
        const name = args[0] ?? Player.getName();
        const profileArg = args[1] ?? 'selected';
        getCommandDataRes(this.name, name, profileArg)
            .then((res) => {
                const { data } = res.data;
                const chat = [];
                chat.push(`&bPet Data for: ${formatUsername(data.rank, data.username)}&r`);
                if (data.pets.pets.length === 0) {
                    chat.push('&cNo pets&r');
                }
                data.pets.pets.forEach((pet) => {
                    let petName = `&${pet.heldItem ? 'c' : 'b'}- &${rarityToColor[pet.tier]}${toTitleCase(pet.tier)} ${pet.name}${pet.skin ? ' ✦' : ''} (${pet.level})&r`;
                    if (pet.heldItem) {
                        chat.push(new TextComponent(petName).setHover('show_text', `&bHeld Item: &${rarityToColor[pet.heldItem.tier]}${pet.heldItem.name}&r`));
                    } else {
                        chat.push(petName);
                    }
                });
                chat.push(`&7Pet Score: &f${data.pets.pet_score} &b(+${data.pets.magic_finds} MF)&r`);
                chat.push(`&7Unique Pets: &f${data.pets.unique}&r`);
                sendMultiLineChat(chat, true);
            })
            .catch((error) => {
                sendErrorChatWithLog(error, 'run command', this);
            });
    },
};
