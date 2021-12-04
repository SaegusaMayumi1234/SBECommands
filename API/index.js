const pako = require('pako')
global.atob = require("atob");

const express = require('express');
const app = express();
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb'}));

app.all('/', (req, res)=>{
  res.status(200).json({
    status: 200
  })
})

app.post('/api/chattriggers/maro/decoder', async function (req, res) {
  let decodedDataDone = await decodeData(req.body)
  res.status(200).json(decodedDataDone)
  console.log("a post request from ctjs completed!")
})


function keepAlive() {
  app.listen(process.env.PORT || 3000, () => {
    console.log("Server is Ready!")
  });
}

async function decodeData(file) {
  let decoded = {}
  if (file.storage !== undefined) {
    decoded.storage = await loopDecode2(file.storage)
  }
  if (file.inventory !== undefined) {
    decoded.inventory = await loopDecode2(file.inventory)
  }
  if (file.enderchest !== undefined) {
    decoded.enderchest = await loopDecode2(file.enderchest)
  }
  if (file.armor !== undefined) {
    decoded.armor = await loopDecode2(file.armor)
  }
  if (file.wardrobe_inventory !== undefined) {
    decoded.wardrobe_inventory = await loopDecode2(file.wardrobe_inventory)
  }
  if (file.pets !== undefined) {
    decoded.pets = await loopDecode2(file.pets)
  }
  if (file.talismans !== undefined) {
    decoded.talismans = await loopDecode2(file.talismans)
  }
  return decoded
}

function loopDecode2(data) {
  return new Promise(async (resolve) => {
    let dataLenght = data.length
    let nameArr = []
    for (const item of data) {
      let decodedItemData = await decode(item.itemData)
      nameArr.push(decodedItemData + ` &b- ${item.priceString}`)
      if (nameArr.length == dataLenght) {
        resolve(nameArr)
      }
    }
  })
}

function decode(data) {
  return new Promise((resolve) => {
    let base64Decode = atob(data);
    let charData     = base64Decode.split('').map(function(x){return x.charCodeAt(0);});
    let binData      = new Uint8Array(charData);
    let decodedStr   = pako.inflate(binData);
    let strData     = String.fromCharCode.apply(null, new Uint16Array(decodedStr));
    let itemName = JSON.parse(strData)
    try {
      itemName = unicodeFixer(itemName.tag.display.Name)
    } catch(error) {
      itemName = "&7" + unicodeFixer(itemName.name).trim().replace("Common ", "&f").replace("Uncommon ", "&a").replace("Rare ", "&9").replace("Epic ", "&5").replace("Legendary ", "&6").replace("Mythic ", "&d")
      }
    resolve(itemName)
  })
}

function unicodeFixer(str) {
  return str.replace(/Â§/g, "&")
  .replace(/â\x9Cª/g, "✪")
  .replace(/â\x9A\x9A/g, "⚚")
  .replace(/â\x84¢/g, "™")
  .replace(/â\x9C¦/g, "✦")
}

keepAlive()
