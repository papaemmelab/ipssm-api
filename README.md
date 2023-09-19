<!-- badges: start -->
[![Compute IPSS-M and IPSS-M Risks on IWG-PM Cohort (Bernard et al, 2022 NJEM Evid)](https://github.com/papaemmelab/ipssm-js/actions/workflows/risk-scores-test.yml/badge.svg)](https://github.com/papaemmelab/ipssm-js/actions/workflows/risk-scores-test.yml)


[![npm version](https://badge.fury.io/js/ipssm.svg)](https://badge.fury.io/js/ipssm)
[![npm badge](https://data.jsdelivr.com/v1/package/npm/ipssm/badge)](https://www.jsdelivr.com/package/npm/ipssm)

<!-- badges: end -->

# ipssm (js)

Javascript/Node Package for the Molecular International Prognostic Scoring System (IPSS-M) for Myelodysplastic Syndromes.

- For the R package, see [papaemmelab/ipssm](https://github.com/papaemmelab/ipssm).

- For the Online Web Calculator, visit [https://mds-risk-model.com](https://mds-risk-model.com).

## Table of contents

- [📖 IPSS-M Publication](#page_with_curl-ipss-m-publication)
- [🚀 Installation instructions](#rocket-installation-instructions)
- [💥 IPSS-M Usage](#boom-ipss-m-usage)
  - [🔥 Compute IPSS-M](#fire-compute-ipss-m)
  - [⚡️ IPSS-R and IPSS-R (Age adjusted)](#zap-ipss-r-and-ipss-r-age-adjusted)
  - [🎯 Annotating batch from CSV/Excel file](#dart-annotating-batch-from-csvexcel-file)
  - [🦾 Using the command line interface](#mechanical_arm-using-the-command-line-interface)
- [🗒️ Input Variables Definition](#spiral_notepad-input-variables-definition)
- [❓ Question](#question-question)

[inputs](#inputs)

## :page_with_curl: IPSS-M Publication

[Bernard E, Tuechler H, Greenberg PL, Hasserjian RP, Arango Ossa JE et al. **Molecular International Prognostic Scoring System for Myelodysplastic Syndromes**, *NEJM Evidence* 2022.](https://evidence.nejm.org/doi/full/10.1056/EVIDoa2200008)


## :rocket: Installation instructions

```bash
# Using npm
npm install ipssm
```

## :boom: IPSS-M Usage

### :fire: Compute IPSS-M

Having a patient's data in a dictionary, you can compute the IPSS-M.

```js
const { ipssm } from 'ipssm'

// Add patient data to an object with the following fields
const patientFields = {
  // Clinical Data
  BM_BLAST: 0,
  HB: 8.2,
  PLT: 239,
  // Optional IPSS-R fields
  ANC: 0.72,
  AGE: 63.5,
  // Cytogenetic Data 
  del5q: 0,
  del7_7q: 0,
  del17_17p: 0,
  complex: 0, 
  CYTO_IPSSR: 'Good',
  // Molecular Data
  TP53mut: 0,
  TP53maxvaf: 0,
  TP53loh: 0,
  MLL_PTD: 0,
  FLT3: 0,
  ASXL1: 1,
  CBL: 0,
  DNMT3A: 0,
  ETV6: 0,
  EZH2: 1,
  IDH2: 0,
  KRAS: 0,
  NPM1: 0,
  NRAS: 0,
  RUNX1: 1,
  SF3B1: 0,
  SRSF2: 0,
  U2AF1: 0,
  BCOR: 0,
  BCORL1: 0,
  CEBPA: 0,
  ETNK1: 0,
  GATA2: 0,
  GNB1: 0,
  IDH1: 0,
  NF1: 0,
  PHF6: 0,
  PPM1D: 0,
  PRPF8: 0,
  PTPN11: 0,
  SETBP1: 0,
  STAG2: 0,
  WT1: 0,
}

const ipssmResult = ipssm(patientFields)
console.log(ipssmResult)
```

```js
// Result
{
  means: {
    riskScore: 0.09,
    riskCat: 'Moderate High',
    contributions: {...}
  },
  best: {
    riskScore: 0.09,
    riskCat: 'Moderate High',
    contributions: {...}
  },
  worst: {
    riskScore: 0.09,
    riskCat: 'Moderate High',
    contributions: {...}
  },
}
```

### :zap: IPSS-R and IPSS-R (Age adjusted)

Additionally, you may find an implementation to compute the IPPS-R and IPSS-R (Age adjusted) in this module:

```js
import { ipssr } from 'ipssm'

// using the same patient data
patientFields = {
  HB: 8.2,
  ANC: 0.72,
  PLT: 239,
  BM_BLAST: 0,
  CYTOVEC: 1,
  AGE: 63.5,
  ...
}

const ipssrResult = ipssr({
  hb: patientFields.HB,
  anc: patientFields.ANC,
  plt: patientFields.PLT,
  bmblast: patientFields.BM_BLAST,
  cytovec: patientFields.CYTOVEC,
  age: patientFields.AGE,
})

console.log(ipssrResult)
```

Which outputs a risk score (means), with a best and worst scenario risk score to account for missing genetic data.

```js
// Result
{
    IPSSR_SCORE: 2.5,
    IPSSR: 'Low',
    IPSSRA_SCORE: 2.2563,
    IPSSRA: 'Low',
}
```

### :dart: Annotating batch from CSV/Excel file

The following code will annotate a CSV file with the IPSS-M and IPSS-M Risks.

```js
import { annotateFile } from 'ipssm'

const inputFile = './test/data/IPSSMexample.csv'
const outputFile = 'IPSSMexample.annotated.csv'

await annotateFile(inputFile, outputFile)
```

or with an excel file:

```js
import { annotateFile } from 'ipssm'

const inputFile = './test/data/IPSSMexample.xlsx'
const outputFile = 'IPSSMexample.annotated.xlsx'

await annotateFile(inputFile, outputFile)
```

### :mechanical_arm: Using the command line interface

You can use the command line interface to annotate a file with patients, where each row is a patient and each column is a variable.

```text
$  ipssm --help

Annotate a file of patients with IPSS-M and IPSS-R risk scores and categories.
It supports .csv, .tsv, .xlsx files.

Usage: ipssm <inputFile> <outputFile>

Positionals:
  inputFile   File to be annotated (rows: patients, columns: variables).[string]
  outputFile  Path for the annotated output file.                       [string]

Options:
      --version  Show version number                                   [boolean]
  -h, --help     Show help                                             [boolean]
```

<!-- Anchor to target cli help -->
<span id="inputs" />

## :spiral_notepad: Input Variables Definition



| Category                   | Variable Explanation          | Variable     | Unit                         | Possible Value                                              |
|----------------------------|-------------------------------|--------------|------------------------------|-------------------------------------------------------------|
| clinical                   | Hemoglobin                    | `HB`         | numerical, in g/dL           | [`4`-`20`]                                                      |
| clinical                   | Platelets                     | `PLT`        | numerical, in Giga/L         | [`0`-`2000`]                                                    |
| clinical                   | Bone Marrow Blasts            | `BM_BLAST`   | numerical, in %              | [`0`-`30`]                                                      |
| clinical (only for IPSS-R) | Absolute Neutrophil Count     | `ANC`        | numerical, in Giga/L         | [`0`-`15`]                                                      |
| clinical (only for IPSS-RA)| Bone Marrow Blasts            | `AGE`        | numerical, in years          | [`18`-`120`]                                                    |
| cytogenetics               | Presence of del(5q)           | `del5q`      | binary                       | `0`/`1`                                                         |
| cytogenetics               | Presence of -7/del(7q)        | `del7_7q`    | binary                       | `0`/`1`                                                         |
| cytogenetics               | Presence of -17/del(17p)      | `del17_17p`  | binary                       | `0`/`1`                                                         |
| cytogenetics               | Complex karyotype             | `complex`    | binary                       | `0`/`1`                                                         |
| cytogenetics               | Cytogenetics Category         | `CYTO_IPSSR` | categorical                  | `Very Good`/`Good`/`Intermediate`/`Poor`/`Very Poor`        |
| TP53 locus                 | Number of TP53 mutations      | `TP53mut`    | categorical                  | `0`/`1`/`2 or more`                                             |
| TP53 locus                 | Maximum TP53 VAF              | `TP53maxvaf` | numerical, between 0 and 1   | [`0`-`1`]                                                       |
| TP53 locus                 | Loss of heterozygosity at TP53| `TP53loh`    | binary                       | `0`/`1`                                                         |
| MLL and FLT3 mutations     | MLL PTD                       | `MLL_PTD`    | binary                       | `0`/`1`                                                         |
| MLL and FLT3 mutations     | FLT3 ITD or TKD               | `FLT3`       | binary                       | `0`/`1`                                                         |
| gene main effect           | ASXL1                         | `ASXL1`      | binary                       | `0`/`1`/`NA`                                                    |
| gene main effect           | CBL                           | `CBL`        | binary                       | `0`/`1`/`NA`                                                    |
| gene main effect           | DNMT3A                        | `DNMT3A`     | binary                       | `0`/`1`/`NA`                                                    |
| gene main effect           | ETV6                          | `ETV6`       | binary                       | `0`/`1`/`NA`                                                    |
| gene main effect           | EZH2                          | `EZH2`       | binary                       | `0`/`1`/`NA`                                                    |
| gene main effect           | IDH2                          | `IDH2`       | binary                       | `0`/`1`/`NA`                                                    |
| gene main effect           | KRAS                          | `KRAS`       | binary                       | `0`/`1`/`NA`                                                    |
| gene main effect           | NPM1                          | `NPM1`       | binary                       | `0`/`1`/`NA`                                                    |
| gene main effect           | NRAS                          | `NRAS`       | binary                       | `0`/`1`/`NA`                                                    |
| gene main effect           | RUNX1                         | `RUNX1`      | binary                       | `0`/`1`/`NA`                                                    |
| gene main effect           | SF3B1                         | `SF3B1`      | binary                       | `0`/`1`/`NA`                                                    |
| gene main effect           | SRSF2                         | `SRSF2`      | binary                       | `0`/`1`/`NA`                                                    |
| gene main effect           | U2AF1                         | `U2AF1`      | binary                       | `0`/`1`/`NA`                                                    |
| gene residual              |                               | `BCOR`       | binary                       | `0`/`1`/`NA`                                                    |
| gene residual              |                               | `BCORL1`     | binary                       | `0`/`1`/`NA`                                                    |
| gene residual              |                               | `CEBPA`      | binary                       | `0`/`1`/`NA`                                                    |
| gene residual              |                               | `ETNK1`      | binary                       | `0`/`1`/`NA`                                                    |
| gene residual              |                               | `GATA2`      | binary                       | `0`/`1`/`NA`                                                    |
| gene residual              |                               | `GNB1`       | binary                       | `0`/`1`/`NA`                                                    |
| gene residual              |                               | `IDH1`       | binary                       | `0`/`1`/`NA`                                                    |
| gene residual              |                               | `NF1`        | binary                       | `0`/`1`/`NA`                                                    |
| gene residual              |                               | `PHF6`       | binary                       | `0`/`1`/`NA`                                                    |
| gene residual              |                               | `PPM1D`      | binary                       | `0`/`1`/`NA`                                                    |
| gene residual              |                               | `PTPN11`     | binary                       | `0`/`1`/`NA`                                                    |
| gene residual              |                               | `PRPF8`      | binary                       | `0`/`1`/`NA`                                                    |
| gene residual              |                               | `SETBP1`     | binary                       | `0`/`1`/`NA`                                                    |
| gene residual              |                               | `STAG2`      | binary                       | `0`/`1`/`NA`                                                    |
| gene residual              |                               | `WT1`        | binary                       | `0`/`1`/`NA`                                                    |

## :question: Question

Any questions feel free to add an [issue](https://github.com/papaemmelab/ipssm-js/issues) to this repo or to contact [ElsaB](https://elsab.github.io/).
