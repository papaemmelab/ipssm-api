import { PatientInput, PatientForIpssr, PatientWithIpssr, IpssmScores, BetaRiskScore } from '../types'
import betas from './betasRiskScore.js'
import { round } from './general.js'


const ipssrCat: string[] = [
  'Very Low',
  'Low',
  'Int',
  'High',
  'Very High',
]
const ipssmCat: string[] = [
  'Very Low',
  'Low', 
  'Moderate Low', 
  'Moderate High', 
  'High', 
  'Very High', 
]

// Utility to find value between intervals, and map interval number to value
const cutBreak = (
  value: number, 
  breaks: number[], 
  mapping: (number | string)[], 
  right: boolean = true,
): number | string => {
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
  return NaN // default value
}

/**
 * Compute IPSS-R risk score and risk categories
 * @param {number} bmblast - bone marrow blasts, in %
 * @param {number} hb - hemoglobin, in gram per deciliter
 * @param {number} plt - platelet, in giga per liter
 * @param {number} anc - absolute neutrophile count, in giga per liter
 * @param {number} cytovec - cytogenetic category in numerical form
 * @param {number} cytoIpssr - cytogenetic category in categorical form
 * @param {number} [age] - Age, in years
 *
 * @return {Object} dictionary of ipssr and ipssr-age adjusted, score and category.
 */
const computeIpssr = (
  { bmblast, hb, plt, anc, cytovec, cytoIpssr, age }: PatientForIpssr,
  rounding: boolean = true,
  roundingDigits: number = 4
) : PatientWithIpssr => {
  
  // Get proper Cytogenetic category
  const cytovecMap: { [key: string]: number } = {'Very Good': 0, 'Good': 1, 'Intermediate': 2, 'Poor': 3, 'Very Poor': 4}
  if (!cytovec && cytoIpssr) {
    cytovec = cytovecMap[cytoIpssr]
  }
  if (cytovec === undefined) {
    throw new Error('Cytogenetic category is not valid.')
  }

  // Get Variable Ranges, defining each category breaks and value mapping
  const bmblastBreak = [-Infinity, 2, 5, 10, Infinity]
  const hbBreak = [-Infinity, 8, 10, Infinity]
  const pltBreak = [-Infinity, 50, 100, Infinity]
  const ancBreak = [-Infinity, 0.8, Infinity]
  const ipssrgBreaks = [-Infinity, 1.5, 3, 4.5, 6, Infinity]

  const bmblastMap = [0, 1, 2, 3] //{ 0: 0, 1: 1, 2: 2, 3: 3 }
  const hbMap = [1.5, 1, 0] //{ 0: 1.5, 1: 1, 2: 0 }
  const pltMap = [1, 0.5, 0] //{ 0: 1, 1: 0.5, 2: 0 }
  const ancMap = [0.5, 0] //{ 0: 0.5, 1: 0 }
  
  const bmblastri = Number(cutBreak(bmblast, bmblastBreak, bmblastMap, true))
  const hbri = Number(cutBreak(hb, hbBreak, hbMap, false))
  const pltri = Number(cutBreak(plt, pltBreak, pltMap, false))
  const ancri = Number(cutBreak(anc, ancBreak, ancMap, false))

  // Build IPSS-R raw score 
  let ipssr: string | null = null
  let ipssrRaw: number | null = null

  ipssrRaw = hbri + ancri + pltri + bmblastri + cytovec
  if (rounding) {
    ipssrRaw = round(ipssrRaw, roundingDigits)
  }
  ipssr = cutBreak(ipssrRaw, ipssrgBreaks, ipssrCat).toString()

  // Build IPSS-RA Age-Adjusted if available
  let ipssra: string | null = null
  let ipssraRaw: number | null = null
  
  if (age !== null && age !== undefined) {
    const ageAdjust = (age - 70) * (0.05 - ipssrRaw * 0.005)
    ipssraRaw = ipssrRaw + ageAdjust
    if (rounding) {
      ipssraRaw = round(ipssraRaw, roundingDigits)
    }
    ipssra = cutBreak(ipssraRaw, ipssrgBreaks, ipssrCat).toString()
  }

  return {
    IPSSR_SCORE: ipssrRaw,
    IPSSR_CAT: ipssr,
    IPSSRA_SCORE: ipssraRaw,
    IPSSRA_CAT: ipssra,
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
  patientValues: PatientInput,
  rounding: boolean = true,
  roundingDigits: number = 2,
  cutpoints: number[] = [-1.5, -0.5, 0, 0.5, 1.5]
) : IpssmScores => {
  // relative risk contribution of each variable. log2 is just a scaling factor
  const scores: IpssmScores = {
    means: {
      riskScore: 0,
      riskCat: '',
      contributions: {},
    },
    worst: {
      riskScore: 0,
      riskCat: '',
      contributions: {},
    },
    best: {
      riskScore: 0,
      riskCat: '',
      contributions: {},
    },
  }

  Object.keys(scores).forEach((scenario) => {
    const contributions: {[key: string]: number} = {}

    betas.forEach((beta) => {
      // Impute if missing variable
      let value = patientValues[beta.name as keyof PatientInput]
      if (value === 'NA' || value === null) {
        value = beta[scenario as keyof BetaRiskScore]
      }
      if (beta.name === 'Nres2') {
        value = patientValues.Nres2[scenario]
      }

      // Contribution Normalization
      contributions[beta.name] =
        ((Number(value) - beta.means) * beta.coeff) / Math.log(2) ?? 0
    })

    // risk score
    let riskScore = Object.values(contributions).reduce((sum: number, x) => sum + x, 0)
    if (rounding) {
      riskScore = round(riskScore, roundingDigits)
    }

    // risk categories
    const riskCat = cutBreak(
      riskScore,
      [-Infinity, ...cutpoints, Infinity],
      ipssmCat
    ).toString()

    scores[scenario as keyof IpssmScores] = {
      riskScore: riskScore,
      riskCat: riskCat,
      contributions: contributions,
    }
  })
  return scores
}

export { computeIpssr, computeIpssm }
