/// <reference types="../CTAutocomplete" />
/// <reference lib="es2015" />

import Settings from "./ConfigData/config"
import { nothing } from "./Modules/notifier"

const commandName = [
    "sbecsettings",
    "sbecsetkey",
    "calcpet",
    "calcskill",
    "calccata",
    "fake",
    "ginfo",
    "sbprofiles",
    "player",
    "weight",
    "nw",
    "sbskills",
    "slayer",
    "cata",
    "ms",
    "wealth",
    "sbpets",
    "sbhotm",
    "targetpractice",
    "essence",
    "inventory"
]

let helpCommand = []

commandName.forEach(name => {
    let command = require(`./Commands/${name + "Command"}`)
    let allowedRegister = true
    if (Settings[name] !== undefined) {
        if (!Settings[name]) {
            allowedRegister = false
        }
    }
    if (allowedRegister) {
        register("command", (...args) => {
            command.run(args)
        }).setName(name)
    }
    
    helpCommand.push(command)
})

register("command", () => {
    ChatLib.chat(`&c&m--------------&c[ &dSBECommands &c]&r&c&m--------------&r`)
    helpCommand.forEach(item => {
        item.help()
    })
    ChatLib.chat(" &aMade with &c❤ &aby &bIcarusPhantom")
    ChatLib.chat(`&c&m--------------------------------------------&r`)
}).setName("sbec")

//[HARD]  &a? /bestiarydata &8(Hover for usage)&r &7?N/A&r (HARD)
//[To many module already has this]  &a? /reparty &8(Hover for usage)&r &7?Disbands and reparties players in current party&r
//[HARD since I can't decoding item data and show in chat (maybe added in the future)]  &a? /pcheck &8(Hover for usage)&r &7?Returns information on party

/*
import FileUtilities from "../FileUtilities/main"
const encodedString = "H4sIAAAAAAAAA21Uy27bRhT9lckABhyYViiKpCzuFNmxicZyIslpCyMgLsmRNDA5owyHVoTA2+7abbso0EUXBvoFXftT/CW9M6QeRQsIpDhzzr3nPr9RntPIC7sOHclaaBrhPw0LGn2jTGRLGt19duitSBWDe0gLZgFXPGfvClhUSA18h+a8WhWwMaT3UiHmjj4/9S8ZKDLN8CAiz0/5wPfxdXbcC3rBa+oYxDmUsLC32UnPd/HNjk967muLO+k6oe91vBY71YqJhV426K4bHKLDu5PgM74Hxyfelh64/U5362mkuCajJYisdRcGRw0+dI9awqDfCY4O8YfyvMASrCyv1+2EO+hbKeqKDLWG7J5MV4zlDcN3W4LxgFCLzp+fiuY5lXVBLkAzRT6hEMeoaQSSeH9Qp7wqySfLHZwrWEhBrrBOh6z2eKYgOzyOyxUUXCxIHMcNPxZzLrhm5GPNHxD6wxZ6g1+FhHxP/sCZyiy5oX6Qa2M73t5PBV8xY3l7MGMFu+eCVbyyHEsLXn79iVyInExqwVod9iKcLqXSqVxHJBaVBqGLDamWUurqVVtu+4GW0x4++qCUXFcENJGYoU5bJBAktzUiTORMlUx0th6yc/6AXVqRjayVEfjy25/koAtMidIN8V/tJA1TXnC9icgUigfQHFOKHYaVmsSXVzMyeh+Pvtv7TRnJoNIsJzA31ShA5CZfaMgKXnJdtTK30RBAFpQOWTHBtEIXiK9XDUhL4800dX8uUTaaIzlrCohSva9NVAa5ZNuoUYdNDFljM+WtuxneGz8EijVsKpKpnZQz03TzAgkjWWnTpj38dV/+/qW5HklZ5HItzA141b+b9h6en0wm9y18/ePsKh6R89vx5cXNmLy9+Z7swRT3xhhKXAbGwhXmakNmWCMuQEtjJ3v5/a//e4b4pI8OvfiKOcKxUjytNavMclGAsWySerVQkJsj3EVLqZOV1Gg0ydoNFjhUYcNZyvlkeHkzplEPLZYy53NsbJS0NHowOFA6kfNkDWrHxnVWiwWTIsFRKZOCPbCCRgOHSsUXXMzMcqQfb7EbktFk+G4Wjy/RkFmjdHYxuY7Hw9nNBE/M+sTGxqbUVglv5xG1ODSzTUgjszzt+CZLO9U0QvGrdvisGN4ObfLFDi2euQ6tC81L3B1JhQVNGOyYZkxpFDq0MgNqXen9ZFqDmd0pFg68tG7wr2xXAH5gpuraxgOe5wIbhKcpm4enPuvCKfT6wWk2P3P7odcL/TMXI0UtDIe4XCFl8CZ843XJIPK7ZHhNH9FYs0ZphLpF0xD/6YaXn//Y/7D8GDbmPjYa9A6Fp4plskxlWhcYMt5qVTOMWnGTy4EbDgIv6A86/tnjP7AMYdDZBgAA"
const Base64 = Java.type("java.util.Base64");
let decodedString = Base64.getDecoder().decode(encodedString);
let string = FileUtilities.unGZIPString(decodedString)
console.log(string)
*/
