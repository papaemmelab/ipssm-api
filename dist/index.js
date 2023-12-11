"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.annotateFile = exports.ipssr = exports.ipssm = void 0;
const preprocess_1 = require("./utils/preprocess");
const risk_1 = require("./utils/risk");
Object.defineProperty(exports, "ipssr", { enumerable: true, get: function () { return risk_1.computeIpssr; } });
const parseFile_1 = require("./utils/parseFile");
// IPSS-M risk score method
const ipssm = (patientInput) => {
    const processed = (0, preprocess_1.processInputs)(patientInput);
    return (0, risk_1.computeIpssm)(processed);
};
exports.ipssm = ipssm;
// IPSS-M, IPSS-R, and IPSS-RA risks score from a csv/xlsx file method
const annotateFile = (inputFile, outputFile, skipIpssr = false) => __awaiter(void 0, void 0, void 0, function* () {
    if (!inputFile || !outputFile) {
        throw new Error('Input and output files are required');
    }
    let patients = [];
    if (inputFile.endsWith('.csv') || inputFile.endsWith('.tsv')) {
        patients = yield (0, parseFile_1.parseCsv)(inputFile);
    }
    else if (inputFile.endsWith('.xlsx')) {
        patients = yield (0, parseFile_1.parseXlsx)(inputFile);
    }
    else {
        throw new Error('File type not supported');
    }
    const annotatedPatients = patients.map((patient) => {
        // Calculate IPSS-M and add to patient object
        const ipssmResult = ipssm(patient);
        let annotatedPatient = Object.assign(Object.assign({}, patient), { IPSSM_SCORE: ipssmResult.means.riskScore, IPSSM_CAT: ipssmResult.means.riskCat, IPSSM_SCORE_BEST: ipssmResult.best.riskScore, IPSSM_CAT_BEST: ipssmResult.best.riskCat, IPSSM_SCORE_WORST: ipssmResult.worst.riskScore, IPSSM_CAT_WORST: ipssmResult.worst.riskCat });
        if (!skipIpssr && patient.ANC) {
            // Calculate IPSS-R and add to patient object
            const data = {
                bmblast: patient.BM_BLAST,
                hb: patient.HB,
                plt: patient.PLT,
                anc: patient.ANC,
                cytoIpssr: patient.CYTO_IPSSR,
                age: patient.AGE,
            };
            const ipssrResult = (0, risk_1.computeIpssr)(data);
            annotatedPatient = Object.assign(Object.assign({}, annotatedPatient), { IPSSR_SCORE: ipssrResult.IPSSR_SCORE, IPSSR_CAT: ipssrResult.IPSSR_CAT, IPSSRA_SCORE: ipssrResult.IPSSRA_SCORE, IPSSRA_CAT: ipssrResult.IPSSRA_CAT });
        }
        return annotatedPatient;
    });
    // Create new csv file with annotated patients
    if (outputFile.endsWith('.csv') || outputFile.endsWith('.tsv')) {
        yield (0, parseFile_1.writeCsv)(outputFile, annotatedPatients);
    }
    else if (outputFile.endsWith('.xlsx')) {
        yield (0, parseFile_1.writeXlsx)(outputFile, annotatedPatients);
    }
    else {
        throw new Error(`Output File type not supported (only .csv, .tsv, .xlsx)`);
    }
    console.log(`✅ Annotated file written to: ${outputFile}`);
});
exports.annotateFile = annotateFile;
