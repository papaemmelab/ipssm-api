import express, { Request, Response } from 'express'
import path from 'path'
import { annotateFile, ipssm, ipssr } from './index'
import { validatePatientForIpssm, validatePatientForIpssr } from './utils/validation'
import serverless from 'serverless-http'

const app = express()
const port: number = process.env.PORT ? parseInt(process.env.PORT) : 3000

app.use(express.json()) 

// curl -X POST -H "Content-Type: application/json" -d '{"hb":10, "anc":1.5, "plt":150, "bmblast":2, "cytoIpssr":"Good", "age":65}' http://localhost:3000/ipssr
app.use((req, _res, next) => {
  console.log(`${req.method} ${req.url}`)
  console.log(req.body)
  next()
})

// Serve the redoc swagger documentation
app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, '..', 'redoc-static.html'));
});

// Endpoint for Ipssm
app.post('/ipssm', validatePatientForIpssm, async (req: Request, res: Response) => {
  const patient = req.body
  try {
    const ipssmResult = ipssm(patient)
    const response = {
      patient: patient,
      ipssm: ipssmResult,
    }
    res.json(response)
  } catch (error) {
    console.log((error as Error).stack)
    res.status(500).json({
      error: 'An error occurred while processing Ipssm.',
      message: (error as Error).message,
    })
  }
})

// Endpoint for Ipssr
app.post('/ipssr', validatePatientForIpssr, async (req: Request, res: Response) => {
  const patient = req.body
  try {
    const ipssrResult = ipssr({
      hb: patient.HB,
      anc: patient.ANC,
      plt: patient.PLT,
      bmblast: patient.BM_BLAST,
      cytoIpssr: patient.CYTO_IPSSR,
      age: patient.AGE,
    })
    const response = {
      patient: patient,
      ipssr: ipssrResult,
    }
    res.json(response)
  } catch (error) {
    console.log((error as Error).stack)
    res.status(500).json({
      error: 'An error occurred while processing Ipssr.',
      message: (error as Error).message,
    })
  }
})

// Endpoint for annotating a tsv/xlsx file
app.get('/annotateFile', async (req: Request, res: Response) => {
  const inputFile: string = req.query.inputFile as string
  const outputFile: string = req.query.outputFile as string
  
  try {
    await annotateFile(inputFile, outputFile)
    res.send('File annotated successfully.')
  } catch (error) {
    res.status(500).send('An error occurred while annotating the file.')
  }
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})

module.exports.handler = serverless(app)