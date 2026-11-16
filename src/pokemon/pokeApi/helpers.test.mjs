import { convertHeightIntoFeetInches } from "./helpers.mjs";

describe("convertHeightIntoFeetInches", () => {
    test("rounds 11.8 inches up to 1 foot 0 inches", () => {
        expect(convertHeightIntoFeetInches(3)).toEqual({ feet: 1, inches: 0 });
    });

    test("splits 17 decimeters into 5 feet 7 inches", () => {
        expect(convertHeightIntoFeetInches(17)).toEqual({ feet: 5, inches: 7 });
    });
});
