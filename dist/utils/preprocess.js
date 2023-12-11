"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.processInputs = void 0;
const betasRiskScore_js_1 = __importDefault(require("./betasRiskScore.js"));
const genes_js_1 = require("./genes.js");
/**
 * Calculate the residual genes weigth contribution to the IPPS-M score with missing values.
 * @param {(number | string)[]} patientRes
 *     one entry per residual gene with value 0/1/NA
 * @param {number} nRef
 *     number of residual mutated from the reference patient (eg. average)
 * @return {{ nResMean: number, nResWorst: number, nResBest: number }}
 *     The"generalized" number of mutated genes from residual list
 */
const calculateNResMissing = (patientRes, nRef = 0.388) => {
    // Number of missing genes
    const M = Object.values(patientRes).filter((value) => value === 'NA').length;
    // Number of sequenced genes
    const S = Object.values(patientRes).filter((value) => value !== 'NA').length;
    // Sum of mutated genes within S
    const Ns = Object.values(patientRes)
        .filter((value) => value !== 'NA')
        .reduce((sum, x) => sum + Number(x), 0);
    // Worst scenario: all missing are mutated
    const nResWorst = Math.min(Ns + M, 2);
    // Best scenario: none missing are mutated
    const nResBest = Math.min(Ns, 2);
    // Average scenario: generalized min(Nres,2)
    const nResMean = Math.min(Ns, 2) + Math.max(((2 - Ns) / 2) * (M / (S + M)) * nRef, 0);
    // formula for generalized min(Nres,2)
    return { nResMean, nResWorst, nResBest };
};
/**
 * Process inputs from user-based variable to model-based variables.
 * @param {Object} patientInput - user-input variables
 * @returns {Object} model-based variables
 */
const processInputs = (patientInput) => {
    var _a, _b;
    const processed = Object.assign({}, patientInput);
    // Construction of SF3B1 features i.e SF3B1_5q
    processed.SF3B1_5q =
        processed.SF3B1 !== 'NA'
            ? processed.SF3B1 === '1' &&
                processed.del5q === '1' &&
                processed.del7_7q === '0' &&
                processed.complex === '0'
                ? '1'
                : '0'
            : processed.del5q === '0'
                ? '0'
                : 'NA';
    processed.SF3B1_alpha =
        processed.SF3B1 !== 'NA' &&
            processed.SF3B1_5q !== 'NA' &&
            processed.SRSF2 !== 'NA' &&
            processed.STAG2 !== 'NA' &&
            processed.BCOR !== 'NA' &&
            processed.BCORL1 !== 'NA' &&
            processed.RUNX1 !== 'NA' &&
            processed.NRAS !== 'NA'
            ? processed.SF3B1 === '1' &&
                processed.SF3B1_5q === '0' &&
                processed.SRSF2 === '0' &&
                processed.STAG2 === '0' &&
                processed.BCOR === '0' &&
                processed.BCORL1 === '0' &&
                processed.RUNX1 === '0' &&
                processed.NRAS === '0'
                ? '1'
                : '0'
            : processed.SRSF2 === '1' ||
                processed.STAG2 === '1' ||
                processed.BCOR === '1' ||
                processed.BCORL1 === '1' ||
                processed.RUNX1 === '1' ||
                processed.NRAS === '1'
                ? '0'
                : 'NA';
    // Construction of TP53multi feature
    processed.TP53loh =
        ((_a = processed.TP53maxvaf) !== null && _a !== void 0 ? _a : 0) / 100 > 0.55 ||
            processed.del17_17p === '1'
            ? '1'
            : processed.TP53loh;
    processed.TP53mut = String(processed.TP53mut);
    processed.TP53loh = String(processed.TP53loh);
    processed.TP53multi =
        processed.TP53mut === '0'
            ? '0'
            : processed.TP53mut === '2 or more'
                ? '1'
                : (processed.TP53mut === '1') && (processed.TP53loh === '1')
                    ? '1'
                    : (processed.TP53mut === '1') && (processed.TP53loh === '0')
                        ? '0'
                        : 'NA';
    // Transformation of clinical variables
    processed.HB1 = Number(processed.HB);
    processed.BLAST5 = Math.min(Number(processed.BM_BLAST), 20) / 5;
    processed.TRANSF_PLT100 = Math.min(Number(processed.PLT), 250) / 100; // ceiling at 250
    // Cytogenetics as a numerical vector
    processed.CYTOVEC = {
        'Very Good': 0,
        Good: 1,
        Intermediate: 2,
        Poor: 3,
        'Very Poor': 4,
    }[processed.CYTO_IPSSR];
    // Calculate number of residual mutations Nres2 allowing missing genes in the list
    const processedResGenes = Object.fromEntries(Object.entries(processed).filter(([key, _]) => genes_js_1.genesRes.includes(key)));
    const nRes2Means = (_b = betasRiskScore_js_1.default.find((i) => i.name === 'Nres2')) === null || _b === void 0 ? void 0 : _b.means;
    const { nResMean, nResWorst, nResBest } = calculateNResMissing(processedResGenes, nRes2Means);
    processed.Nres2 = {
        means: nResMean,
        worst: nResWorst,
        best: nResBest,
    };
    return processed;
};
exports.processInputs = processInputs;
