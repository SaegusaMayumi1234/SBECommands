module.exports = {
    addNotation: function addNotation(type, value) {
        let returnVal = value;
        let notList = [];
        if (type === "shortScale") {
            //notation type
            //do notation stuff here
            notList = [
                " Thousand",
                " Million",
                " Billion",
                " Trillion",
                " Quadrillion",
                " Quintillion"
            ];
        }
    
        if (type === "oneLetters") {
            notList = ["K", "M", "B", "T"];
        }
    
        let checkNum = 1000;
    
        if (type !== "none" && type !== "commas") {
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
            let x = value.toFixed(0)
            if (x === undefined) { return "" }
            let parts = x.toString().split(".");
            parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            returnVal = parts.join(".")
        }
    
        return returnVal;
    },
    toTitleCase: function toTitleCase(str) {
		return str.toLowerCase().replace(/\b(\w)/g, s => s.toUpperCase());
	},
	capitalize: function capitalize(str) {
		if (!str) return null;
		return str.charAt(0).toUpperCase() + str.slice(1);
	},
    timestampToTime: function timestampToTime(timestamp) {
        if (timestamp == null) {
            return "??:??.???"
        }
        time = timestamp / 1000
        let milisTime = timestamp
        const miliSeconds = Math.floor(milisTime >= 1000 ? milisTime % 1000 : milisTime)
        const seconds = Math.floor(time >= 60 ? time % 60 : time)
        const minutes = Math.floor((time = time / 60) >= 60 ? time % 60 : time)
    
        let humanizedTime = ""
    
        if (minutes > 0) {
            humanizedTime = minutes.toString().length == 1 ? `0${minutes}:` : `${minutes}:`
        } else {
            humanizedTime = "00:"
        }
        if (seconds > 0) {
            humanizedTime += seconds.toString().length == 1 ? `0${seconds}.` : `${seconds}.`
        } else {
            humanizedTime += "00."
        }
        if (miliSeconds > 0) {
            if (miliSeconds.toString().length == 1) {
                humanizedTime += `00${miliSeconds}`
            } else if (miliSeconds.toString().length == 2) {
                humanizedTime += `0${miliSeconds}`
            } else {
                humanizedTime += `${miliSeconds}`
            }
        } else {
            humanizedTime += "000"
        }
    
        return humanizedTime
    },
    errorRead: function(text) {
        if (typeof text === 'string') {
            ChatLib.chat(text)
        } else {
            for (let i = 0; i < text.length; i++) {
                ChatLib.chat(text[i])
            }
        }
    },
    fixUnicode(str) {
        return str.replace(/Â§/g, "&")
        .replace(/âœª/g, "✪")
        .replace(/â�Ÿ/g, "✪")
        .replace(/âšš/g, "⚚")
        .replace(/âœ¦/g, "✦")
        .replace(/Ã¢Â„Â¢/g, "™")
        .replace(/â„¢/g, "™")
        .replace(/â��/g, "❁")
        .replace(/â¸•/g, "⸕")
        .replace(/â�ˆ/g, "❈")
        .replace(/âœŽ/g, "✎")
        .replace(/â�¤/g, "❤")
        .replace(/â˜˜/g, "☘")
        .replace(/âœ§/g, "✧")
        .replace(/â—†/g, "◆")
        .replace(/âžŠ/g, "❶")
        .replace(/âž‹/g, "❷")
        .replace(/âžŒ/g, "❸")
        .replace(/âž�/g, "❹")
        .replace(/âžŽ/g, "❺")
    },
    makePBar: function makePBar(current, total, size, color1, color2) {
        const line = '-';
        let bar = ''
        if (!current) {
			bar = color2 + line.repeat(size);
		} else if (current >= total) {
			bar = color1 + line.repeat(size);
		} else {
            const firstBar = Math.round(current / total * size) == 0 ? 0 : Math.round(current / total * size);
			const lastBar = size - firstBar;
            bar = color1 + line.repeat(firstBar) + color2 + line.repeat(lastBar)
        }
        return bar
    },
    humanizeTime: function humanizeTime(timestamp) {
        let time = timestamp / 1000
        if (time < 1) {
            time = 1
        }
        const seconds = Math.floor(time >= 60 ? time % 60 : time)
        const minutes = Math.floor((time = time / 60) >= 60 ? time % 60 : time)
        const hours = Math.floor((time = time / 60) >= 24 ? time % 24 : time)
        const days = Math.floor((time = time / 24))
    
        let humanizedTime = ""
    
        if (days > 0) {
            humanizedTime = days == 1 ? 'a day' : `${days} days`
        } else if (hours > 0) {
            humanizedTime = hours == 1 ? 'a hour' : `${hours} hours`
        } else if (minutes > 0) {
            humanizedTime = minutes == 1 ? 'a minute' : `${minutes} minutes`
        } else if (seconds > 0) {
            humanizedTime = seconds == 1 ? 'a second' : `${seconds} seconds`
        }
    
        return humanizedTime + " ago"
    },
    timestampToDate: function timestampToDate(timestamp) {
        const time = new Date(timestamp)
        const seconds = time.getSeconds().toString().length == 1 ? `0${time.getSeconds()}` : time.getSeconds()
        const minutes = time.getMinutes().toString().length == 1 ? `0${time.getMinutes()}` : time.getMinutes()
        const hours = time.getHours().toString().length == 1 ? `0${time.getHours()}` : time.getHours()
        const days = time.getDate().toString().length == 1 ? `0${time.getDate()}` : time.getDate()
        const months = (time.getMonth() + 1).toString().length == 1 ? `0${time.getMonth() + 1}` : time.getMonth() + 1
        const years = time.getFullYear().toString()
        return `${months}-${days}-${years} ${hours}:${minutes}:${seconds}`
    }
}
