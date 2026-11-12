import Ajv from "ajv";

import { getMoves } from "#helpers/getMoves.js";
import schema from "./schema.json" with { type: "json" };

const validate = new Ajv().compile(schema);
const tackle = getMoves().find((move) => move.key === "tackle");

function withChange(applyChange) {
    const move = structuredClone(tackle);
    applyChange(move);
    return move;
}

const REJECTED = {
    "a capitalized type": (move) => { move.type = "Normal"; },
    "unknown as the current type": (move) => { move.type = "unknown"; },
    "a capitalized category": (move) => { move.category = "Physical"; },
    "the old contest name Beautiful": (move) => { move.contest = "Beautiful"; },
    "a null contact": (move) => { move.contact = null; },
    "a string contact": (move) => { move.contact = "No"; },
    "a missing english name": (move) => { delete move.name.english; },
    "an empty name": (move) => { move.name.french = ""; },
    "an uppercase key": (move) => { move.key = "Tackle"; },
    "0 pp": (move) => { move.pp = 0; },
    "accuracy over 100": (move) => { move.accuracy = 101; },
    "priority over 5": (move) => { move.priority = 6; },
    "generation 10": (move) => { move.generation = 10; },
    "an unknown target": (move) => { move.target = "everyone"; },
    "an extra field": (move) => { move.description = {}; },
    "the old changes array": (move) => { move.changes = []; },
    "an empty change": (move) => { move.changes.xy = {}; },
    "an unknown change field": (move) => { move.changes.xy = { target: 1 }; },
    "empty flavor text": (move) => { move.flavorText.english.gs = ""; },
    "flavor text keyed by game only": (move) => {
        move.flavorText = { gs: "A full-body charge attack." };
    },
    "a missing meta": (move) => { delete move.meta; },
    "an unknown meta category": (move) => { move.meta.category = "boost"; },
    "a meta url object": (move) => {
        move.meta.ailment = { name: "none", url: "https://pokeapi.co" };
    },
    "an ailment chance over 100": (move) => { move.meta.ailmentChance = 101; },
    "a missing effect text": (move) => { delete move.effect.shortEffect; },
};

const ACCEPTED = {
    "an unchanged entry": () => {},
    "a null meta": (move) => { move.meta = null; },
    "null power and accuracy": (move) => {
        move.power = null;
        move.accuracy = null;
    },
    "a null contest": (move) => { move.contest = null; },
    "unknown as a past type": (move) => {
        move.changes.bw = { type: "unknown" };
    },
    "a past effect": (move) => {
        move.changes.gs = { effect: { full: "Old.", shortEffect: "Old." } };
    },
    "empty effect text": (move) => {
        move.effect = { full: "", shortEffect: "" };
    },
    "a language not in the old schema": (move) => {
        move.name["latin-american-spanish"] = "Tacleada";
    },
};

describe("moves schema", () => {
    test.each(Object.entries(REJECTED))("rejects %s", (label, applyChange) => {
        expect(validate(withChange(applyChange))).toBe(false);
    });

    test.each(Object.entries(ACCEPTED))("accepts %s", (label, applyChange) => {
        expect(validate(withChange(applyChange))).toBe(true);
    });
});
