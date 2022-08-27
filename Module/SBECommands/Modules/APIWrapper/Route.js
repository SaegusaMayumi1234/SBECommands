import axios from '../../../axios';
import { get } from '../PresistentData';
import { formatRank } from '../../Utils/formatRank';
import { getSkills } from './Stats/Skills';
import { getDungeons } from './Stats/Dungeons';
import { getSlayers } from './Stats/Slayers';
import { getMining } from './Stats/Mining';
import { getEssences } from './Stats/Essences';
import { getPets } from './Stats/Pets';
import { getWeight } from './Stats/Weight';

const options = {
    headers: {
        "User-Agent": "Mozilla/5.0 (ChatTriggers)"
    },
    parseBody: true,
}

function getHypixelPlayer(name) {
    return axios.get(`https://api.ashcon.app/mojang/v2/user/${name}`, {
        headers: {
            "User-Agent": "Mozilla/5.0 (ChatTriggers)"
        },
        parseBody: true,
    })
    .then(mojang => {
        name = mojang.data.username;
        const uuid = mojang.data.uuid.replace(/-/g, '');
        return axios.get(`https://api.hypixel.net/player?key=${get("apikey")}&uuid=${uuid}`, {
            headers: {
                "User-Agent": "Mozilla/5.0 (ChatTriggers)"
            },
            parseBody: true,
        })
        .then(player => {
            const formatedName = player.data.player == null ? `&7${name}` : formatRank(player.data.player)
            if (player.data.player == null) {
                return { error: true, text: `&3[SBEC] ${formatedName} &cHasn't joined Hypixel!&r` }
            }
            return {
                name: name,
                uuid: uuid,
                formatedName: formatedName,
                raw: player.data.player
            }
        }).catch(error => {
            return getErrorMessage(error, 'hypixel', 'While trying to get hypixel player data')
        })
    }).catch(error => {
        return getErrorMessage(error, 'mojang', 'While trying to get uuid')
    });
}

function getProfile(name, profileName, method) {
    return getHypixelPlayer(name).then(player => {
        if (player.error) return player
        name = player.name;
        const uuid = player.uuid;
        let formatedName = player.formatedName

        return axios.get(`https://api.hypixel.net/skyblock/profiles?key=${get("apikey")}&uuid=${uuid}`, {
            headers: {
                "User-Agent": "Mozilla/5.0 (ChatTriggers)"
            },
            parseBody: true,
        })
        .then(skyblock => {
            if (skyblock.data.profiles == null) {
                return { error: true, text: ['&c&m--------------------&r', `${formatedName} &cdoesn't have any skyblock profiles!&r`, '&c&m--------------------&r']}
            }
            if (method === 'all') {
                return {
                    name: name,
                    uuid: uuid,
                    formatedName: formatedName,
                    raw: {
                        profiles: skyblock.data.profiles
                    }
                };
            }
            let profiles = skyblock.data.profiles
            let selectedProfile = null
            if (profileName !== 'last save') {
                profiles.forEach(profileData => {
                    if (profileData.cute_name.toLowerCase() === profileName.toLowerCase() && profileData.members[uuid].last_save !== undefined) {
                        selectedProfile = profileData
                    }
                })
            } else {
                let tempProfiles = []
                profiles.forEach(profileData => {
                    if (profileData.members[uuid].last_save !== undefined) {
                        tempProfiles.push(profileData)
                    }
                })
                selectedProfile = tempProfiles.sort((a, b) => b.members[uuid].last_save - a.members[uuid].last_save)[0]
            }
            if (selectedProfile == null) {
                return { error: true, text: ['&c&m--------------------&r', `${formatedName} &cdoesn't have any skyblock profile named '${profileName}'!&r`, '&c&m--------------------&r'] }
            }

            const achievements = player.raw.achievements;
            const playerData = {
                name: player.raw.displayname,
                skills: {
                    mining: achievements?.skyblock_excavator || 0,
                    foraging: achievements?.skyblock_gatherer || 0,
                    enchanting: achievements?.skyblock_augmentation || 0,
                    farming: achievements?.skyblock_harvester || 0,
                    combat: achievements?.skyblock_combat || 0,
                    fishing: achievements?.skyblock_angler || 0,
                    alchemy: achievements?.skyblock_concoctor || 0,
                    taming: achievements?.skyblock_domesticator || 0,
                },
                dungeons: {
                    secrets: achievements?.skyblock_treasure_hunter || 0,
                },
            }
            const res = {
                name: name,
                uuid: uuid,
                formatedName: formatedName,
                profile: selectedProfile.cute_name,
                skills: getSkills(uuid, selectedProfile, playerData),
                dungeons: getDungeons(uuid, selectedProfile, playerData),
                slayers: getSlayers(uuid, selectedProfile),
                mining: getMining(uuid, selectedProfile),
                essences: getEssences(uuid, selectedProfile),
                pets: getPets(uuid, selectedProfile),
                weight: getWeight(selectedProfile.members[uuid], achievements),
                raw: selectedProfile
            };
            return res;
        }).catch(error => {
            return getErrorMessage(error, 'hypixel', 'While trying to get skyblock player data')
        })
    })
}

function getHypixelGuild(name) {
    return getHypixelPlayer(name).then(player => {
        if (player.error) return player
        name = player.name;
        const uuid = player.uuid;
        let formatedName = player.formatedName
        return axios.get(`https://api.hypixel.net/guild?key=${get("apikey")}&player=${uuid}`, {
            headers: {
                "User-Agent": "Mozilla/5.0 (ChatTriggers)"
            },
            parseBody: true,
        })
        .then(guild => {
            return {
                name: name,
                uuid: uuid,
                formatedName: formatedName,
                guild: guild.data
            };
        }).catch(error => {
            return getErrorMessage(error, 'hypixel', 'While trying to get hypixel guild data')
        })
    })
}

function getApiKeyStatus(apikey) {
    return axios.get(`https://api.hypixel.net/key?key=${apikey}`, {
        headers: {
            "User-Agent": "Mozilla/5.0 (ChatTriggers)"
        },
        parseBody: true,
    })
    .then(apikeystatus => {
        return { valid: true };
    }).catch(error => {
        return getErrorMessage(error, 'while trying to get api key status')
    });
}

function postNetworthData(data) {
    return axios.post('https://IcarusPhantom-API.saegusamayumi.repl.co/api/networth/categories', {
        headers: {
            "User-Agent": "Mozilla/5.0 (ChatTriggers)"
        },
        body: {
            data: data
        },
        parseBody: true,
    }).then(maro => {
        return maro.data
    }).catch(error => {
        return getErrorMessage(error, 'maro')
    })
}

export { getHypixelPlayer, getProfile, getHypixelGuild, getApiKeyStatus, postNetworthData }

function getErrorMessage(error, method, reason) {
    if (method === 'hypixel' || method === 'mojang') {
        if (error.code) {
            if ((error.code == 403 || error.code == 400) && method === 'hypixel') {
                return { error: true, text: "&3[SBEC] &cInvalid API Key. Please insert your valid Hypixel API Key using /sbecsetkey [key]&r" }
            } else if (error.code == 404 && method === 'mojang') {
                return { error: true, text: "&3[SBEC] &cInvalid Username!&r" }
            } else if (error.code == 429) {
                return { error: true, text: `&3[SBEC] &cAn error occured ${reason}! You get rate limited!&r` }
            } else if (error.code >= 500) {
                return { error: true, text: `&3[SBEC] &cAn error occured ${reason}! This usually because ${method} api is down (error code: ${error.code})&r` }
            } else {
                return { error: true, text: `&3[SBEC] &cUnknown error occured ${reason}! (error code: ${error.code})&r` }
            }
        } else if (error.message !== undefined) {
            return { error: true, text: `&3[SBEC] &cUnknown error occured ${reason}! (${error.message})&r` }
        } else {
            return { error: true, text: `&3[SBEC] &cUnknown error occured ${reason}!&r` }
        }
    } else if (method === 'maro') {
        if (error.code >= 500) {
            if (error.code == 502) {
                return { error: true, text: `&3[SBEC] &cAn error occured while trying to get networth data! My API currently down, please wait a few moment or contact IcarusPhantom using contact at &e/sbecauthor (error code: ${error.code})&r` }
            } else {
                return { error: true, text: `&3[SBEC] &cAn error occured while trying to get networth data! This may caused by Maro api has problem in their end (error code: ${error.code})&r` }
            }
        } else {
            if (error.code !== undefined) {
                return { error: true, text: `&3[SBEC] &cUnknown error occured while trying to get networth data! (error code: ${error.code})&r` }
            } else if (error.message !== undefined) {
                if (error.message === 'Cannot call method "close" of undefined' || error.message === 'Unexpected token: <' ) {
                    return { error: true, text: `&3[SBEC] &cUnknown error occured while trying to get networth data! (API Side error | This is known issue and unable to fix! You may try rerun the command because sometimes resolved itself)&r` }
                } else {
                    return { error: true, text: `&3[SBEC] &cUnknown error occured while trying to get networth data! (${error.message})&r` }
                }
            } else {
                return { error: true, text: `&3[SBEC] &cUnknown error occured while trying to get networth data!&r` }
            }
        }
    }
}
