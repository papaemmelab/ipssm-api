import { it, describe, expect } from 'vitest'
import { promises as fs } from 'fs'
import { assertScores, round } from './testUtils.js'

import { ipssm, ipssr, annotateFile } from '../index.js'


describe('Risk Calculations', () => {
  it.skip('Computes risk scores properly in 2022 NJEM Evid cohort', async () => {
    const data = await fs.readFile('./test/data/Bernard_et_all_2022_NJEM_Evid.csv', 'utf-8')
    const separator = ','
    const headers = data.split('\n')[0].trim().split(separator)

    const patients = data
      .split('\n')
      .slice(1)
      .filter((i) => i.trim())
      .map((i) => i.split(separator))

    patients.forEach((patient) => {
      const patientFields = Object.fromEntries(
        patient.map((fieldValue, i) => [
          headers[i],
          isNaN(fieldValue) ? fieldValue : Number(fieldValue),
        ])
      )

      // Get Expected Results
      const {
        ID,
        IPSSM,
        IPSSM_SCORE,
        IPSSR,
        IPSSR_SCORE,
        IPSSRA,
        IPSSRA_SCORE,
      } = patientFields

      // Compute IPSS-R and Age-adjusted IPSS-R

      const ipssrResult = ipssr({
        hb: patientFields.HB,
        anc: patientFields.ANC,
        plt: patientFields.PLT,
        bmblast: patientFields.BM_BLAST,
        cytovec: patientFields.CYTOVEC,
        age: patientFields.AGE,
      })

      assertScores({
        type: 'IPPS-R',
        expected: {
          score: round(IPSSR_SCORE),
          category: IPSSR,
        },
        computed: {
          score: ipssrResult.IPSSR_SCORE,
          category: ipssrResult.IPSSR,
        },
        ID,
      })

      assertScores({
        type: 'IPPS-RA',
        expected: {
          score: round(IPSSRA_SCORE),
          category: IPSSRA,
        },
        computed: {
          score: ipssrResult.IPSSRA_SCORE,
          category: ipssrResult.IPSSRA,
        },
        ID,
      })

      // Compute IPPS-M
      const ipssmResult = ipssm(patientFields)
      assertScores({
        type: 'IPPS-M',
        expected: {
          score: round(IPSSM_SCORE),
          category: IPSSM,
        },
        computed: {
          score: ipssmResult.means.riskScore,
          category: ipssmResult.means.riskCat,
        },
        ID,
      })
    })
  })

  it('Computes scores from a csv file', async () => {
    
    // Run annotateFile on test data
    annotateFile(
      './test/data/IPSSMexample.csv',
      './test/data/IPSSMexample-out.csv'
    )

    // Read outFile and compare to expected results
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
    }

    const data = await fs.readFile('./test/data/IPSSMexample-out.csv', 'utf-8')
    const separator = ','
    const headers = data.split('\n')[0].trim().split(separator)

    const patients = data
      .split('\n')
      .slice(1)
      .filter((i) => i.trim())
      .map((i) => i.split(separator))

    patients.forEach((patient) => {
      const patientFields = Object.fromEntries(
        patient.map((fieldValue, i) => [
          headers[i],
          isNaN(fieldValue) ? fieldValue : Number(fieldValue),
        ])
      )

      const expected = expectedResults[patientFields.ID]
      const precision = 0.001

      const msg = `ID ${patientFields.ID}:` + patient.join(', ')


      
      // Assert IPSS-M means, best and worst
      expect(expected.IPSSM_CAT, msg).to.equal(patientFields.IPSSM_CAT)
      expect(expected.IPSSM_SCORE, msg).to.be.closeTo(patientFields.IPSSM_SCORE, precision)
      expect(expected.IPSSM_CAT_BEST, msg).to.equal(patientFields.IPSSM_CAT_BEST)
      expect(expected.IPSSM_SCORE_BEST, msg).to.be.closeTo(patientFields.IPSSM_SCORE_BEST, precision)
      expect(expected.IPSSM_CAT_WORST, msg).to.equal(patientFields.IPSSM_CAT_WORST)
      expect(expected.IPSSM_SCORE_WORST, msg).to.be.closeTo(patientFields.IPSSM_SCORE_WORST, precision)

      // Assert IPSS-R and IPSS-RA
      expect(expected.IPSSR_CAT, msg).to.equal(patientFields.IPSSR_CAT)
      expect(expected.IPSSR_SCORE, msg).to.be.closeTo(patientFields.IPSSR_SCORE, precision)
      expect(expected.IPSSRA_CAT, msg).to.equal(patientFields.IPSSRA_CAT)
      expect(expected.IPSSRA_SCORE, msg).to.be.closeTo(patientFields.IPSSRA_SCORE, precision)
    
    })
  })

})
