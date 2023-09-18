import { it, describe } from 'vitest'
import { promises as fs } from 'fs'
import { assertScores, categoryMapR, categoryMapM, round } from './testUtils.js'

import { ipssm, ipssr } from '../index.js'


describe('Risk Calculations', () => {
  describe('Load test dataset', () => {
    it('Computes risk scores properly in cohort', async () => {
      const data = await fs.readFile('./test/df_testdata_012422.csv', 'utf-8')
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
  })
})
