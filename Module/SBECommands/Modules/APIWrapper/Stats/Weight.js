//CREDIT: https://github.com/Antonio32A/lilyweight


const { skillRatioWeight: srw, 
    skillMaxXP, 
    skillOverflowMultipliers, 
    skillFactors, 
    skillOverall, 
    skillNames, 
    dungeonCompletionWorth, 
    dungeonCompletionBuffs, 
    dungeonExperienceTable, 
    dungeonMaxXP, 
    dungeonOverall, 
    slayerDeprecationScaling, 
    skillXPPerLevel 
} = require('../Constants/constantsLily');

exports.getWeight = function getWeight(profile, achievements) {
	const slayerXP = [
        profile.slayer_bosses?.zombie?.xp ?? 0,
        profile.slayer_bosses?.spider?.xp ?? 0,
        profile.slayer_bosses?.wolf?.xp ?? 0,
        profile.slayer_bosses?.enderman?.xp ?? 0,
        profile.slayer_bosses?.blaze?.xp ?? 0
    ];

    const cataCompl = profile.dungeons?.dungeon_types?.catacombs?.tier_completions ?? {};
    const mCataCompl = profile.dungeons?.dungeon_types?.master_catacombs?.tier_completions ?? {};
    const cataXP = profile.dungeons?.dungeon_types?.catacombs?.experience ?? 0;

    let skillLevels;
    let skillXP;
    if (!profile.experience_skill_mining) {
        // skill API is off
        skillLevels = Object.values(skillNames).map(i => achievements?.[i] ?? 0);
        skillXP = skillLevels.map(getXpFromLevel);
    } else {
        skillXP = Object.keys(skillNames).map(i => profile[i]);
        skillLevels = skillXP.map(getLevelFromXP);
    }

    const lilyweight = getLilyWeight(skillLevels, skillXP, cataCompl, mCataCompl, cataXP, slayerXP);
	return lilyweight
}

//utils
const getLevelFromXP = xp => {
    let xpAdded = 0;
    for (let i = 0; i < 61; i++) {
        xpAdded += skillXPPerLevel[i];
        if (xp < xpAdded)
            return Math.floor((i - 1) + (xp - (xpAdded - skillXPPerLevel[i])) / skillXPPerLevel[i]);
    }

    return 60;
};

const getXpFromLevel = level => {
    let xpAdded = 0;
    for (let i = 0; i < level + 1; i++)
        xpAdded += skillXPPerLevel[i];

    return xpAdded;
};

//getLilyWeightRaw
function getLilyWeight(skillLevels, skillXP, cataCompl, mCataCompl, cataXP, slayerXP) {
    const [skillWeight, overflowWeight] = getSkillWeight(skillLevels, skillXP);
    const [cataComplWeight, masterCataComplWeight] = getDungeonCompletionWeight(cataCompl, mCataCompl);
    const cataExpWeight = getDungeonExpWeight(cataXP);
    const slayerWeight = getSlayerWeight(slayerXP);

    return {
        total: (skillWeight + overflowWeight + cataComplWeight + masterCataComplWeight + cataExpWeight + slayerWeight),
        skill: {
            base: skillWeight,
            overflow: overflowWeight
        },
        catacombs: {
            completion: {
                base: cataComplWeight,
                master: masterCataComplWeight
            },
            experience: cataExpWeight
        },
        slayer: slayerWeight
    };
}


//dungeonCompWeight
let max1000 = 0;
let mMax1000 = 0;
for (let i = 0; i < dungeonCompletionWorth.length; i++) {
    if (i < 8) max1000 += dungeonCompletionWorth[i];
    else mMax1000 += dungeonCompletionWorth[i];
}

max1000 *= 1000;
mMax1000 *= 1000;

const getDungeonCompletionWeight = (cataCompl, mCataCompl) => {
    let upperBound = 1500;
    let score = 0;

    Object.entries(cataCompl).forEach(([floor, amount]) => {
        let excess = 0;
        if (amount > 1000) {
            excess = amount - 1000;
            amount = 1000;
        }

        let floorScore = amount * dungeonCompletionWorth[floor];
        if (excess > 0)
            floorScore *= Math.log(excess / 1000 + 1) / Math.log(7.5) + 1;
        score += floorScore;
    });

    const rating = score / max1000 * upperBound * 2;

    Object.entries(mCataCompl).forEach(([floor, amount]) => {
        if (Object.keys(dungeonCompletionBuffs).includes(`${floor}`)) {
            const threshold = 20;
            if (amount >= threshold) upperBound += dungeonCompletionBuffs[floor];
            else upperBound += (dungeonCompletionBuffs[floor] * ((amount / threshold) ** 1.840896416));
        }
    });

    let masterScore = 0;
    Object.entries(mCataCompl).forEach(([floor, amount]) => {
        let excess = 0;
        if (amount > 1000) {
            excess = amount - 1000;
            amount = 1000;
        }

        let floorScore = amount * dungeonCompletionWorth[7 + Number(floor)];
        if (excess > 0)
            floorScore *= (Math.log((excess / 1000) + 1) / Math.log(6)) + 1;
        masterScore += floorScore;
    });

    const masterRating = (masterScore / mMax1000) * upperBound * 2;
    return [rating, masterRating];
};

//dungeonExpWeight
const getDungeonExpWeight = cataXP => {
    let level = -1;
    for (let i = 0; i < dungeonExperienceTable.length; i++) {
        if (cataXP >= dungeonExperienceTable[i]) level++;
        else break;
    }

    if (level !== 50) {
        const nextLvlXP = dungeonExperienceTable[level + 1] - dungeonExperienceTable[level];
        const progress = Math.floor((cataXP - dungeonExperienceTable[level]) / nextLvlXP * 1000) / 1000;
        level += progress;
    }

    let n;
    let extra;
    if (cataXP < dungeonMaxXP)
        n = 0.2 * ((level / 50) ** 1.538679118869934);
    else {
        let part = 142452410;
        extra = (500 * (((cataXP - dungeonMaxXP) / part) ** (1/1.781925776625157)));
    }

    if (level !== 0) {
        if (cataXP < dungeonMaxXP) {
            return dungeonOverall * (((1.18340401286164044 ** (level + 1)) - 1.05994990217254) * (1 + n));
        } else {
            return (4100 + extra) * 2;
        }
    } else {
        return 0;
    }
};

//skillWeight
const effectiveXP = (xp, factor) => {
    if (xp < skillMaxXP)
        return xp;
    else {
        let remainingXP = xp;
        let z = 0;
        for (let i = 0; i <= Math.trunc(xp / skillMaxXP); i++) {
            if (remainingXP >= skillMaxXP) {
                remainingXP -= skillMaxXP;
                z += (factor ** i);
            }
        }
        return (z * skillMaxXP);
    }
};

const getSkillWeight = (skillLevels, skillXP) => {
    let skillAvg = 0;
    skillLevels.forEach(level => skillAvg += level);
    skillAvg /= skillLevels.length;

    const n = 12 * (((skillAvg / 60) ** 2.44780217148309));
    const r2 = (2 ** (1 / 2));

    let temp = [];
    for (let i = 0; i < skillLevels.length; i++) {
        temp.push(
            n * srw[Object.keys(srw)[i]][skillLevels[i]] * srw[Object.keys(srw)[i]][Object.keys(srw[Object.keys(srw)[i]]).length - 1] +
            srw[Object.keys(srw)[i]][Object.keys(srw[Object.keys(srw)[i]]).length - 1] * ((skillLevels[i] / 60) ** r2)
        );
    }

    let skillRating = 0;
    temp.forEach(thingy => {
        skillRating += thingy;
    });
    skillRating *= skillOverall;

    let overflowRating = 0;
    for (let i = 0; i < skillXP.length; i++) {
        if (skillXP[i] > skillMaxXP) {
            const factor = skillFactors[i];
            const effectiveOver = effectiveXP(skillXP[i] - skillMaxXP, factor);
            const rating = effectiveOver / skillMaxXP;
            const overflowMult = skillOverflowMultipliers[i];
            const t = rating * overflowMult;
            if (t > 0)
                overflowRating += skillOverall * (rating * overflowMult);
        }
    }

    return [skillRating, overflowRating];
};

//slayerWeight
const getSlayerScore = exp => {
    // thank you Lucy -Desco
    const d = exp / 100000;
    if (exp >= 6416) {
        const D = (d - (3 ** (-5 / 2))) * (d + (3 ** (-5 / 2)));
        const u = Math.cbrt(3 * (d + Math.sqrt(D)));
        const v = Math.cbrt(3 * (d - Math.sqrt(D)));
        return u + v - 1;
    } else {
        return Math.sqrt(4 / 3) * Math.cos(Math.acos(d * (3 ** (5 / 2))) / 3) - 1;
    }
};

const getEffectiveXP = (score, ind) => {
    const scaling = slayerDeprecationScaling[ind];
    let total = 0;
    for (let i = 1; i <= score; i++)
        total += ((i ** 2) + i) * (scaling ** i);

    total = Math.round((1000000 * total * (0.05 / scaling)) * 100) / 100;
    return total;
};

const getActualXP = score =>
    (((score ** 3) / 6) + ((score ** 2) / 2) + (score / 3)) * 100000;

const getSlayerValue = (xp, i) => {
    const score = Math.floor(getSlayerScore(xp));
    const effectiveXP = getEffectiveXP(score, i);
    const actualXP = getActualXP(score);
    const distance = xp - actualXP;
    const effectiveDistance = distance * (slayerDeprecationScaling[i] ** score);
    return effectiveXP + effectiveDistance;
};

const getSlayerWeight = slayerXP => {
    const zombie = getSlayerValue(slayerXP[0], 0);
    const spider = getSlayerValue(slayerXP[1], 1);
    const wolf = getSlayerValue(slayerXP[2], 2);
    const enderman = getSlayerValue(slayerXP[3], 3);
    const blaze = getSlayerValue(slayerXP[4], 4)

    const individual = zombie / 8390.64 + spider / 7019.57 + wolf / 2982.06 + enderman / 1118.81 + blaze / 751.281;
    const extra = (slayerXP[0] + 1.6 * slayerXP[1] + 3.6 * slayerXP[2] + 10 * slayerXP[3] + 15 * slayerXP[4]) / 1000000;
    return 2 * (individual + extra);
};