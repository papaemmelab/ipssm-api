"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toString = exports.italicizeGeneNames = exports.round = exports.range = void 0;
// Useful utilities
const genes_js_1 = require("./genes.js");
const range = (start, stop, step = 1) => {
    return [...Array(stop - start).keys()]
        .filter((i) => !(i % Math.round(step)))
        .map((v) => start + v);
};
exports.range = range;
const round = (value, digits = 4) => Math.round(value * Math.pow(10, digits)) / Math.pow(10, digits);
exports.round = round;
const italicizeGeneNames = (value) => {
    const genes = [
        ...genes_js_1.genesMain,
        ...genes_js_1.genesRes,
        'MLL',
        'FLT3',
        'KMT2A',
        'TP53',
    ].reverse();
    let italicized = value;
    genes.forEach((gene) => (italicized = italicized.replace(gene, `<i>${gene}</i>`)));
    return italicized;
};
exports.italicizeGeneNames = italicizeGeneNames;
const toString = (value) => {
    if (value === null || value === undefined) {
        return 'NA';
    }
    return value;
};
exports.toString = toString;
