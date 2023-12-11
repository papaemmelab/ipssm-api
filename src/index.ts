import { PatientInput, PatientOutput, IpssmScores, PatientForIpssr, CsvData } from './types'
import { processInputs } from './utils/preprocess'
import { computeIpssm, computeIpssr as ipssr } from './utils/risk'
import { parseCsv, parseXlsx, writeCsv, writeXlsx } from './utils/parseFile'

// IPSS-M risk score method
const ipssm = (patientInput: PatientInput): IpssmScores => {
  const processed = processInputs(patientInput)
  return computeIpssm(processed)
}

// IPSS-M, IPSS-R, and IPSS-RA risks score from a csv/xlsx file method
const annotateFile = async (inputFile: string, outputFile: string, skipIpssr: boolean = false): Promise<void> => {

  if (!inputFile || !outputFile) {
    throw new Error('Input and output files are required')
  }

  let patients: PatientInput[] = []
  if (inputFile.endsWith('.csv') || inputFile.endsWith('.tsv')) {
    patients = await parseCsv(inputFile)
  } else if (inputFile.endsWith('.xlsx')) {
    patients = await parseXlsx(inputFile)
  } else {
    throw new Error('File type not supported')
  }

  const annotatedPatients: PatientOutput[] = patients.map((patient) => {
    // Calculate IPSS-M and add to patient object
    const ipssmResult = ipssm(patient)
    
    let annotatedPatient: PatientOutput = {
      ...patient,
      IPSSM_SCORE: ipssmResult.means.riskScore,
      IPSSM_CAT: ipssmResult.means.riskCat,
      IPSSM_SCORE_BEST: ipssmResult.best.riskScore,
      IPSSM_CAT_BEST: ipssmResult.best.riskCat,
      IPSSM_SCORE_WORST: ipssmResult.worst.riskScore,
      IPSSM_CAT_WORST: ipssmResult.worst.riskCat,
    }

    if (!skipIpssr && patient.ANC) {
      // Calculate IPSS-R and add to patient object
      const data: PatientForIpssr = {
        bmblast: patient.BM_BLAST,
        hb: patient.HB,
        plt: patient.PLT,
        anc: patient.ANC,
        cytoIpssr: patient.CYTO_IPSSR,
        age: patient.AGE,
      }

      const ipssrResult = ipssr(data)

      annotatedPatient = {
        ...annotatedPatient,
        IPSSR_SCORE: ipssrResult.IPSSR_SCORE,
        IPSSR_CAT: ipssrResult.IPSSR_CAT,
        IPSSRA_SCORE: ipssrResult.IPSSRA_SCORE,
        IPSSRA_CAT: ipssrResult.IPSSRA_CAT,
      }
    }

    return annotatedPatient
  })
  
  // Create new csv file with annotated patients
  if (outputFile.endsWith('.csv') || outputFile.endsWith('.tsv')) {
    await writeCsv(outputFile, annotatedPatients)
  } else if (outputFile.endsWith('.xlsx')) {
    await writeXlsx(outputFile, annotatedPatients)
  } else {
    throw new Error(`Output File type not supported (only .csv, .tsv, .xlsx)`)
  }
  console.log(`✅ Annotated file written to: ${outputFile}`)
}

export { ipssm, ipssr, annotateFile }
