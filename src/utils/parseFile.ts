import { PatientInput, PatientOutput, CsvData } from '../types'
import fs, { promises as asyncFs } from 'fs'
import Papa, { ParseResult } from 'papaparse'
import Excel from 'exceljs'


// Coerce numeric values to numbers
const coerceNumeric = (rows: CsvData[]): CsvData[] => {
  return rows.map((row) => {
    return Object.fromEntries(
      Object.entries(row).map(([column, value]) => [
        // @ts-ignore
        column, isNaN(value) ? value : Number(value),
      ])
    )
  })
}

// Read csv or tsv file
const parseCsv = async (inputFile: string): Promise<PatientInput[]> => {
  const dataString = await asyncFs.readFile(inputFile, 'utf-8')
  const result: ParseResult<PatientInput> = Papa.parse(dataString, { header: true, skipEmptyLines: true })
  // @ts-ignore
  return coerceNumeric(result.data)
}

// Read xlsx file
const parseXlsx = async (inputFile: string): Promise<PatientInput[]> => {
  const workbook = new Excel.Workbook()
  await workbook.xlsx.readFile(inputFile)
  
  let jsonData: { sheet: string, data: PatientInput[] }[] = []
  workbook.eachSheet((worksheet, _sheetId) => {
      let sheetData: PatientInput[] = []
      let headers: any[] = []
          worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
            if (typeof row?.values?.slice === 'function') {
              // If first row, consider it as header
              if (rowNumber === 1) {
                headers = row.values.slice(1)
                return
              }
  
              // Create an object based on the header and row data
              const rowData: PatientInput = {
                BM_BLAST: 0,
                HB: 0,
                PLT: 0,
                del5q: '',
                del7_7q: '',
                del17_17p: '',
                complex: '',
                CYTO_IPSSR: '',
                Nres2: {}
              }
              row?.values?.slice(1).forEach((value, index) => {
                // @ts-ignore
                rowData[headers[index]] = value
              })
              sheetData.push(rowData)
            }
          })
          jsonData.push({sheet: worksheet.name, data: sheetData})
        })

  // Find Worksheet with Patient Data
  let data: PatientInput[] | null = null
  const expectedKeys = ['SF3B1', 'U2AF1', 'IDH1']
  jsonData.forEach((sheet) => {
      if (expectedKeys.every(key => sheet.data[0].hasOwnProperty(key))) {
          data = sheet.data
      }
  })
  // @ts-ignore
  return coerceNumeric(data || [])
}

// Write annotated csv file
const writeCsv = async (outputFile: string, data: PatientOutput[]): Promise<void> => {
  const csvString = Papa.unparse(data)
  fs.writeFileSync(outputFile, csvString, 'utf-8')

  if (!fs.existsSync(outputFile)) {
    throw new Error(`Unable to write file ${outputFile}`)
  }
}

// Write annotated xlsx file
const writeXlsx = async (outputFile: string, data: PatientOutput[]): Promise<void> => {
  const workbook = new Excel.Workbook()
  const worksheet = workbook.addWorksheet('Sheet 1')

  // Assuming `data` is an array of objects with consistent keys
  const headers = Object.keys(data[0])
  worksheet.addRow(headers)

  // Add the rows from data
  data.forEach(item => {
    worksheet.addRow(headers.map(header => item[header as keyof PatientOutput]))
  })

  await workbook.xlsx.writeFile(outputFile)

  if (!fs.existsSync(outputFile)) {
    throw new Error(`Unable to write file ${outputFile}`)
  }
}

export { parseCsv, parseXlsx, writeCsv, writeXlsx }