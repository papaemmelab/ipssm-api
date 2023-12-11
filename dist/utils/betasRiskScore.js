"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const betas = [
    { name: 'CYTOVEC', coeff: 0.287, means: 1.39, worst: 4, best: 0 },
    { name: 'BLAST5', coeff: 0.352, means: 0.922, worst: 4, best: 0 },
    { name: 'TRANSF_PLT100', coeff: -0.222, means: 1.41, worst: 0, best: 2.5 },
    { name: 'HB1', coeff: -0.171, means: 9.87, worst: 2, best: 20 },
    { name: 'SF3B1_alpha', coeff: -0.0794, means: 0.186, worst: 0, best: 1 },
    { name: 'SF3B1_5q', coeff: 0.504, means: 0.0166, worst: 1, best: 0 },
    { name: 'ASXL1', coeff: 0.213, means: 0.252, worst: 1, best: 0 },
    { name: 'SRSF2', coeff: 0.239, means: 0.158, worst: 1, best: 0 },
    { name: 'DNMT3A', coeff: 0.221, means: 0.161, worst: 1, best: 0 },
    { name: 'RUNX1', coeff: 0.423, means: 0.126, worst: 1, best: 0 },
    { name: 'U2AF1', coeff: 0.247, means: 0.0866, worst: 1, best: 0 },
    { name: 'EZH2', coeff: 0.27, means: 0.0588, worst: 1, best: 0 },
    { name: 'CBL', coeff: 0.295, means: 0.0473, worst: 1, best: 0 },
    { name: 'NRAS', coeff: 0.417, means: 0.0362, worst: 1, best: 0 },
    { name: 'IDH2', coeff: 0.379, means: 0.0429, worst: 1, best: 0 },
    { name: 'KRAS', coeff: 0.202, means: 0.0271, worst: 1, best: 0 },
    { name: 'MLL_PTD', coeff: 0.798, means: 0.0247, worst: 1, best: 0 },
    { name: 'ETV6', coeff: 0.391, means: 0.0216, worst: 1, best: 0 },
    { name: 'NPM1', coeff: 0.43, means: 0.0112, worst: 1, best: 0 },
    { name: 'TP53multi', coeff: 1.18, means: 0.071, worst: 1, best: 0 },
    { name: 'FLT3', coeff: 0.798, means: 0.0108, worst: 1, best: 0 },
    { name: 'Nres2', coeff: 0.231, means: 0.388, worst: 2, best: 0 },
];
exports.default = betas;
