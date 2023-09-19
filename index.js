import { processInputs } from './utils/preprocess.js'
import { computeIpssm, computeIpssr as ipssr } from './utils/risk.js'
import { parseCsv, parseXlsx, writeCsv } from './utils/parseFile.js'

// IPSS-M risk score method
const ipssm = (patientInput) => {
  const processed = processInputs(patientInput)
  return computeIpssm(processed)
}

// IPSS-M, IPSS-R, and IPSS-RA risks score from a csv/xlsx file method
const annotateFile = async (inputFile, outputFile, skipIpssr=false) => {

  let patients = []
  if (inputFile.endsWith('.csv') || inputFile.endsWith('.tsv')) {
    patients = await parseCsv(inputFile)
  } else if (inputFile.endsWith('.xlsx')) {
    patients = await parseXlsx(inputFile)
  } else {
    throw new Error('File type not supported')
  }

  const annotatedPatients = patients.map((patient) => {
    const ipssmResult = ipssm(patient)
    // Add IPSS-M results to patient object
    patient = {
      ...patient,
      IPSSM_SCORE: ipssmResult.means.riskScore,
      IPSSM_CAT: ipssmResult.means.riskCat,
      IPSSM_SCORE_BEST: ipssmResult.best.riskScore,
      IPSSM_CAT_BEST: ipssmResult.best.riskCat,
      IPSSM_SCORE_WORST: ipssmResult.worst.riskScore,
      IPSSM_CAT_WORST: ipssmResult.worst.riskCat,
    }

    if (!skipIpssr) {
      const ipssrResult = ipssr({
        hb: patient.HB,
        anc: patient.ANC,
        plt: patient.PLT,
        bmblast: patient.BM_BLAST,
        cytoIpssr: patient.CYTO_IPSSR,
        age: patient.AGE,
      })

      // Add IPSS-R results to patient object
      patient = {
        ...patient,
        IPSSR_SCORE: ipssrResult.IPSSR_SCORE,
        IPSSR_CAT: ipssrResult.IPSSR,
        IPSSRA_SCORE: ipssrResult.IPSSRA_SCORE,
        IPSSRA_CAT: ipssrResult.IPSSRA,
      }
    }

    return patient
  })

  // Create new csv file with annotated patients
  if (!outputFile) {
    outputFile = inputFile.replace('.csv', '.annotated.csv')
    console.log(outputFile)
  }

  await writeCsv(outputFile, annotatedPatients)
  console.log(`✅ Annotated file written to: ${outputFile}`)
}

export { ipssm, ipssr, annotateFile }
