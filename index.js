import { promises as fs } from 'fs'
import { toString } from './utils/general.js'
import { processInputs } from './utils/preprocess.js'
import { computeIpssm, computeIpssr as ipssr } from './utils/risk.js'

// IPSS-M risk score method
const ipssm = (patientInput) => {
  const processed = processInputs(patientInput)
  return computeIpssm(processed)
}

// IPSS-M, IPSS-R, and IPSS-RA risks score from a csv file method
const annotateFile = async (inputFile, outFile, separator=',', skipIpssr=false) => {
  const data = await fs.readFile(inputFile, 'utf-8')
  const headers = data.split('\n')[0].trim().split(separator)

  const patients = data
    .split('\n')
    .slice(1)
    .filter((i) => i.trim())
    .map((i) => i.split(separator))

  console.log(`\x1b[33m File has ${patients.length} patients \x1b[0m`)

  const annotatedPatients = patients.map((patient) => {
    // Convert to numbers
    let patientFields = Object.fromEntries(
      patient.map((fieldValue, i) => [
        headers[i],
        isNaN(fieldValue) ? fieldValue : Number(fieldValue),
      ])
    )

    // Add IPSS-M annotation
    const { means, best, worst } = ipssm(patientFields)

    patientFields = {
      ...patientFields,
      IPSSM_SCORE: means.riskScore,
      IPSSM_CAT: means.riskCat,
      IPSSM_SCORE_BEST: best.riskScore,
      IPSSM_CAT_BEST: best.riskCat,
      IPSSM_SCORE_WORST: worst.riskScore,
      IPSSM_CAT_WORST: worst.riskCat,
    }

    // Add IPSS-R and IPSS-RA annotation, if requested
    if (!skipIpssr) {

      const {
        IPSSR_SCORE,
        IPSSR,
        IPSSRA_SCORE,
        IPSSRA,
      } = ipssr({
        hb: patientFields.HB,
        anc: patientFields.ANC,
        plt: patientFields.PLT,
        bmblast: patientFields.BM_BLAST,
        cytoIpssr: patientFields.CYTO_IPSSR,
        age: patientFields.AGE,
      })

      patientFields = {
        ...patientFields,
        IPSSR_SCORE: IPSSR_SCORE,
        IPSSR_CAT: IPSSR,
        IPSSRA_SCORE: IPSSRA_SCORE,
        IPSSRA_CAT: IPSSRA,
      }
    }

    return Object.values(patientFields)
  })

  // Create new csv file with annotated patients
  if (!outFile) {
    outFile = inputFile.replace('.csv', '.annotated.csv')
    console.log(outFile)
  }
  const ipssRColumns = [
    'IPSSR_SCORE',
    'IPSSR_CAT',
    'IPSSRA_SCORE',
    'IPSSRA_CAT'
  ]
  const ipssMColumns = [
    'IPSSM_SCORE',
    'IPSSM_CAT',
    'IPSSM_SCORE_BEST',
    'IPSSM_CAT_BEST',
    'IPSSM_SCORE_WORST',
    'IPSSM_CAT_WORST',
  ]
  const outHeaders = [
    ...headers,
    ...ipssMColumns,
    ...(!skipIpssr ?  ipssRColumns : []),
  ]
  const outData = [outHeaders, ...annotatedPatients].map(row => row.map(column => toString(column)).join(separator)).join('\n')
  await fs.writeFile(outFile, outData, 'utf-8');
}

export { ipssm, ipssr, annotateFile }
