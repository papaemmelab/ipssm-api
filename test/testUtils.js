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
  withNAs: {
    IPSSM_SCORE: 0.32,
    IPSSM_CAT: 'Moderate High',
    IPSSM_SCORE_BEST: 0.30,
    IPSSM_CAT_BEST: 'Moderate High',
    IPSSM_SCORE_WORST: 0.63,
    IPSSM_CAT_WORST: 'High',
    IPSSR_SCORE: 4.00,
    IPSSR_CAT: 'Int',
    IPSSRA_SCORE: 4.27,
    IPSSRA_CAT: 'Int',
  },
  SF3B1alphaTestCase: {
    IPSSM_SCORE: -0.22,
    IPSSM_CAT: 'Moderate Low',
    IPSSM_SCORE_BEST: -0.30,
    IPSSM_CAT_BEST: 'Moderate Low',
    IPSSM_SCORE_WORST: 0.31,
    IPSSM_CAT_WORST: 'Moderate High',
    IPSSR_SCORE: NaN,
    IPSSR_CAT: NaN,
    IPSSRA_SCORE: NaN,
    IPSSRA_CAT: NaN,
  },
}

const assertExpectedResults = (patientFields, precision = 0.001) => {
  const expected = expectedResults[patientFields.ID]
  const msg = Object.entries(patientFields).map(([k, v]) => `\n\t${k}: ${v}`).join(', ') + '\n'

  // Assert IPSS-M means, best and worst
  expect(patientFields.IPSSM_CAT, msg).to.equal(expected.IPSSM_CAT)
  expect(patientFields.IPSSM_CAT_BEST, msg).to.equal(expected.IPSSM_CAT_BEST)
  expect(patientFields.IPSSM_CAT_WORST, msg).to.equal(expected.IPSSM_CAT_WORST)
  expect(Number(patientFields.IPSSM_SCORE), msg).to.be.closeTo(expected.IPSSM_SCORE, precision)
  expect(Number(patientFields.IPSSM_SCORE_BEST), msg).to.be.closeTo(expected.IPSSM_SCORE_BEST, precision)
  expect(Number(patientFields.IPSSM_SCORE_WORST), msg).to.be.closeTo(expected.IPSSM_SCORE_WORST, precision)

  // Assert IPSS-R and IPSS-RA
  if (!isNaN(expected.IPSSR_SCORE)) {
    expect(patientFields.IPSSR_CAT, msg).to.equal(expected.IPSSR_CAT)
    expect(Number(patientFields.IPSSR_SCORE), msg).to.be.closeTo(expected.IPSSR_SCORE, precision)
  } else {
    expect(Number(patientFields.IPSSR_SCORE), msg).to.be.NaN
  }
  if (!isNaN(expected.IPSSRA_SCORE)) {
    expect(patientFields.IPSSRA_CAT, msg).to.equal(expected.IPSSRA_CAT)
    expect(Number(patientFields.IPSSRA_SCORE), msg).to.be.closeTo(expected.IPSSRA_SCORE, precision)
  } else {
    expect(Number(patientFields.IPSSRA_SCORE), msg).to.be.NaN
  }
}

const assertScores = ({ expected, computed, ID, type, precision = 0.001 }) => {
  const msg =
    `${ID} ${type}:` +
    `\n\tExpected ${expected.score} (${expected.category})` +
    `\n\tComputed ${computed.score} (${computed.category})`

  expect(computed.category, msg).to.equal(expected.category)
  expect(computed.score, msg).to.be.closeTo(expected.score, precision)
  console.log('✅ ' + msg)
}

const round = (value, digits = 4) =>
  Math.round(value * 10 ** digits) / 10 ** digits

export { round, assertScores, assertExpectedResults }
