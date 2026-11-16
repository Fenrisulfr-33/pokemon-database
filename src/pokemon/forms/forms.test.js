import fs from "fs";
import path from "path";

import readJsonDir from "#genericFunctions/files/readJsonDir.js";
import { FORMS_DIR } from "#helpers/paths.js";
import {
    findGenderedNotSummingTo100,
    findGenderedWithNullRatio,
    findGenderlessWithRatio,
} from "#helpers/testHelpers.js";

function readFormEntries() {
    return fs.readdirSync(FORMS_DIR, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .flatMap((folder) => readJsonDir(path.join(FORMS_DIR, folder.name)));
}

const formsWithGender = readFormEntries()
    .filter((form) => form.gender !== undefined);

describe("forms gender", () => {
    test("forms that aren't genderless have no null male or female", () => {
        expect(findGenderedWithNullRatio(formsWithGender)).toEqual([]);
    });

    test("male and female add up to 100 when not genderless", () => {
        expect(findGenderedNotSummingTo100(formsWithGender)).toEqual([]);
    });

    test("genderless forms have null male and female", () => {
        expect(findGenderlessWithRatio(formsWithGender)).toEqual([]);
    });
});
