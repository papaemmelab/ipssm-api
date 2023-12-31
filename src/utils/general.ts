// Useful utilities
import { genesMain, genesRes } from './genes.js'

const range = (start: number, stop: number, step: number = 1): number[] => {
  return [...Array(stop - start).keys()]
    .filter((i) => !(i % Math.round(step)))
    .map((v) => start + v)
}

const round = (value: number, digits: number = 4): number =>
  Math.round(value * 10 ** digits) / 10 ** digits

const italicizeGeneNames = (value: string): string => {
  const genes = [
    ...genesMain,
    ...genesRes,
    'MLL',
    'FLT3',
    'KMT2A',
    'TP53',
  ].reverse()
  let italicized = value
  genes.forEach(
    (gene) => (italicized = italicized.replace(gene, `<i>${gene}</i>`))
  )
  return italicized
}

const toString = (value: string | null | undefined): string => {
  if (value === null || value === undefined) {
    return 'NA'
  }
  return value
}

export { range, round, italicizeGeneNames, toString }
