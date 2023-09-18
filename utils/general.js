// Useful utilities
import { genesMain, genesRes } from './genes.js'

const range = (start, stop, step = 1) => {
  return [...Array(stop - start).keys()]
    .filter((i) => !(i % Math.round(step)))
    .map((v) => start + v)
}

const round = (value, digits = 4) =>
  Math.round(value * 10 ** digits) / 10 ** digits

const italicizeGeneNames = (string) => {
  const genes = [
    ...genesMain,
    ...genesRes,
    'MLL',
    'FLT3',
    'KMT2A',
    'TP53',
  ].reverse()
  let italicized = string
  genes.forEach(
    (gene) => (italicized = italicized.replace(gene, `<i>${gene}</i>`))
  )
  return italicized
}

export { range, round, italicizeGeneNames }
