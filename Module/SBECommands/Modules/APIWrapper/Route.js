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
const metadata = JSON.parse(FileLib.read('SBECommands', 'metadata.json'));

const usernameRegex = /^[0-9A-Za-z_]{1,16}$/i;
const uuidRegex =
    /^([0-9a-f]{8})(?:-|)([0-9a-f]{4})(?:-|)(4[0-9a-f]{3})(?:-|)([0-9a-f]{4})(?:-|)([0-9a-f]{12})$/i;

function addDashedtoUUID(uuid) {
    return `${uuid.substr(0, 8)}-${uuid.substr(8, 4)}-${uuid.substr(12, 4)}-${uuid.substr(16, 4)}-${uuid.substr(20)}`;
}

function isUsername(user) {
    return usernameRegex.test(user);
}
    
function isUUID(user) {
    if (uuidRegex.test(user)) return true;
    const dashedUUID = addDashedtoUUID(user);
    return uuidRegex.test(dashedUUID);
}

const options = {
    headers: {
        "User-Agent": "Mozilla/5.0 (ChatTriggers)"
    },
    parseBody: true,
}

function getMojang(name) {
    return axios.get(`https://api.ashcon.app/mojang/v2/user/${name}`, {
        headers: {
            "User-Agent": "Mozilla/5.0 (ChatTriggers)"
        },
        parseBody: true,
    }).then(aschon => {
        return {
            name: aschon.data.username,
            uuid: aschon.data.uuid.replace(/-/g, '')
        }
    }).catch(error => {
        if (error.code === 429) {
            let mojangURL;
            if (isUsername(name)) {
                mojangURL = `https://api.mojang.com/users/profiles/minecraft/${name}`;
            } else if (isUUID(name)) {
                mojangURL = `https://sessionserver.mojang.com/session/minecraft/profile/${name}?unsigned=false`;
            } else {
                return { error: true, text: "&3[SBEC] &cInvalid Username!&r" };
            }
            return axios.get(mojangURL, {
                headers: {
                    "User-Agent": "Mozilla/5.0 (ChatTriggers)"
                },
                parseBody: true,
            }).then(mojang => {
                if (mojang.status === 204) {
                    return { error: true, text: "&3[SBEC] &cInvalid Username!&r"};
                }
                return {
                    name: mojang.data.name,
                    uuid: mojang.data.id,
                };
            }).catch(error => {
                return getErrorMessage(error, 'mojang', 'While trying to get uuid');
            })
        }
    })
}

function getHypixelPlayer(name) {
    return getMojang(name).then(mojang => {
        if (mojang.error) return mojang;
        console.log(JSON.stringify(mojang));
        name = mojang.name;
        const uuid = mojang.uuid;
        return axios.get(`https://api.hypixel.net/player?key=${get("apikey")}&uuid=${uuid}`, {
            headers: {
                "User-Agent": "Mozilla/5.0 (ChatTriggers)"
            },
            parseBody: true,
        })
        .then(player => {
            const formatedName = player.data.player == null ? `&7${name}` : formatRank(player.data.player);
            if (player.data.player == null) {
                return { error: true, text: `&3[SBEC] ${formatedName} &cHasn't joined Hypixel!&r` };
            }
            return {
                name: name,
                uuid: uuid,
                formatedName: formatedName,
                raw: player.data.player
            };
        }).catch(error => {
            return getErrorMessage(error, 'hypixel', 'While trying to get hypixel player data');
        })
    }).catch(error => {
        return getErrorMessage(error, 'mojang', 'While trying to get uuid');
    });
}

function getProfile(name, profileName, method) {
    return getHypixelPlayer(name).then(player => {
        if (player.error) return player;
        name = player.name;
        const uuid = player.uuid;
        let formatedName = player.formatedName;

        return axios.get(`https://api.hypixel.net/skyblock/profiles?key=${get("apikey")}&uuid=${uuid}`, {
            headers: {
                "User-Agent": "Mozilla/5.0 (ChatTriggers)"
            },
            parseBody: true,
        })
        .then(skyblock => {
            if (skyblock.data.profiles == null) {
                return { error: true, text: ['&c&m--------------------&r', `${formatedName} &cdoesn't have any skyblock profiles!&r`, '&c&m--------------------&r']};
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
            let profiles = skyblock.data.profiles;
            let selectedProfile = null;
            if (profileName !== 'last save') {
                profiles.forEach(profileData => {
                    if (profileData.cute_name.toLowerCase() === profileName.toLowerCase()) {
                        selectedProfile = profileData;
                    }
                })
            } else {
                selectedProfile = profiles.filter((ele) => ele.selected)[0];
            }
            if (selectedProfile == null) {
                return { error: true, text: ['&c&m--------------------&r', `${formatedName} &cdoesn't have any skyblock profile named '${profileName}'!&r`, '&c&m--------------------&r'] };
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
            return getErrorMessage(error, 'hypixel', 'While trying to get skyblock player data');
        })
    })
}

function getHypixelGuild(name) {
    return getHypixelPlayer(name).then(player => {
        if (player.error) return player;
        name = player.name;
        const uuid = player.uuid;
        let formatedName = player.formatedName;
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
            return getErrorMessage(error, 'hypixel', 'While trying to get hypixel guild data');
        });
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
        return getErrorMessage(error, 'while trying to get api key status');
    });
}

function postNetworthData(data) {
    return axios.post('https://icarusphantom.dev/api/networth/categories', {
        headers: {
            "User-Agent": "Mozilla/5.0 (ChatTriggers)"
        },
        body: {
            uuid: Player.getUUID(),
            version: metadata.version,
            data: data,
        },
        parseBody: true,
    }).then(networth => {
        return networth.data;
    }).catch(error => {
        return getErrorMessage(error, 'networth');
    })
}

export { getHypixelPlayer, getProfile, getHypixelGuild, getApiKeyStatus, postNetworthData };

function getErrorMessage(error, method, reason) {
    if (method === 'hypixel' || method === 'mojang') {
        if (error.code) {
            if ((error.code === 403 || error.code === 400) && method === 'hypixel') {
                return { error: true, text: "&3[SBEC] &cInvalid API Key. Please insert your valid Hypixel API Key using /sbecsetkey [key]&r" }
            } else if ((error.code === 404 || error.code === 400) && method === 'mojang') {
                return { error: true, text: "&3[SBEC] &cInvalid Username!&r" }
            } else if (error.code === 429) {
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
    } else if (method === 'networth') {
        if (error.code >= 500) {
            if (error.code === 502) {
                return { error: true, text: `&3[SBEC] &cAn error occured while trying to get networth data! My API currently down, please wait a few moment or contact IcarusPhantom using contact at &e/sbecauthor &c(error code: ${error.code})&r` }
            } else {
                return { error: true, text: `&3[SBEC] &cAn error occured while trying to get networth data! This may caused by my api has problem in their end (error code: ${error.code})&r` }
            }
        } else if (error.code === 400) {
            return { error: true, text: `&3[SBEC] &cAn error occured while trying to get networth data! ${error.response.data.cause}&r` }
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
