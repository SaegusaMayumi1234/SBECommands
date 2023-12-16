export function addNotation(type, value) {
    let returnVal = value;
    let notList = [];
    if (type === 'shortScale') {
        //notation type
        //do notation stuff here
        notList = [
            ' Thousand',
            ' Million',
            ' Billion',
            ' Trillion',
            ' Quadrillion',
            ' Quintillion',
        ];
    }

    if (type === 'oneLetters') {
        notList = ['K', 'M', 'B', 'T'];
    }

    let checkNum = 1000;

    if (type !== 'none' && type !== 'commas') {
        let notValue = notList[notList.length - 1];
        for (let u = notList.length; u >= 1; u--) {
            notValue = notList.shift();
            for (let o = 3; o >= 1; o--) {
                if (value >= checkNum) {
                    returnVal = value / (checkNum / 100);
                    returnVal = Math.floor(returnVal);
                    returnVal = (returnVal / Math.pow(10, o)) * 10;
                    returnVal = +returnVal.toFixed(o - 1) + notValue;
                }
                checkNum *= 10;
            }
        }
        if (typeof returnVal === 'number' && returnVal % 1 !== 0) {
            returnVal = returnVal.toFixed(2);
        }
    } else {
        let x = value.toFixed(0);
        if (x === undefined) {
            return '';
        }
        let parts = x.toString().split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        returnVal = parts.join('.');
    }

    return returnVal;
}

export function toTitleCase(str) {
    return str.toLowerCase().replace(/\b(\w)/g, (s) => s.toUpperCase());
}

export function capitalize(str) {
    if (!str) return null;
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function makePBar(current, total, size, color1, color2) {
    const line = '-';
    let bar = '';
    if (!current) {
        bar = `${color2}&m${line.repeat(size)}`;
    } else if (current >= total) {
        bar = `${color1}&m${line.repeat(size)}`;
    } else {
        const firstBar = Math.round((current / total) * size) === 0 ? 0 : Math.round((current / total) * size);
        const lastBar = size - firstBar;
        bar = `${color1}&m${line.repeat(firstBar)}${color2}&m${line.repeat(lastBar)}&r`;
    }
    return bar;
}

export function humanizeTime(timestamp) {
    let time = timestamp / 1000;
        if (time < 1) {
            time = 1;
        }
        const seconds = Math.floor(time >= 60 ? time % 60 : time);
        const minutes = Math.floor((time = time / 60) >= 60 ? time % 60 : time);
        const hours = Math.floor((time = time / 60) >= 24 ? time % 24 : time);
        const days = Math.floor((time = time / 24));
        const months = Math.floor((time = time / 30) >= 12 ? time % 12 : time);
        const years = Math.floor(time / 12);

        const humanizedTime = [];

        if (years > 0 && humanizedTime.length < 2) {
            humanizedTime.push(`${years}${years > 1 ? 'Years' : 'Year'}`);
        }
        if (months > 0 && humanizedTime.length < 2) {
            humanizedTime.push(`${months}${months > 1 ? 'Months' : 'Month'}`);
        }
        if (days > 0 && humanizedTime.length < 2) {
            humanizedTime.push(`${days}${days > 1 ? 'Days' : 'Day'}`);
        }
        if (hours > 0 && humanizedTime.length < 2) {
            humanizedTime.push(`${hours}${hours > 1 ? 'Hours' : 'Hour'}`);
        }
        if (minutes > 0 && humanizedTime.length < 2) {
            humanizedTime.push(`${minutes}${minutes > 1 ? 'Minutes' : 'Minute'}`);
        }
        if (humanizedTime.length < 2) {
            humanizedTime.push(`${seconds}${seconds > 1 ? 'Seconds' : 'Second'}`);
        }

        return humanizedTime.join(' ');
}

export function timestampToTime(timestamp) {
    if (timestamp === null) {
        return '??:??.???';
    }
    time = timestamp / 1000;
    let milisTime = timestamp;
    const miliSeconds = Math.floor(milisTime >= 1000 ? milisTime % 1000 : milisTime);
    const seconds = Math.floor(time >= 60 ? time % 60 : time);
    const minutes = Math.floor((time = time / 60) >= 60 ? time % 60 : time);

    let humanizedTime = '';

    if (minutes > 0) {
        humanizedTime = minutes.toString().length === 1 ? `0${minutes}:` : `${minutes}:`;
    } else {
        humanizedTime = '00:';
    }
    if (seconds > 0) {
        humanizedTime += seconds.toString().length === 1 ? `0${seconds}.` : `${seconds}.`;
    } else {
        humanizedTime += '00.';
    }
    if (miliSeconds > 0) {
        if (miliSeconds.toString().length === 1) {
            humanizedTime += `00${miliSeconds}`;
        } else if (miliSeconds.toString().length === 2) {
            humanizedTime += `0${miliSeconds}`;
        } else {
            humanizedTime += `${miliSeconds}`;
        }
    } else {
        humanizedTime += '000';
    }

    return humanizedTime;
}

export function timestampToDate(timestamp) {
    const time = new Date(timestamp);
    const seconds = time.getSeconds().toString().length === 1 ? `0${time.getSeconds()}` : time.getSeconds();
    const minutes = time.getMinutes().toString().length === 1 ? `0${time.getMinutes()}` : time.getMinutes();
    const hours = time.getHours().toString().length === 1 ? `0${time.getHours()}` : time.getHours();
    const days = time.getDate().toString().length === 1 ? `0${time.getDate()}` : time.getDate();
    const months = (time.getMonth() + 1).toString().length === 1 ? `0${time.getMonth() + 1}` : time.getMonth() + 1;
    const years = time.getFullYear().toString();
    return `${months}-${days}-${years} ${hours}:${minutes}:${seconds}`;
}

export function decodeNBTData(data) {
    let contents = data;
    let bytearray = java.util.Base64.getDecoder().decode(contents);
    let inputstream = new java.io.ByteArrayInputStream(bytearray);
    let nbt = net.minecraft.nbt.CompressedStreamTools.func_74796_a(inputstream); //CompressedStreamTools.readCompressed()
    let items = nbt.func_150295_c('i', 10); //NBTTagCompound.getTagList()
    let length = items.func_74745_c(); //NBTTagList.tagCount()
    return {
        items,
        length,
    };
}

export function getAllPlayers() {
    const NetHandlerPlayClient = Client.getConnection();
    const scoreboard = World.getWorld().func_96441_U();
    const teams = scoreboard.func_96525_g();
    const PLAYERARRAY = [];
    teams.forEach((team) => {
        let players = team.func_96670_d();
        players.forEach((player) => {
            let networkPlayerInfo = NetHandlerPlayClient.func_175104_a(player);
            if (networkPlayerInfo !== null) {
                PLAYERARRAY.push(
                    new PlayerMP(
                        new net.minecraft.client.entity.EntityOtherPlayerMP(
                            World.getWorld(),
                            networkPlayerInfo.func_178845_a()
                        )
                    )
                );
            }
        });
    });
    return PLAYERARRAY;
}

export function formatUsername(rank, username) {
    return `${rank}${rank !== '§7' ? ' ' : ''}${username}`
}

export function intToRoman(num) {
    const lookup = [
        ['M', 1000],
        ['CM', 900],
        ['D', 500],
        ['CD', 400],
        ['C', 100],
        ['XC', 90],
        ['L', 50],
        ['XL', 40],
        ['X', 10],
        ['IX', 9],
        ['V', 5],
        ['IV', 4],
        ['I', 1],
    ];
    return lookup.reduce((acc, [k, v]) => {
        acc += k.repeat(Math.floor(num / v));
        num = num % v;
        return acc;
    }, '');
};
