export function fixUnicodeMaro(str) {
    return str.replace(/Â§/g, "&")
    .replace(/âœª/g, "&6✪")
    .replace(/â�Ÿ/g, "&c✪")
    .replace(/âšš/g, "⚚")
    .replace(/âœ¦/g, "✦")
    .replace(/Ã¢Â„Â¢/g, "™")
    .replace(/â„¢/g, "™")

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