import { expect } from 'vitest'

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

export { round, assertScores }
