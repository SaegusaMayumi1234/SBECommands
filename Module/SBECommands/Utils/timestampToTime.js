export function timestampToTime(timestamp) {
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
}