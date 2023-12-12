import express, { Request, Response } from 'express'
import { annotateFile, ipssm, ipssr } from './index'
import { validatePatientForIpssr } from './utils/validation'

const app = express()
const port: number = process.env.PORT ? parseInt(process.env.PORT) : 3000

app.use(express.json()) 

// curl -X POST -H "Content-Type: application/json" -d '{"hb":10, "anc":1.5, "plt":150, "bmblast":2, "cytoIpssr":"Good", "age":65}' http://localhost:3000/ipssr
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`)
  console.log(req.body)
  next()
})


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

// Endpoint for Ipssm
app.post('/ipssm', async (req: Request, res: Response) => {
  const patient = req.body

  try {
    const ipssmResult = ipssm(patient)
    res.json(ipssmResult)
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
    res.json(ipssrResult)
  } catch (error) {
    console.log((error as Error).stack)
    res.status(500).json({
      error: 'An error occurred while processing Ipssr.',
      message: (error as Error).message,
    })
  }
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`)
})