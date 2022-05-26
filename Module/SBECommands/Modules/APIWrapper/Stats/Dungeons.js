//CREDIT: https://github.com/Altpapier/SkyHelperAPI


const xp_tables = require('../Constants/xp_tables');
const { toTitleCase } = require('../../../Utils/Utils');

exports.getDungeons = function getDungeons(uuid, profile, player) {
	try {
		const dungeons = profile.members[uuid].dungeons;
		const catacombs = dungeons.dungeon_types.catacombs;
		const master_catacombs = dungeons.dungeon_types.master_catacombs;

		const floors = {};
		const available_floors = ['0', '1', '2', '3', '4', '5', '6', '7'];

		for (const floor in available_floors) {
			let floor_name = 'entrance';
			if (floor != 0) floor_name = `floor_${floor}`;
			floors[floor_name] = {
				times_played: catacombs.times_played ? catacombs.times_played[floor] || 0 : 0,
				completions: catacombs.tier_completions ? catacombs.tier_completions[floor] || 0 : 0,
				best_score: { score: catacombs?.best_score ? catacombs.best_score[floor] || 0 : 0, name: getScoreName(catacombs.best_score ? catacombs.best_score[floor] || 0 : 0) },
				fastest: catacombs.fastest_time ? catacombs.fastest_time[floor] || 0 : 0,
				fastest_s: catacombs.fastest_time_s ? catacombs.fastest_time_s[floor] || 0 : 0,
				fastest_s_plus: catacombs.fastest_time_s_plus ? catacombs.fastest_time_s_plus[floor] || 0 : 0,
				mobs_killed: catacombs.mobs_killed ? catacombs.mobs_killed[floor] || 0 : 0,
			};
		}

		const master_mode_floors = {};
		const master_available_floors = ['0', '1', '2', '3', '4', '5', '6', '7'];

		for (const floor in master_available_floors) {
			if (floor != 0) {
				master_mode_floors[`floor_${floor}`] = {
					times_played: master_catacombs.times_played ? master_catacombs.times_played[floor] || 0 : 0,
					completions: master_catacombs.tier_completions ? master_catacombs.tier_completions[floor] || 0 : 0,
					best_score: { score: master_catacombs.best_score ? master_catacombs.best_score[floor] || 0 : 0, name: getScoreName(master_catacombs.best_score ? master_catacombs.best_score[floor] || 0 : 0) },
					fastest: master_catacombs.fastest_time ? master_catacombs.fastest_time[floor] || 0 : 0,
					fastest_s: master_catacombs.fastest_time_s ? master_catacombs.fastest_time_s[floor] || 0 : 0,
					fastest_s_plus: master_catacombs.fastest_time_s_plus ? master_catacombs.fastest_time_s_plus[floor] || 0 : 0,
					mobs_killed: master_catacombs.mobs_killed ? master_catacombs.mobs_killed[floor] || 0 : 0,
				};
			}
		}
		let highest_tier_completed = null;
		if (catacombs) {
			if (master_catacombs.highest_tier_completed) highest_tier_completed = 'M' + master_catacombs.highest_tier_completed;
			else if (catacombs.highest_tier_completed) highest_tier_completed = 'F' + catacombs.highest_tier_completed;
		}

		return {
			selected_class: toTitleCase(dungeons.selected_dungeon_class),
			secrets_found: player.dungeons.secrets,
			classes: {
				healer: calcSkill('dungeoneering', dungeons.player_classes.healer.experience || 0),
				mage: calcSkill('dungeoneering', dungeons.player_classes.mage.experience || 0),
				berserk: calcSkill('dungeoneering', dungeons.player_classes.berserk.experience || 0),
				archer: calcSkill('dungeoneering', dungeons.player_classes.archer.experience || 0),
				tank: calcSkill('dungeoneering', dungeons.player_classes.tank.experience || 0),
			},
			catacombs: {
				skill: calcSkill('dungeoneering', dungeons.dungeon_types.catacombs.experience || 0),
				highest_tier_completed,
				floors,
				master_mode_floors,
			},
			perks: profile.members[uuid]?.perks || null
		};
	} catch (err) {
		return null;
	}
};

function calcSkill(skill, experience) {
	let table = 'normal';
	if (skill === 'runecrafting' || skill === 'social') table = 'runecrafting';
	if (skill === 'dungeoneering') table = 'catacombs';

	if (experience <= 0) {
		return {
			xp: 0,
			level: 0,
			xpCurrent: 0,
			xpForNext: xp_tables[table][0],
			progress: 0,
		};
	}

	let xp = 0;
	let level = 0;
	let xpForNext = 0;
	let progress = 0;
	let maxLevel = 0;

	if (xp_tables.max_levels[skill]) maxLevel = xp_tables.max_levels[skill];

	for (let i = 1; i <= maxLevel; i++) {
		xp += xp_tables[table][i - 1];

		if (xp > experience) {
			xp -= xp_tables[table][i - 1];
		} else if (i <= maxLevel) {level = i;}
	}

	const xpCurrent = Math.floor(experience - xp);

	if (level < maxLevel) {
		xpForNext = Math.ceil(xp_tables[table][level]);
		progress = Math.max(0, Math.min(xpCurrent / xpForNext, 1));
	} else {
		xpForNext = 0;
		progress = 0;
	}


	level += progress !== 1 ? progress : 0;
	xp = experience;
	return {
		xp,
		level,
		xpCurrent,
		xpForNext,
		progress,
	};
}

function getScoreName(score) {
	// CREDIT: https://github.com/Senither/hypixel-skyblock-facade
	let name = 'C';
	if (score >= 300) {
		name = 'S+';
	} else if (score >= 270) {
		name = 'S';
	} else if (score >= 240) {
		name = 'A';
	} else if (score >= 175) {
		name = 'B';
	}
	return name;
}