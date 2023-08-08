export const pet_rarity_offset = {
    common: 0,
    uncommon: 6,
    rare: 11,
    epic: 16,
    legendary: 20,
    mythic: 20,
};
  
export const pet_levels = [
    100, 110, 120, 130, 145, 160, 175, 190, 210, 230, 250, 275, 300, 330, 360, 400, 440, 490, 540, 600, 660, 730, 800,
    880, 960, 1050, 1150, 1260, 1380, 1510, 1650, 1800, 1960, 2130, 2310, 2500, 2700, 2920, 3160, 3420, 3700, 4000, 4350,
    4750, 5200, 5700, 6300, 7000, 7800, 8700, 9700, 10800, 12000, 13300, 14700, 16200, 17800, 19500, 21300, 23200, 25200,
    27400, 29800, 32400, 35200, 38200, 41400, 44800, 48400, 52200, 56200, 60400, 64800, 69400, 74200, 79200, 84700, 90700,
    97200, 104200, 111700, 119700, 128200, 137200, 146700, 156700, 167700, 179700, 192700, 206700, 221700, 237700, 254700,
    272700, 291700, 311700, 333700, 357700, 383700, 411700, 441700, 476700, 516700, 561700, 611700, 666700, 726700,
    791700, 861700, 936700, 1016700, 1101700, 1191700, 1286700, 1386700, 1496700, 1616700, 1746700, 1886700,
    // Values below for above level 100 (legendary) are just guessed
    0, 1, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700,
    1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700,
    1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700,
    1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700,
    1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700,
    1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700,
    1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700,
    1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700, 1886700,
];

export const max_pet_level = {
    common: 100,
    uncommon: 100,
    rare: 100,
    epic: 100,
    legendary: 200,
    mythic: 100
}

export const maxCustomLevel = {
    GOLDEN_DRAGON: 200
}

export const uniquePets = 59

export const pet_value = {
  common: 1,
  uncommon: 2,
  rare: 3,
  epic: 4,
  legendary: 5,
  mythic: 6,
};

export const pet_rewards = {
  0: {
    magic_find: 0,
  },
  10: {
    magic_find: 1,
  },
  25: {
    magic_find: 2,
  },
  50: {
    magic_find: 3,
  },
  75: {
    magic_find: 4,
  },
  100: {
    magic_find: 5,
  },
  130: {
    magic_find: 6,
  },
  175: {
    magic_find: 7,
  },
};

export const pet_items = {
    PET_ITEM_ALL_SKILLS_BOOST_COMMON: {
      name: "All Skills Exp Boost",
      tier: "COMMON"
    },
    PET_ITEM_BIG_TEETH_COMMON: {
      name: "Big Teeth",
      tier: "COMMON"
    },
    PET_ITEM_IRON_CLAWS_COMMON: {
      name: "Iron Claws",
      tier: "COMMON"
    },
    PET_ITEM_SHARPENED_CLAWS_UNCOMMON: {
      name: "Sharpened Claws",
      tier: "UNCOMMON"
    },
    PET_ITEM_HARDENED_SCALES_UNCOMMON: {
      name: "Hardened Scales",
      tier: "UNCOMMON"
    },
    PET_ITEM_BUBBLEGUM: {
      name: "Bubblegum",
      tier: "RARE"
    },
    PET_ITEM_LUCKY_CLOVER: {
      name: "Lucky Clover",
      tier: "EPIC"
    },
    PET_ITEM_TEXTBOOK: {
      name: "Textbook",
      tier: "LEGENDARY"
    },
    PET_ITEM_SADDLE: {
      name: "Saddle",
      tier: "UNCOMMON"
    },
    PET_ITEM_EXP_SHARE: {
      name: "Exp Share",
      tier: "EPIC"
    },
    PET_ITEM_TIER_BOOST: {
      name: "Tier Boost",
      tier: "LEGENDARY"
    },
    PET_ITEM_COMBAT_SKILL_BOOST_COMMON: {
      name: "Combat Exp Boost",
      tier: "COMMON"
    },
    PET_ITEM_COMBAT_SKILL_BOOST_UNCOMMON: {
      name: "Combat Exp Boost",
      tier: "UNCOMMON"
    },
    PET_ITEM_COMBAT_SKILL_BOOST_RARE: {
      name: "Combat Exp Boost",
      tier: "RARE"
    },
    PET_ITEM_COMBAT_SKILL_BOOST_EPIC: {
      name: "Combat Exp Boost",
      tier: "EPIC"
    },
    PET_ITEM_FISHING_SKILL_BOOST_COMMON: {
      name: "Fishing Exp Boost",
      tier: "COMMON"
    },
    PET_ITEM_FISHING_SKILL_BOOST_UNCOMMON: {
      name: "Fishing Exp Boost",
      tier: "UNCOMMON"
    },
    PET_ITEM_FISHING_SKILL_BOOST_RARE: {
      name: "Fishing Exp Boost",
      tier: "RARE"
    },
    PET_ITEM_FISHING_SKILL_BOOST_EPIC: {
      name: "Fishing Exp Boost",
      tier: "EPIC"
    },
    PET_ITEM_FORAGING_SKILL_BOOST_COMMON: {
      name: "Foraging Exp Boost",
      tier: "COMMON"
    },
    PET_ITEM_FORAGING_SKILL_BOOST_UNCOMMON: {
      name: "Foraging Exp Boost",
      tier: "UNCOMMON"
    },
    PET_ITEM_FORAGING_SKILL_BOOST_RARE: {
      name: "Foraging Exp Boost",
      tier: "RARE"
    },
    PET_ITEM_FORAGING_SKILL_BOOST_EPIC: {
      name: "Foraging Exp Boost",
      tier: "EPIC"
    },
    PET_ITEM_MINING_SKILL_BOOST_COMMON: {
      name: "Mining Exp Boost",
      tier: "COMMON"
    },
    PET_ITEM_MINING_SKILL_BOOST_UNCOMMON: {
      name: "Mining Exp Boost",
      tier: "UNCOMMON"
    },
    PET_ITEM_MINING_SKILL_BOOST_RARE: {
      name: "Mining Exp Boost",
      tier: "RARE"
    },
    PET_ITEM_MINING_SKILL_BOOST_EPIC: {
      name: "Mining Exp Boost",
      tier: "EPIC"
    },
    PET_ITEM_FARMING_SKILL_BOOST_COMMON: {
      name: "Farming Exp Boost",
      tier: "COMMON"
    },
    PET_ITEM_FARMING_SKILL_BOOST_UNCOMMON: {
      name: "Farming Exp Boost",
      tier: "UNCOMMON"
    },
    PET_ITEM_FARMING_SKILL_BOOST_RARE: {
      name: "Farming Exp Boost",
      tier: "RARE"
    },
    PET_ITEM_FARMING_SKILL_BOOST_EPIC: {
      name: "Farming Exp Boost",
      tier: "EPIC"
    },
    REINFORCED_SCALES: {
      name: "Reinforced Scales",
      tier: "RARE"
    },
    GOLD_CLAWS: {
      name: "Gold Claws",
      tier: "UNCOMMON"
    },
    ALL_SKILLS_SUPER_BOOST: {
      name: "All Skills Exp Super-Boost",
      tier: "COMMON"
    },
    BIGGER_TEETH: {
      name: "Bigger Teeth",
      tier: "UNCOMMON"
    },
    SERRATED_CLAWS: {
      name: "Serrated Claws",
      tier: "RARE"
    },
    WASHED_UP_SOUVENIR: {
      name: "Washed-up Souvenir",
      tier: "LEGENDARY"
    },
    ANTIQUE_REMEDIES: {
      name: "Antique Remedies",
      tier: "EPIC"
    },
    CROCHET_TIGER_PLUSHIE: {
      name: "Crochet Tiger Plushie",
      tier: "EPIC"
    },
    DWARF_TURTLE_SHELMET: {
      name: "Dwarf Turtle Shelmet",
      tier: "RARE"
    },
    PET_ITEM_VAMPIRE_FANG: {
      name: "Vampire Fang",
      tier: "LEGENDARY"
    },
    PET_ITEM_SPOOKY_CUPCAKE: {
      name: "Spooky Cupcake",
      tier: "UNCOMMON"
    },
    MINOS_RELIC: {
      name: "Minos Relic",
      tier: "EPIC"
    },
    PET_ITEM_TOY_JERRY: {
      name: "Jerry 3D Glasses",
      tier: "LEGENDARY"
    },
    REAPER_GEM: {
      name: "Reaper Gem",
      tier: "LEGENDARY"
    },
    PET_ITEM_FLYING_PIG: {
      name: "Flying Pig",
      tier: "UNCOMMON"
    },
    PET_ITEM_QUICK_CLAW: {
      name: "Quick Claw",
      tier: "RARE"
    },
};