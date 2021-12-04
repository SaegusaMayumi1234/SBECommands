export function humanizeTime(timestamp) {
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
}