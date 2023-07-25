export function formatRank(data) {
    let name = data.displayname;
    let rank = '&7';
    if (data.newPackageRank === 'VIP') {
        rank = '&a[VIP] ';
    } else if (data.newPackageRank === 'VIP_PLUS') {
        rank = '&a[VIP&6+&a] ';
    } else if (data.newPackageRank === 'MVP') {
        rank = '&b[MVP] ';
    } else if (data.newPackageRank === 'MVP_PLUS') {
        if (data.rank === 'YOUTUBER') {
            rank = '&c[&fYOUTUBE&c] ';
        } else if (data.rank === 'ADMIN') {
            if (data.prefix !== undefined) {
                rank = '&c[OWNER] ';
            } else {
                rank = '&c[ADMIN] ';
            }
        } else if (data.rank === 'GAME_MASTER') {
            rank = '&2[GM] ';
        } else {
            let color = '&c';
            if (data.rankPlusColor === 'RED') {
                color = '&c';
            } else if (data.rankPlusColor === 'GOLD') {
                color = '&6';
            } else if (data.rankPlusColor === 'GREEN') {
                color = '&a';
            } else if (data.rankPlusColor === 'YELLOW') {
                color = '&e';
            } else if (data.rankPlusColor === 'LIGHT_PURPLE') {
                color = '&d';
            } else if (data.rankPlusColor === 'WHITE') {
                color = '&f';
            } else if (data.rankPlusColor === 'BLUE') {
                color = '&9';
            } else if (data.rankPlusColor === 'DARK_GREEN') {
                color = '&2';
            } else if (data.rankPlusColor === 'DARK_RED') {
                color = '&4';
            } else if (data.rankPlusColor === 'DARK_AQUA') {
                color = '&3';
            } else if (data.rankPlusColor === 'DARK_PURPLE') {
                color = '&5';
            } else if (data.rankPlusColor === 'DARK_GRAY') {
                color = '&8';
            } else if (data.rankPlusColor === 'BLACK') {
                color = '&0';
            } else if (data.rankPlusColor === 'DARK_BLUE') {
                color = '&1';
            }
            if (data.monthlyPackageRank === 'SUPERSTAR') {
                rank = `&6[MVP${color}++&6] `;
            } else {
                rank = `&b[MVP${color}+&b] `;
            }
        }
    }
    return rank + name;
}