export const getRoleColorByJob = (jobAbbrev: string) => {
    switch (jobAbbrev) {
        // Heals
        case 'WHM':
        case 'SGE':
        case 'SCH':
        case 'AST':
            return '#346624';
        // Tanks
        case 'GNB':
        case 'PLD':
        case 'DRK':
        case 'WAR':
            return '#2d3a80';
        // DPS
        case 'MCH':
        case 'SAM':
        case 'BLM':
        case 'DRG':
        case 'BRD':
        case 'DNC':
        case 'MNK':
        case 'NIN':
        case 'SMN':
        case 'RPR':
        case 'RDM':
            return '#732828';
        default:
            // Gatherer Crafter
            return '#808080';
    }
};
