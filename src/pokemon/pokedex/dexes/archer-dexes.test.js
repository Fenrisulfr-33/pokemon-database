import readJson from '../../../genericFunctions/files/readJson.js';
import { DEX_LENGTHS_KEYS } from '../../constants/DEX_LENGTHS.js';

const legendsZaDex = readJson('./dexes_objects/32-legends-za.json', import.meta.url);
const legendsZaLength = DEX_LENGTHS_KEYS.POKEMON_DEX_LEGEND_ZA;
const legendsZAMegaLength = 0;

describe('Legends ZA Dex validation', () => {
    test('Legends ZA dex should have correct length', () => {
        expect(legendsZaDex.length).toBe(legendsZaLength);
    });

    test('Legends ZA dex should be in order by dexNo', () => {
        for (let i = 1; i < legendsZaDex.length; i++) {
            const currentDexNo = legendsZaDex[i].dexNo;
            expect(currentDexNo).toBe(i);
        };
    });

    test('Legends ZA Mega dex should have correct length', () => {
        const megaEntries = legendsZaDex.filter(entry => entry.isMega);
        expect(megaEntries.length).toBe(legendsZAMegaLength);
    });
});