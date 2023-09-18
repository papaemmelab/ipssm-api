import betas from './betasRiskScore.js'
import { round } from './general.js'

// Utility to find value between intervals, and map interval number to value
const cutBreak = (value, breaks, mapping, right = true) => {
  for (let i = 1; i < breaks.length; i++) {
    if (right) {
      // Intervals are closed to the right, and open to the left
      if (value > breaks[i - 1] && value <= breaks[i]) {
        return mapping ? mapping[i - 1] : i - 1
      }
    } else {
      // Intervals are open to the right, and closed to the left
      if (value >= breaks[i - 1] && value < breaks[i]) {
        return mapping ? mapping[i - 1] : i - 1
      }
    }
  }
}

/**
 * Compute IPSS-R risk score and risk categories
 * @param {number} hb - hemoglobin, in gram per deciliter
 * @param {number} anc - absolute neutrophile count, in giga per liter
 * @param {number} plt - platelet, in giga per liter
 * @param {number} bmblast - bone marrow blasts, in %
 * @param {number} cytovec - cytogenetic category in numerical form
 * @param {number} [age] - Age, in years
 *
 * @return {Object} dictionary of ipssr and ipssr-age adjusted, score and category.
 */
const computeIpssr = (
  { hb, anc, plt, bmblast, cytovec, age },
  rounding = true,
  roundingDigits = 4
) => {
  // build category and score
  const hbri = cutBreak(
    hb,
    [-Infinity, 8, 10, Infinity],
    {
      0: 1.5,
      1: 1,
      2: 0,
    },
    false
  )
  const ancri = cutBreak(
    anc,
    [-Infinity, 0.8, Infinity],
    { 0: 0.5, 1: 0 },
    false
  )
  const pltri = cutBreak(
    plt,
    [-Infinity, 50, 100, Infinity],
    {
      0: 1,
      1: 0.5,
      2: 0,
    },
    false
  )
  const bmblastri = cutBreak(
    bmblast,
    [-Infinity, 2, 4.99, 10, Infinity],
    {
      0: 0,
      1: 1,
      2: 2,
      3: 3,
    },
    true
  )

  // build raw score
  let ipssrRaw = hbri + ancri + pltri + bmblastri + cytovec
  if (rounding) {
    ipssrRaw = round(ipssrRaw, roundingDigits)
  }

  // build categories
  const ipssrgBreaks = [-Infinity, 1.5, 3, 4.5, 6, Infinity]
  // const ipssrCat = ['Very Low', 'Low', 'Int', 'High', 'Very High']
  const ipssrCat = ['VERY-LOW', 'LOW', 'INT', 'HIGH', 'VERY-HIGH']
  const ipssr = cutBreak(ipssrRaw, ipssrgBreaks, ipssrCat)

  let ipssraRaw = null
  let ipssra = null
  if (![null, undefined].includes(age)) {
    // if age is present build score with age interaction
    const ageAdjust = (age - 70) * (0.05 - ipssrRaw * 0.005)
    ipssraRaw = ipssrRaw + ageAdjust

    if (rounding) {
      ipssraRaw = round(ipssraRaw, roundingDigits)
    }

    // build categories
    ipssra = cutBreak(ipssraRaw, ipssrgBreaks, ipssrCat)
  }

  return {
    IPSSR_SCORE: ipssrRaw,
    IPSSR: ipssr,
    IPSSRA_SCORE: ipssraRaw,
    IPSSRA: ipssra,
  }
}

/**
 * Compute IPSS-M risk score and risk categories
 * @param {Array.<number>} patientValues - list of observed values for one individual
 * @param {boolean} [rounding] - flag if rounding should be applied
 * @param {number} [roundingDigits] - decimal digits to round
 * @param {Array.<number>} [cutpoints] - list of cutoff values of group categories
 *
 * @return {Object} dictionary of ipssm: score, category and contribution of each var.
 */
const computeIpssm = (
  patientValues,
  rounding = true,
  roundingDigits = 2,
  cutpoints = [-1.5, -0.5, 0, 0.5, 1.5]
) => {
  // relative risk contribution of each variable. log2 is just a scaling factor
  const scores = {}
  const scenarios = ['means', 'worst', 'best']

  scenarios.forEach((scenario) => {
    const contributions = {}

    betas.forEach((beta) => {
      // Impute if missing variable
      let value = patientValues[beta.name]
      if (value === 'NA' || value === null) {
        value = beta[scenario]
      }
      if (beta.name === 'Nres2') {
        value = patientValues.Nres2[scenario]
      }

      // Contribution Normalization
      contributions[beta.name] =
        ((value - beta.means) * beta.coeff) / Math.log(2)
    })

    // risk score
    let riskScore = Object.values(contributions).reduce((sum, x) => sum + x, 0)
    if (rounding) {
      riskScore = round(riskScore, roundingDigits)
    }

    // risk categories
    const ipssmCat = ['VL', 'L', 'ML', 'MH', 'H', 'VH']
    const riskCat = cutBreak(
      riskScore,
      [-Infinity, ...cutpoints, Infinity],
      ipssmCat
    )

    scores[scenario] = {
      riskScore: riskScore,
      riskCat: riskCat,
      contributions: contributions,
    }
  })
  return scores
}

export { computeIpssr, computeIpssm }
