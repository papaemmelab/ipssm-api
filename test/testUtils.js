import { expect } from 'vitest'

const categoryMapR = {
  'Very High': 'VERY-HIGH',
  High: 'HIGH',
  Int: 'INT',
  Low: 'LOW',
  'Very Low': 'VERY-LOW',
}

const categoryMapM = {
  'Very High': 'VH',
  High: 'H',
  'Moderate High': 'MH',
  'Moderate Low': 'ML',
  Low: 'L',
  'Very Low': 'VL',
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

export { round, categoryMapR, categoryMapM, assertScores }
