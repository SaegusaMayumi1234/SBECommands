//CREDIT: https://github.com/Altpapier/SkyHelperAPI


const xp_tables = require('../Constants/xp_tables');

exports.getSlayers = function getSlayers(uuid, profile) {
	const profileData = profile.members[uuid];
	const res = {
		total_experience: 0,
		total_coins_spent: 0,
		zombie: calcSlayer('zombie', profileData.slayer_bosses?.['zombie']),
		spider: calcSlayer('spider', profileData.slayer_bosses?.['spider']),
		wolf: calcSlayer('wolf', profileData.slayer_bosses?.['wolf']),
		enderman: calcSlayer('enderman', profileData.slayer_bosses?.['enderman']),
		blaze: calcSlayer('blaze', profileData.slayer_bosses?.['blaze']),
	};
	res.total_experience = getTotalExperience(res);
	res.total_coins_spent = getTotalCoinsSpent(res);
	return res;
};

function calcSlayer(slayer, slayerData) {
	const experience = slayerData?.xp || 0;
	if (experience <= 0) {
		return {
			xp: 0,
			level: 0,
			coins_spent: 0,
			xpForNext: xp_tables.slayers[slayer][0],
			progress: 0,
			kills: {

			},
		};
	}

	let level = 0;
	let coins_spent = 0;
	let xpForNext = 0;
	let progress = 0;
	const maxLevel = 9;

	for (let i = 0; i < xp_tables.slayers[slayer].length; i++) {
		if (xp_tables.slayers[slayer][i] <= experience) {
			level = i + 1;
		}
	}

	if (level < maxLevel) {
		xpForNext = Math.ceil(xp_tables.slayers[slayer][level]);
		progress = Math.max(0, Math.min(experience / xpForNext, 1));
	} else {
		xpForNext = 0;
		progress = 0;
	}


	const kills = {};
	if (slayer === 'zombie') kills[5] = 0;
	for (let i = 0; i < Object.keys(slayerData).length; i++) {
		if (Object.keys(slayerData)[i].startsWith('boss_kills_tier_')) {
			// This indeed looks pretty bad I know... (kills[boss tier number])
			kills[Number(Object.keys(slayerData)[i].charAt(Object.keys(slayerData)[i].length - 1)) + 1] = Object.values(slayerData)[i];
		}
	}

	coins_spent += (kills['1'] || 0) * 100;
	coins_spent += (kills['2'] || 0) * 2000;
	coins_spent += (kills['3'] || 0) * 10000;
	coins_spent += (kills['4'] || 0) * 50000;
	coins_spent += (kills['5'] || 0) * 100000;

	return {
		xp: experience,
		level,
		coins_spent,
		xpForNext,
		progress,
		kills,
	};
}

function getTotalExperience(slayers) {
	return (
		slayers.zombie.xp +
        slayers.spider.xp +
        slayers.wolf.xp +
        slayers.enderman.xp +
        slayers.blaze.xp
	);
}

function getTotalCoinsSpent(slayers) {
	return (
		slayers.zombie.coins_spent +
        slayers.spider.coins_spent +
        slayers.wolf.coins_spent +
        slayers.enderman.coins_spent +
        slayers.blaze.coins_spent
	);
}