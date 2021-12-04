export function errorHypixelAPI(error, reason) {
    if (error.status == 403 || error.status == 400) {
        ChatLib.chat("&3[SBEC] &cInvalid API Key. Please insert your valid Hypixel API Key using /sbecsetkey [key]&r")
    } else if (error.status == 429) {
        ChatLib.chat(`&3[SBEC] &cAn error occured ${reason}! You get rate limited!&r`)
    } else if (error.status >= 500) {
        ChatLib.chat(`&3[SBEC] &cAn error occured ${reason}! This usually because hypixel api is down (status code: ${error.status})&r`)
    } else {
        if (error.status !== undefined) {
            ChatLib.chat(`&3[SBEC] &cUnknown error occured ${reason}! (status code: ${error.status})&r`)
        } else if (error.message !== undefined) {
            ChatLib.chat(`&3[SBEC] &cUnknown error occured ${reason}! (${error.message})&r`)
        } else {
            ChatLib.chat(`&3[SBEC] &cUnknown error occured ${reason}!&r`)
        }
    }
}

export function errorMojangAPI(error) {
    if (error.message == "Empty JSON string" || error.status == 404) {
        ChatLib.chat("&3[SBEC] &cInvalid Username!&r")
    } else if (error.status == 429) {
        ChatLib.chat(`&3[SBEC] &cAn error occured while trying to getting uuid! You get rate limited!&r`)
    } else if (error.status >= 500) {
        ChatLib.chat(`&3[SBEC] &cAn error occured while trying to getting uuid! This usually because mojang api is down (status code: ${error.status}&r`)
    } else {
        if (error.status !== undefined) {
            ChatLib.chat(`&3[SBEC] &cUnknown error occured while trying to getting uuid! (status code: ${error.status})&r`)
        } else if (error.message !== undefined) {
            ChatLib.chat(`&3[SBEC] &cUnknown error occured while trying to getting uuid! (${error.message})&r`)
        } else {
            ChatLib.chat(`&3[SBEC] &cUnknown error occured while trying to getting uuid!&r`)
        }
    }
}

export function errorHypixelSenitherAPI(error, reason) {
    if (error.status == 403 || error.status == 400) {
        ChatLib.chat("&3[SBEC] &cInvalid API Key. Please insert your valid Hypixel API Key using /sbecsetkey [key]&r")
    } else if (error.status == 404) {
        ChatLib.chat("&3[SBEC] &cThis player doesn't have any skyblock profile!&r")
    } else if (error.status == 429) {
        ChatLib.chat(`&3[SBEC] &cAn error occured ${reason}! You get rate limited!&r`)
    } else if (error.status >= 500) {
        ChatLib.chat(`&3[SBEC] &cAn error occured ${reason}! This usually because hypixel api is down (status code: ${error.status})&r`)
    } else {
        if (error.status !== undefined) {
            ChatLib.chat(`&3[SBEC] &cUnknown error occured ${reason}! (status code: ${error.status})&r`)
        } else if (error.message !== undefined) {
            ChatLib.chat(`&3[SBEC] &cUnknown error occured ${reason}! (${error.message})&r`)
        } else {
            ChatLib.chat(`&3[SBEC] &cUnknown error occured ${reason}!&r`)
        }
    }
}

export function errorMaroAPI(error) {
    if (error.status >= 500) {
        ChatLib.chat(`&3[SBEC] &cAn error occured while trying to get networth data! This may caused by Maro api has problem in their end (status code: ${error.status})&r`)
    } else {
        if (error.status !== undefined) {
            ChatLib.chat(`&3[SBEC] &cUnknown error occured while trying to get networth data! (status code: ${error.status})&r`)
        } else if (error.message !== undefined) {
            ChatLib.chat(`&3[SBEC] &cUnknown error occured while trying to get networth data! (${error.message})&r`)
        } else {
            ChatLib.chat(`&3[SBEC] &cUnknown error occured while trying to get networth data!&r`)
        }
    }
}