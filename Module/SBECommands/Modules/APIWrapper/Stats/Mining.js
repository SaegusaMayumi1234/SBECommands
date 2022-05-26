//CREDIT: https://github.com/Altpapier/SkyHelperAPI


const { perks, forgeItemTimes, quick_forge_multiplier } = require('../Constants/mining');
const { toTitleCase } = require('../../../Utils/Utils');
const xp_tables = require('../Constants/xp_tables');

exports.getMining = function getMining(uuid, profileData) {
	const profile = profileData.members[uuid];
	const mining_stats = profile?.mining_core;
	const player_perks = [];
	const disabled_perks = [];

	const perksArr = Object.keys(mining_stats?.nodes || {})
	perksArr.forEach(perk => {
		if (perk.startsWith('toggle_')) {
			disabled_perks.push(perk.substring(7))
		} else {
			const currentPerk = perks[perk];
			player_perks.push({ name: currentPerk.name, id: currentPerk.id, level: mining_stats.nodes[perk], maxLevel: currentPerk.max });
		}
	})

	/* for (let statue of mining_stats?.biomes?.dwarven.statues_placed || []) {
        statue = toTitleCase(statue)
        console.log(statue)
    }

    for (let part of mining_stats?.biomes?.precursor.parts_delivered || []) {
        part = toTitleCase(part, true)
        console.log(part)
    }*/

	// Check if player has the "Quick Forge" perk in the Heart of the Mountain and change the duration of the items in the forge accordingly
	/* if (mining_stats?.nodes?.forge_time) {
        for (const item of Object.keys(forgeItemTimes)) {
            const lessForgingTime = profile.mining_core.nodes.forge_time <= 19 ? (0.10 + (profile.mining_core.nodes.forge_time * 0.005)) : 0.30
            forgeItemTimes[item].duration = forgeItemTimes[item].duration - (forgeItemTimes[item].duration * lessForgingTime)
        }
    }*/

	// Forge Display
	const forge_api = profile.forge?.forge_processes || [];
	const forge = [];
	/*for (const forge_types of Object.values(forge_api)) {
		for (const item of Object.values(forge_types)) {
			if (item.id === 'PET') item.id = 'AMMONITE';
			let forge_multiplier = 1;
			if (mining_stats?.nodes?.forge_time) {
				forge_multiplier = quick_forge_multiplier[mining_stats?.nodes?.forge_time];
			}
			forge.push({ slot: item.slot, item: forgeItemTimes[item.id].name, id: item.id === 'AMMONITE' ? 'PET' : item.id, ending: Number((item.startTime + (forgeItemTimes[item.id].duration * forge_multiplier)).toFixed()), ended: item.startTime + (forgeItemTimes[item.id].duration * forge_multiplier) < Date.now() ? true : false });
		}
	}*/

	const completion = [];
	completion.push(mining_stats?.crystals?.jade_crystal?.total_placed || 0);
	completion.push(mining_stats?.crystals?.amber_crystal?.total_placed || 0);
	completion.push(mining_stats?.crystals?.sapphire_crystal?.total_placed || 0);
	completion.push(mining_stats?.crystals?.amethyst_crystal?.total_placed || 0);
	completion.push(mining_stats?.crystals?.topaz_crystal?.total_placed || 0);

	return {
		mithril_powder: { current: mining_stats?.powder_mithril_total || 0, total: (mining_stats?.powder_mithril_total || 0) + (mining_stats?.powder_spent_mithril || 0) },
		gemstone_powder: { current: mining_stats?.powder_gemstone_total || 0, total: (mining_stats?.powder_gemstone_total || 0) + (mining_stats?.powder_spent_gemstone || 0) },
		hotm_tree: {
			tokens: { current: mining_stats?.tokens || 0, total: mining_stats?.tokens || 0 + mining_stats?.tokens_spent || 0 },
			skill: calcSkill('hotm', mining_stats?.experience || 0),
			perks: player_perks,
			disabled_perks: disabled_perks,
			last_reset: mining_stats?.last_reset || null,
			pickaxe_ability: perks[mining_stats?.selected_pickaxe_ability]?.name || null,
		},
		crystal_hollows: {
			last_pass: mining_stats?.greater_mines_last_access || null,
			crystals: [
				{
					name: 'Jade Crystal',
					id: 'jade_crystal',
					total_placed: mining_stats?.crystals?.jade_crystal?.total_placed || 0,
					statues_placed: mining_stats?.biomes?.dwarven?.statues_placed || [],
					state: toTitleCase((mining_stats?.crystals?.jade_crystal?.state || 'Not Found').replace(/_/g, ' '), true),
				},
				{
					name: 'Amber Crystal',
					total_placed: mining_stats?.crystals?.amber_crystal?.total_placed || 0,
					king_quests_completed: mining_stats?.biomes?.goblin?.king_quests_completed || 0,
					state: toTitleCase((mining_stats?.crystals?.amber_crystal?.state || 'Not Found').replace(/_/g, ' '), true),
				},
				{
					name: 'Topaz Crystal',
					total_placed: mining_stats?.crystals?.topaz_crystal?.total_placed || 0,
					state: toTitleCase((mining_stats?.crystals?.topaz_crystal?.state || 'Not Found').replace(/_/g, ' '), true),
				},
				{
					name: 'Sapphire Crystal',
					total_placed: mining_stats?.crystals?.sapphire_crystal?.total_placed || 0,
					parts_delivered: mining_stats?.biomes?.precursor?.parts_delivered || [],
					state: toTitleCase((mining_stats?.crystals?.sapphire_crystal?.state || 'Not Found').replace(/_/g, ' '), true),
				},
				{
					name: 'Amethyst Crystal',
					total_placed: mining_stats?.crystals?.amethyst_crystal?.total_placed || 0,
					state: toTitleCase((mining_stats?.crystals?.amethyst_crystal?.state || 'Not Found').replace(/_/g, ' '), true),
				},
				{
					name: 'Jasper Crystal',
					total_placed: mining_stats?.crystals?.jasper_crystal?.total_placed || 0,
					state: toTitleCase((mining_stats?.crystals?.jasper_crystal?.state || 'Not Found').replace(/_/g, ' '), true),
				},
				{
					name: 'Ruby Crystal',
					total_placed: mining_stats?.crystals?.ruby_crystal?.total_placed || 0,
					state: toTitleCase((mining_stats?.crystals?.ruby_crystal?.state || 'Not Found').replace(/_/g, ' '), true),
				},
			],
			crystal_runs: Math.min(...completion),
		},
		forge,
	};
};

function toFixed(num, fixed) {
	const re = new RegExp('^-?\\d+(?:\.\\d{0,' + (fixed || -1) + '})?');
	return num.toString().match(re)[0];
}

function calcSkill(skill, experience) {
	let table = 'normal';
	if (skill === 'runecrafting' || skill === 'social') table = 'runecrafting';
	if (skill === 'dungeoneering') table = 'catacombs';
	if (skill === 'hotm') table = 'hotm'

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

function getHotM(experience) {
	let level = 0;
	const maxLevel = xp_tables.max_levels.hotm;
	const experienceGroup = xp_tables.hotm;
	for (const toRemove of experienceGroup) {
		experience -= toRemove;
		if (experience < 0) {
			return Math.min(level + (1 - (experience * -1) / toRemove), maxLevel);
		}
		level++;
	}
	return Math.min(level, maxLevel);
}