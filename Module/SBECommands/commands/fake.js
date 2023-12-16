import { sendSingleLineChat } from '../utils/chatHandler';

module.exports = {
    name: 'fake',
    description: 'Returns new faked string. Color Codes enabled.',
    usage: '',
    execute(args) {
        sendSingleLineChat(args.join(' '), false, false);
    },
};
