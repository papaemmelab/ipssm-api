import { it, describe, expect } from 'vitest'
import fs from 'fs'
import { assertScores, round, assertExpectedResults } from './testUtils'
import { ipssm, ipssr, annotateFile } from '../src/index'
import { parseCsv, parseXlsx } from '../src/utils/parseFile'


describe('Risk Calculations', () => {
  it('Computes risk scores properly in 2022 NJEM Evid cohort', async () => {
    const inputFile = './test/data/Bernard_et_all_2022_NJEM_Evid.csv'
    const patients = await parseCsv(inputFile)

    // Compute risk scores for each patient and assert expected results
    patients.forEach((patient) => {

      const ipssmResult = ipssm(patient)

      const ipssrResult = ipssr({
        hb: patient.HB,
        anc: patient.ANC,
        plt: patient.PLT,
        bmblast: patient.BM_BLAST,
        cytovec: patient.CYTOVEC,
        age: patient.AGE,
      })

      assertScores({
        type: 'IPPS-M',
        expected: {
          score: round(patient.IPSSM_SCORE),
          category: patient.IPSSM,
        },
        computed: {
          score: ipssmResult.means.riskScore,
          category: ipssmResult.means.riskCat,
        },
        'ID': patient.ID,
      })

      assertScores({
        type: 'IPPS-R',
        expected: {
          score: round(patient.IPSSR_SCORE),
          category: patient.IPSSR,
        },
        computed: {
          score: ipssrResult.IPSSR_SCORE,
          category: ipssrResult.IPSSR_CAT,
        },
        'ID': patient.ID,
      })
      assertScores({
        type: 'IPPS-RA',
        expected: {
          score: round(patient.IPSSRA_SCORE),
          category: patient.IPSSRA,
        },
        computed: {
          score: ipssrResult.IPSSRA_SCORE,
          category: ipssrResult.IPSSRA_CAT,
        },
        'ID': patient.ID,
      })
    })
  })

  it('Computes scores from a csv file', async () => {
    const inputFile = './test/data/IPSSMexample.csv'
    const outputFile = './test/data/IPSSMexample-out.csv'

    if (fs.existsSync(outputFile)) {
      fs.unlinkSync(outputFile)
    }
    await annotateFile(inputFile, outputFile)

    // Read output file and assert expected results
    expect(fs.existsSync(outputFile), `File doesn't exist: ${outputFile} `).toBe(true)
    const patients = await parseCsv(outputFile)
    patients.forEach((patient) => assertExpectedResults(patient))
  })

  it('Computes scores from a xlsx file', async () => {
    const inputFile = './test/data/IPSSMexample.xlsx'
    const outputFile = './test/data/IPSSMexample-out.xlsx'

    if (fs.existsSync(outputFile)) {
      fs.unlinkSync(outputFile)
    }
    await annotateFile(inputFile, outputFile)

    // Read output file and assert expected results
    expect(fs.existsSync(outputFile), `File doesn't exist: ${outputFile} `).toBe(true)
    const patients = await parseXlsx(outputFile)
    patients.forEach((patient) => assertExpectedResults(patient))
  })

  it('Computes scores from a csv file; ouputs a xlsx file', async () => {
    const inputFile = './test/data/IPSSMexample.csv'
    const outputFile = './test/data/IPSSMexample-out.xlsx'

    if (fs.existsSync(outputFile)) {
      fs.unlinkSync(outputFile)
    }
    await annotateFile(inputFile, outputFile)

    // Read output file and assert expected results
    expect(fs.existsSync(outputFile), `File doesn't exist: ${outputFile} `).toBe(true)
    const patients = await parseXlsx(outputFile)
    patients.forEach((patient) => assertExpectedResults(patient))
  })

  it('Computes scores from a xlsx file; ouputs a csv file', async () => {
    const inputFile = './test/data/IPSSMexample.xlsx'
    const outputFile = './test/data/IPSSMexample-out.csv'

    if (fs.existsSync(outputFile)) {
      fs.unlinkSync(outputFile)
    }
    await annotateFile(inputFile, outputFile)

    // Read output file and assert expected results
    expect(fs.existsSync(outputFile), `File doesn't exist: ${outputFile} `).toBe(true)
    const patients = await parseCsv(outputFile)
    patients.forEach((patient) => assertExpectedResults(patient))
  })
})
