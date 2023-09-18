<!-- badges: start -->
[![Compute IPSS-M and IPSS-M Risks on IWG-PM Cohort (Bernard et al, 2022 NJEM Evid)](https://github.com/papaemmelab/ipssm-js/actions/workflows/risk-scores-test.yml/badge.svg)](https://github.com/papaemmelab/ipssm-js/actions/workflows/risk-scores-test.yml)
<!-- badges: end -->

# ipssm (js)

Javascript/Node Package for the Molecular International Prognostic Scoring System (IPSS-M) for Myelodysplastic Syndromes.

- For the R package, see [papaemmelab/ipssm](https://github.com/papaemmelab/ipssm).

- For the Online Web Calculator, visit [https://mds-risk-model.com](https://mds-risk-model.com).

## :rocket: Installation instructions

```bash
# Using npm
npm install ipssm
```

# TODO: Replace all of this

## :boom: IPSS-M Usage

Having a patient's data in a CSV file, the following code will compute the IPSS-M and IPSS-M Risks.

```js
const { ipssm } from ipssm'

// Add patient data to an object with the following fields

const patientgFields = {
  HB: 8.2,
  ANC: 0.72,
  PLT: 239,
  BM_BLAST: 0,
  CYTOVEC: 1,
  AGE: 63.5,
  del5q: 0,
  del7_7q: 0,
  del17_17p: 0,
  complex: 0,
  CYTO_IPSSR: 'Good',
  TP53mut: 0,
  TP53maxvaf: 0,
  TP53loh: 0,
  MLL_PTD: 0,
  FLT3all: 0,
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
  SF3B1_5q: 0,
  SF3B1_alpha: 0,
  TP53multi: 0,
  HB1: 8.2,
  BLAST5: 0,
}

const ipssmResult = ipssm(patientFields)
console.log(ipssmResult)
```

```js
// Result
{
  means: {
    riskScore: 0.09,
    riskCat: 'MH',
    contributions: {...}
  },
  best: {
    riskScore: 0.09,
    riskCat: 'MH',
    contributions: {...}
  },
  worst: {
    riskScore: 0.09,
    riskCat: 'MH',
    contributions: {...}
  },
}
```

### :zap: IPSS-R and IPSS-R (Age adjusted)

Additionally, you may find an implemnetation to compute the IPPS-R and IPSS-R (Age adjusted) in this module:

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
    IPSSR: 'LOW',
    IPSSRA_SCORE: 2.2563,
    IPSSRA: 'LOW'
}
```

  IPSSR_SCORE: 2.5,
  IPSSR: 'Low',
  IPSSRA_SCORE: 2.25625,
  IPSSRA: 'Low',
  IPSSM_SCORE: 0.09,
  IPSSM: 'Moderate High',

Alternatively the above steps can be performed with a one-line code using a wrapper function, as follows.

## :page_with_curl: Reference

[Bernard E, Tuechler H, Greenberg PL, Hasserjian RP, Arango Ossa JE et al. **Molecular International Prognostic Scoring System for Myelodysplastic Syndromes**, *NEJM Evidence* 2022.](https://evidence.nejm.org/doi/full/10.1056/EVIDoa2200008)

## :question: Question

Any questions feel free to add an [issue](https://github.com/ipssm-js/issues) to this repo or to contact [ElsaB](https://elsab.github.io/).
