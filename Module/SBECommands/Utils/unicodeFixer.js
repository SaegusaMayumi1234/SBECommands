export function fixUnicodeMaro(str) {
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
}

export function fixUnicodeGlobal(str) {
    return str.replace(/âœª/g, "✪")
    .replace(/âšš/g, "⚚")
    .replace(/âœ¦/g, "✦")
    .replace(/â„¢/g, "™")
}

/*export function fixUnicodeGlobal(str) {
    return str.replace(/Ã¢ÂœÂ¦/g, "✦")
    .replace(/Ã¢Â„Â¢/g, "™")
    .replace(/Ã¢ÂœÂª/g, "✪")
    .replace(/Ã¢ÂšÂš/g, "⚚")
    .replace(/Ã‚Â§/g, "§")
}*/
