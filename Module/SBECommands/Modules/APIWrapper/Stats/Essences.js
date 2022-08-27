exports.getEssences = function getEssences(uuid, profileData) {
    const profile = profileData.members[uuid]
    if (profile.inv_contents == undefined) {
        return { apiDisabled: true }
    }
    return {
        wither: profile.essence_wither || 0,
        undead: profile.essence_undead || 0,
        dragon: profile.essence_dragon || 0,
        ice: profile.essence_ice || 0,
        spider: profile.essence_spider || 0,
        diamond: profile.essence_diamond || 0,
        gold: profile.essence_gold || 0,
        crimson: profile.essence_crimson || 0
    }
}