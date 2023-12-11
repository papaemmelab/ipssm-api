import { it, describe } from 'vitest'
import { assertExpectedResults } from './testUtils'
import { parseCsv, parseXlsx } from '../src/utils/parseFile'
import { ipssm, ipssr } from '../src/index'


const runRiskOnPatients = (patients) => {
  patients.forEach((patient) => {

    // Run IPSS-M and IPSS-R
    const ipssmResult = ipssm(patient)
    const ipssrResult = ipssr({
      hb: patient.HB,
      anc: patient.ANC,
      plt: patient.PLT,
      bmblast: patient.BM_BLAST,
      cytoIpssr: patient.CYTO_IPSSR,
      age: patient.AGE,
    })

    // Add results to patient object
    const patientFields = {
      ...patient,
      IPSSM_SCORE: ipssmResult.means.riskScore,
      IPSSM_CAT: ipssmResult.means.riskCat,
      IPSSM_SCORE_BEST: ipssmResult.best.riskScore,
      IPSSM_CAT_BEST: ipssmResult.best.riskCat,
      IPSSM_SCORE_WORST: ipssmResult.worst.riskScore,
      IPSSM_CAT_WORST: ipssmResult.worst.riskCat,
      IPSSR_SCORE: ipssrResult.IPSSR_SCORE,
      IPSSR_CAT: ipssrResult.IPSSR_CAT,
      IPSSRA_SCORE: ipssrResult.IPSSRA_SCORE,
      IPSSRA_CAT: ipssrResult.IPSSRA_CAT,
    }

    // Assert expected results
    assertExpectedResults(patientFields)
  })
}

describe('File Parsing', () => {

  it('Parses data from csv file and computes score', async () => {
    const csv = './test/data/IPSSMexample.csv'
    const dataCsv = await parseCsv(csv)
    runRiskOnPatients(dataCsv)
  })

  it('Parses data from xlsx file and computes score', async () => {
    const xlsx = './test/data/IPSSMexample.xlsx'
    const dataXlsx = await parseXlsx(xlsx)
    runRiskOnPatients(dataXlsx)
  })
  
})

    
