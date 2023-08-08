function sendChat(msgArr) {
    msgArr.forEach((line) => {
        let newMessage = new Message();
        if (line.addTextComponent === 1) {
            let component = new TextComponent(line.message.text);
            if (line.message.setHover) {
                component.setHover(
                    line.message.setHover.type,
                    line.message.setHover.value
                );
            }
            if (line.message.setClick) {
                component.setClick(
                    line.message.setClick.type,
                    line.message.setClick.value
                );
            }
            newMessage.addTextComponent(component);
        } else {
            line.message.forEach((msg) => {
                let component = new TextComponent(msg.text);
                if (msg.setHover) {
                    component.setHover(msg.setHover.type, msg.setHover.value);
                }
                if (msg.setClick) {
                    component.setClick(msg.setClick.type, msg.setClick.value);
                }
                newMessage.addTextComponent(component);
            });
        }
        newMessage.chat();
    });
}

const exampleMessageArr = [
    {
        addTextComponent: 1,
        message: {
            text: 'text',
            setHover: {
                action: 'show_text',
                value: 'text',
            },
            setClick: {
                action: 'show_text',
                value: 'text',
            },
        },
    },
    {
        addTextComponent: 2,
        message: [
            {
                text: 'text',
                setHover: {
                    action: 'show_text',
                    value: 'text',
                },
                setClick: {
                    action: 'show_text',
                    value: 'text',
                },
            },
            {
                text: 'text',
                setHover: {
                    action: 'show_text',
                    value: 'text',
                },
                setClick: {
                    action: 'show_text',
                    value: 'text',
                },
            },
        ],
    },
];
