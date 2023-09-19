import { expect } from 'vitest'

// test data expected results
const expectedResults = {
  pp347: {
    IPSSM_SCORE: 0.31,
    IPSSM_CAT: 'Moderate High',
    IPSSM_SCORE_BEST: 0.3,
    IPSSM_CAT_BEST: 'Moderate High',
    IPSSM_SCORE_WORST: 0.63,
    IPSSM_CAT_WORST: 'High',
    IPSSR_SCORE: 4,
    IPSSR_CAT: 'Int',
    IPSSRA_SCORE: 4.27,
    IPSSRA_CAT: 'Int',
  },
  pp564: {
    IPSSM_SCORE: 4.55,
    IPSSM_CAT: 'Very High',
    IPSSM_SCORE_BEST: 4.55,
    IPSSM_CAT_BEST: 'Very High',
    IPSSM_SCORE_WORST: 4.55,
    IPSSM_CAT_WORST: 'Very High',
    IPSSR_SCORE: 10,
    IPSSR_CAT: 'Very High',
    IPSSRA_SCORE: 10,
    IPSSRA_CAT: 'Very High',
  },
  zeroScore: {
    IPSSM_SCORE: 0,
    IPSSM_CAT: 'Moderate Low',
    IPSSM_SCORE_BEST: 0,
    IPSSM_CAT_BEST: 'Moderate Low',
    IPSSM_SCORE_WORST: 0,
    IPSSM_CAT_WORST: 'Moderate Low',
    IPSSR_SCORE: 3.5,
    IPSSR_CAT: 'Int',
    IPSSRA_SCORE: 4.475,
    IPSSRA_CAT: 'Int',
  },
}

const assertExpectedResults = (patientFields, precision = 0.001) => {

  const expected = expectedResults[patientFields.ID]
  const msg = Object.entries(patientFields).map(([k, v]) => `\n\t${k}: ${v}`).join(', ')

  // Assert IPSS-M means, best and worst
  expect(expected.IPSSM_CAT, msg).to.equal(patientFields.IPSSM_CAT)
  expect(expected.IPSSM_SCORE, msg).to.be.closeTo(patientFields.IPSSM_SCORE, precision)
  expect(expected.IPSSM_CAT_BEST, msg).to.equal(patientFields.IPSSM_CAT_BEST)
  expect(expected.IPSSM_SCORE_BEST, msg).to.be.closeTo(patientFields.IPSSM_SCORE_BEST, precision)
  expect(expected.IPSSM_CAT_WORST, msg).to.equal(patientFields.IPSSM_CAT_WORST)
  expect(expected.IPSSM_SCORE_WORST, msg).to.be.closeTo(patientFields.IPSSM_SCORE_WORST, precision)

  // Assert IPSS-R and IPSS-RA
  expect(expected.IPSSR_CAT, msg).to.equal(patientFields.IPSSR_CAT)
  expect(expected.IPSSR_SCORE, msg).to.be.closeTo(patientFields.IPSSR_SCORE, precision)
  expect(expected.IPSSRA_CAT, msg).to.equal(patientFields.IPSSRA_CAT)
  expect(expected.IPSSRA_SCORE, msg).to.be.closeTo(patientFields.IPSSRA_SCORE, precision)
}

const assertScores = ({ expected, computed, ID, type, precision = 0.001 }) => {
  const msg =
    `${ID} ${type}:` +
    `\n\tExpected ${expected.score} (${expected.category})` +
    `\n\tComputed ${computed.score} (${computed.category})`

  expect(expected.category, msg).to.equal(computed.category)
  expect(expected.score, msg).to.be.closeTo(computed.score, precision)
  console.log('✅ ' + msg)
}

const round = (value, digits = 4) =>
  Math.round(value * 10 ** digits) / 10 ** digits

export { round, assertScores, assertExpectedResults }
