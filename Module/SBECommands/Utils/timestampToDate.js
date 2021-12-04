export function timestampToDate(timestamp) {
    const time = new Date(timestamp)
    const seconds = time.getSeconds().toString().length == 1 ? `0${time.getSeconds()}` : time.getSeconds()
    const minutes = time.getMinutes().toString().length == 1 ? `0${time.getMinutes()}` : time.getMinutes()
    const hours = time.getHours().toString().length == 1 ? `0${time.getHours()}` : time.getHours()
    const days = time.getDate().toString().length == 1 ? `0${time.getDate()}` : time.getDate()
    const months = (time.getMonth() + 1).toString().length == 1 ? `0${time.getMonth() + 1}` : time.getMonth() + 1
    const years = time.getFullYear().toString()
    return `${months}-${days}-${years} ${hours}:${minutes}:${seconds}`
}