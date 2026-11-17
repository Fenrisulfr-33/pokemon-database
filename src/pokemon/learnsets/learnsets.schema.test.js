import Ajv from "ajv";

import schema from "./schema.json" with { type: "json" };

const validate = new Ajv().compile(schema);
const bulbasaur = {
    _id: 1,
    rb: {
        lv: [[1, 45], [7, 73]],
        tm: [[3, 14]],
        hm: [[1, 15]],
    },
    usum: {
        eg: [[204]],
        pe: [["lv", 81]],
        to: [[3, "tu", 34]],
        sp: [["Various events", 19]],
    },
};

function withChange(applyChange) {
    const learnset = structuredClone(bulbasaur);
    applyChange(learnset);
    return learnset;
}

const REJECTED = {
    "a missing _id": (learnset) => { delete learnset._id; },
    "no games": (learnset) => {
        delete learnset.rb;
        delete learnset.usum;
    },
    "an unknown game": (learnset) => { learnset.gen10 = { lv: [[1, 1]] }; },
    "an empty game": (learnset) => { learnset.rb = {}; },
    "an unknown method": (learnset) => { learnset.rb.xx = [[1]]; },
    "an empty method": (learnset) => { learnset.rb.tm = []; },
    "a level of 0": (learnset) => { learnset.rb.lv[0][0] = 0; },
    "a null level": (learnset) => { learnset.rb.lv[0][0] = null; },
    "a missing level": (learnset) => { learnset.rb.lv[0] = [45]; },
    "a string moveId": (learnset) => { learnset.rb.lv[0][1] = "45"; },
    "a moveId of 0": (learnset) => { learnset.usum.eg[0] = [0]; },
    "an HM 0": (learnset) => { learnset.rb.hm[0][0] = 0; },
    "an extra tuple value": (learnset) => { learnset.usum.eg[0] = [1, 204]; },
    "an unknown pre-evolution method": (learnset) => {
        learnset.usum.pe[0][0] = "level";
    },
    "a transfer generation of 10": (learnset) => {
        learnset.usum.to[0][0] = 10;
    },
    "an empty special note": (learnset) => { learnset.usum.sp[0][0] = ""; },
};

const ACCEPTED = {
    "an unchanged entry": () => {},
    "a form _id": (learnset) => { learnset._id = 3.01; },
    "TM00": (learnset) => { learnset.rb.tm[0][0] = 0; },
    "TR00": (learnset) => { learnset.usum.tr = [[0, 14]]; },
    "a single game": (learnset) => { delete learnset.usum; },
};

describe("learnsets schema", () => {
    test.each(Object.entries(REJECTED))("rejects %s", (label, applyChange) => {
        expect(validate(withChange(applyChange))).toBe(false);
    });

    test.each(Object.entries(ACCEPTED))("accepts %s", (label, applyChange) => {
        expect(validate(withChange(applyChange))).toBe(true);
    });
});
