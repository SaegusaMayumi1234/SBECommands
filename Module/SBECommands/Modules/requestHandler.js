import request from './request/request'
import { get } from './presistentData'

const headers = {
    "User-Agent": "Mozilla/5.0@SBECommands"
}

export function getApiKeyStatus(key) {
    return request({url: "https://api.hypixel.net/key?key=" + key, headers: headers, json: true, connectTimeout: 10000})
}

export function getMojang(name) {
    return request({url: "https://api.mojang.com/users/profiles/minecraft/" + name, headers: headers, json: true, connectTimeout: 10000})
}

export function getGuild(uuid) {
    return request({url: "https://api.hypixel.net/guild?key=" + get("apikey") + "&player=" + uuid, headers: headers, json: true, connectTimeout: 10000})
}

export function getHypixelPlayer(uuid) {
    return request({url: "https://api.hypixel.net/player?key=" + get("apikey") + "&uuid=" + uuid, headers: headers, json: true, connectTimeout: 10000})
}

export function getSkyblockData(uuid) {
    return request({url: "https://api.hypixel.net/skyblock/profiles?key=" + get("apikey") + "&uuid=" + uuid, headers: headers, json: true, connectTimeout: 10000})
}

export function getSkyblockSenitherData(uuid, param) {
    return request({url: "https://hypixel-api.senither.com/v1/profiles/" + uuid  + (param == null ?  "?key=" : "/" + param + "?key=") + get("apikey"), headers: headers, json: true, connectTimeout: 10000})
}

export function postMaroNetworth(data) {
    return request({url: "https://IcarusPhantom-API.saegusamayumi.repl.co/api/networth/categories", method: "POST", body: {data: data}, headers: headers, json: true, connectTimeout: 10000})
}

export function postDecodeData(data) {
    return request({url: "https://IcarusPhantom-API.saegusamayumi.repl.co/api/chattriggers/maro/decoder", method: "POST", body: data, headers: headers, json: true, connectTimeout: 10000})
}