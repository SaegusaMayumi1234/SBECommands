//CREDIT: https://github.com/Altpapier/SkyHelperAPI


const xp_tables = require('../Constants/xp_tables');

exports.getSkills = function getSkills(uuid, profile, player) {
	const profileData = profile.members[uuid];
	let skill_experience = {
		farming: profileData.experience_skill_farming || 0,
		mining: profileData.experience_skill_mining || 0,
		combat: profileData.experience_skill_combat || 0,
		foraging: profileData.experience_skill_foraging || 0,
		fishing: profileData.experience_skill_fishing || 0,
		enchanting: profileData.experience_skill_enchanting || 0,
		alchemy: profileData.experience_skill_alchemy || 0,
		taming: profileData.experience_skill_taming || 0,
		carpentry: profileData.experience_skill_carpentry || 0,
		runecrafting: profileData.experience_skill_runecrafting || 0,
		social: profileData.experience_skill_social || 0,
	};
	let totalExp = 0;
	Object.keys(skill_experience).forEach(skill => {
		totalExp += skill_experience[skill];
	});

	if (totalExp == 0) {
		skill_experience = {
			farming: player.skills.farming != undefined ? getExperienceFromLevel(player.skills.farming) : 0,
			mining: player.skills.mining != undefined ? getExperienceFromLevel(player.skills.mining) : 0,
			combat: player.skills.combat != undefined ? getExperienceFromLevel(player.skills.combat) : 0,
			foraging: player.skills.foraging != undefined ? getExperienceFromLevel(player.skills.foraging) : 0,
			fishing: player.skills.fishing != undefined ? getExperienceFromLevel(player.skills.fishing) : 0,
			enchanting: player.skills.enchanting != undefined ? getExperienceFromLevel(player.skills.enchanting) : 0,
			alchemy: player.skills.alchemy != undefined ? getExperienceFromLevel(player.skills.alchemy) : 0,
			taming: player.skills.taming != undefined ? getExperienceFromLevel(player.skills.taming) : 0,
			carpentry: 0,
			runecrafting: 0,
			social: 0,
		};
	}

	const res = {
		apiEnabled: totalExp == 0 ? false : true,
		average_skills: null,
		farming: calcSkill('farming', parseInt(skill_experience['farming'])),
		mining: calcSkill('mining', skill_experience['mining']),
		combat: calcSkill('combat', skill_experience['combat']),
		foraging: calcSkill('foraging', skill_experience['foraging']),
		fishing: calcSkill('fishing', skill_experience['fishing']),
		enchanting: calcSkill('enchanting', skill_experience['enchanting']),
		alchemy: calcSkill('alchemy', skill_experience['alchemy']),
		taming: calcSkill('taming', skill_experience['taming']),
		carpentry: calcSkill('carpentry', skill_experience['carpentry']),
		runecrafting: calcSkill('runecrafting', skill_experience['runecrafting']),
		social: calcSkill('social', skill_experience['social']),
	};
	res.average_skills = getAverageSkills(res);
	return res;
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

function getExperienceFromLevel(level) {
	let totalRequiredExperience = 0;
	for (let i = 0; i < Math.min(level, xp_tables.normal.length); i++) {
		totalRequiredExperience += xp_tables.normal[i];
	}
	return totalRequiredExperience;
}

function getAverageSkills(skills) {
	return (
		(
			skills.farming.level +
            skills.mining.level +
            skills.combat.level +
            skills.foraging.level +
            skills.fishing.level +
            skills.enchanting.level +
            skills.alchemy.level +
            skills.taming.level
		) / 8
	);
}