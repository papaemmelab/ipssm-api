"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeXlsx = exports.writeCsv = exports.parseXlsx = exports.parseCsv = void 0;
const fs_1 = __importStar(require("fs"));
const papaparse_1 = __importDefault(require("papaparse"));
const exceljs_1 = __importDefault(require("exceljs"));
// Read csv or tsv file
const parseCsv = (inputFile) => __awaiter(void 0, void 0, void 0, function* () {
    const dataString = yield fs_1.promises.readFile(inputFile, 'utf-8');
    const result = papaparse_1.default.parse(dataString, { header: true, skipEmptyLines: true });
    return result.data;
});
exports.parseCsv = parseCsv;
// Read xlsx file
const parseXlsx = (inputFile) => __awaiter(void 0, void 0, void 0, function* () {
    const workbook = new exceljs_1.default.Workbook();
    yield workbook.xlsx.readFile(inputFile);
    let jsonData = [];
    workbook.eachSheet((worksheet, _sheetId) => {
        let sheetData = [];
        let headers = [];
        worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
            var _a, _b;
            if (typeof ((_a = row === null || row === void 0 ? void 0 : row.values) === null || _a === void 0 ? void 0 : _a.slice) === 'function') {
                // If first row, consider it as header
                if (rowNumber === 1) {
                    headers = row.values.slice(1);
                    return;
                }
                // Create an object based on the header and row data
                const rowData = {
                    BM_BLAST: 0,
                    HB: 0,
                    PLT: 0,
                    del5q: '',
                    del7_7q: '',
                    del17_17p: '',
                    complex: '',
                    CYTO_IPSSR: '',
                    Nres2: {}
                };
                (_b = row === null || row === void 0 ? void 0 : row.values) === null || _b === void 0 ? void 0 : _b.slice(1).forEach((value, index) => {
                    // @ts-ignore
                    rowData[headers[index]] = String(value || '');
                });
                sheetData.push(rowData);
            }
        });
        jsonData.push({ sheet: worksheet.name, data: sheetData });
    });
    // Find Worksheet with Patient Data
    let data = null;
    const expectedKeys = ['BM_BLAST', 'HB', 'PLT'];
    jsonData.forEach((sheet) => {
        if (expectedKeys.every(key => sheet.data[0].hasOwnProperty(key))) {
            data = sheet.data;
        }
    });
    return data || [];
});
exports.parseXlsx = parseXlsx;
// Write annotated csv file
const writeCsv = (outputFile, data) => __awaiter(void 0, void 0, void 0, function* () {
    const csvString = papaparse_1.default.unparse(data);
    fs_1.default.writeFileSync(outputFile, csvString, 'utf-8');
    if (!fs_1.default.existsSync(outputFile)) {
        throw new Error(`Unable to write file ${outputFile}`);
    }
});
exports.writeCsv = writeCsv;
// Write annotated xlsx file
const writeXlsx = (outputFile, data) => __awaiter(void 0, void 0, void 0, function* () {
    const workbook = new exceljs_1.default.Workbook();
    const worksheet = workbook.addWorksheet('Sheet 1');
    // Assuming `data` is an array of objects with consistent keys
    const headers = Object.keys(data[0]);
    worksheet.addRow(headers);
    // Add the rows from data
    data.forEach(item => {
        worksheet.addRow(headers.map(header => item[header]));
    });
    yield workbook.xlsx.writeFile(outputFile);
    if (!fs_1.default.existsSync(outputFile)) {
        throw new Error(`Unable to write file ${outputFile}`);
    }
});
exports.writeXlsx = writeXlsx;
